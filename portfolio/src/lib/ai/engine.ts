import { capabilities, knownGaps, otherRole, resumeRules, roles } from "@/content/fit";
import { resumeBySlug, resumes } from "@/content/experience";
import { projectBySlug } from "@/content/projects";
import { EVIDENCE_LABEL } from "@/content/types";
import { allowedHrefs } from "./knowledge";
import { getRetriever } from "./retrieval";
import { detectInjection, detectRestricted, logEvent, RESTRICTED_REPLY, sanitize, scrubOutput } from "./guard";
import { circuit, withinModelBudget } from "./ratelimit";
import { createAnthropicModel } from "./providers/anthropic";
import { LIMITS, NO_EVIDENCE, ResponseSchema } from "./types";
import type { AgentMode, AiAction, AiRequest, AiResponse, ChatModel, KnowledgeRecord, Retrieved } from "./types";

/**
 * The agent engine. One coordinated system with specialised modes:
 *
 *   concierge  retrieval + grounded generation          (read-only)
 *   project    the same, scoped to one case study        (read-only)
 *   recruiter  transparent role rules                    (read-only, no model)
 *   resume     transparent résumé rules                  (read-only, no model)
 *   fit        deterministic job-description comparison  (read-only, no model)
 *   contact    message preparation; never sends          (read-only, no model)
 *
 * No mode has a tool that writes, sends, schedules or reads private data.
 * The only "actions" are suggestions returned to the browser, validated
 * against an allowlist here and — for contact prefill — gated behind an
 * explicit visitor confirmation in the interface.
 */

let model: ChatModel | null | undefined;
export function getModel(): ChatModel | null {
  if (model === undefined) model = createAnthropicModel();
  return model;
}

export function aiStatus() {
  const m = getModel();
  return {
    enabled: process.env.AI_ENABLED !== "off",
    engine: m ? ("model" as const) : ("retrieval" as const),
    vendor: m?.vendor ?? null,
    model: m?.name ?? null,
  };
}

type Stage = (label: string) => void;

const base = (mode: AgentMode): AiResponse => ({
  mode,
  status: "answered",
  answer: "",
  interpretation: null,
  blocks: [],
  sources: [],
  actions: [],
  followups: [],
  engine: "rules",
});

const CONTACT_ACTION: AiAction = { type: "navigate", label: "Contact Riyad", href: "/contact" };

function finalize(r: AiResponse): AiResponse {
  const ok = allowedHrefs();
  const safeHref = (h: string) => ok.has(h) || ok.has(h.split("#")[0]) || ok.has(h.split("?")[0]);
  r.sources = r.sources.filter((s) => safeHref(s.href)).slice(0, LIMITS.sources);
  r.actions = r.actions.filter((a) => {
    if (a.type === "navigate") return safeHref(a.href);
    if (a.type === "resume") return Boolean(resumeBySlug(a.slug));
    return true;
  });
  r.blocks = r.blocks.map((b) => ({ ...b, items: b.items.map((i) => (i.href && !safeHref(i.href) ? { text: i.text } : i)) }));
  r.answer = scrubOutput(r.answer).slice(0, 2400);
  if (r.interpretation) r.interpretation = scrubOutput(r.interpretation).slice(0, 1200);
  // Fail closed: if the response does not match the schema, send a safe fallback instead.
  const parsed = ResponseSchema.safeParse(r);
  if (parsed.success) return parsed.data;
  return { ...base(r.mode), status: "unavailable", answer: "Riyad AI could not prepare that answer. The portfolio pages remain fully available.", actions: [{ type: "navigate", label: "View selected work", href: "/work" }] };
}

const toSources = (records: KnowledgeRecord[]) => {
  const seen = new Set<string>();
  return records
    .filter((r) => (seen.has(r.sourceUrl.split("#")[0] + r.sourceLabel) ? false : seen.add(r.sourceUrl.split("#")[0] + r.sourceLabel)))
    .map((r) => ({ label: r.sourceLabel, href: r.sourceUrl, evidence: EVIDENCE_LABEL[r.evidence] }));
};

const sentences = (text: string, n: number) =>
  (text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text]).slice(0, n).join("").trim();

/* ------------------------------------------------------------------ */

async function noEvidence(mode: AgentMode, query: string, project?: string): Promise<AiResponse> {
  // Still be useful: offer the nearest adjacent material, a contact route and a prompt to clarify.
  const adjacent = await getRetriever().search(`${query} work experience project`, { mode: "concierge", limit: 2 }).catch(() => []);
  const r = base(mode);
  r.status = "no-evidence";
  r.engine = "retrieval";
  r.answer = NO_EVIDENCE;
  r.blocks = [
    {
      title: "What I can offer instead",
      items: [
        ...adjacent.map((a) => ({ text: `Closest published material: ${a.record.sourceLabel}`, href: a.record.sourceUrl })),
        { text: "Ask Riyad directly through the contact page", href: "/contact" },
        { text: "Or rephrase the question — for example, name a role, project or skill." },
      ],
    },
  ];
  r.actions = [CONTACT_ACTION, project ? { type: "navigate", label: "Back to the case study", href: `/work/${project}` } : { type: "navigate", label: "Browse selected work", href: "/work" }];
  r.followups = ["What is Riyad's strongest experience?", "Which case study should I read first?"];
  return r;
}

function composeLocally(mode: AgentMode, hits: Retrieved[]): AiResponse {
  const r = base(mode);
  r.engine = "retrieval";
  const [top, ...rest] = hits;
  r.answer = top.record.category === "faq" ? top.record.content : sentences(top.record.content, 3);
  if (top.record.evidence === "approximate") r.interpretation = "Figures are approximate professional scope, not audited counts.";
  const points = rest
    .filter((h) => h.score >= top.score * 0.45)
    .slice(0, 3)
    .map((h) => ({ text: sentences(h.record.content, 2).slice(0, 400), href: h.record.sourceUrl }));
  if (points.length) r.blocks.push({ title: "Supporting evidence", items: points });
  r.sources = toSources([top.record, ...rest.slice(0, 3).map((h) => h.record)]);
  return r;
}

function nextActions(records: KnowledgeRecord[], project?: string): { actions: AiAction[]; followups: string[] } {
  const actions: AiAction[] = [];
  const first = records.find((r) => r.category === "case-study" && r.relatedProjects[0] !== project);
  if (first) {
    const p = projectBySlug(first.relatedProjects[0]);
    if (p) actions.push({ type: "navigate", label: `Open ${p.title}`, href: `/work/${p.slug}` });
  }
  if (records.some((r) => r.category === "experience" || r.id === "faq-leadership"))
    actions.push({ type: "navigate", label: "View leadership evidence", href: "/experience#leadership" });
  if (records.some((r) => r.category === "resume")) actions.push({ type: "mode", label: "Choose a résumé", mode: "resume" });
  if (records.some((r) => r.id === "faq-contact")) actions.push({ type: "mode", label: "Prepare a message", mode: "contact" });
  if (actions.length === 0) actions.push({ type: "navigate", label: "Browse selected work", href: "/work" });
  const followups = project
    ? ["What was Riyad's role?", "What evidence is verified?", "What is complete and what remains experimental?"]
    : ["Has Riyad led teams?", "Tell me about OsynJobs.", "Which résumé should I download?"];
  return { actions: actions.slice(0, 3), followups };
}

async function answerGrounded(req: AiRequest, text: string, stage: Stage): Promise<AiResponse> {
  const mode = req.mode;
  stage("Searching approved portfolio sources");
  const history = (req.history ?? []).slice(-LIMITS.historyTurns).map((h) => ({ role: h.role, text: sanitize(h.text, LIMITS.historyText).text }));
  // Short follow-ups ("and his role?") borrow context from the previous question for retrieval only.
  const lastUser = [...history].reverse().find((h) => h.role === "user")?.text ?? "";
  const scope = req.project ? projectBySlug(req.project)?.title ?? "" : "";
  const query = `${text.split(/\s+/).length < 5 ? lastUser : ""} ${text} ${mode === "project" ? scope : ""}`.trim();

  const hits = await getRetriever().search(query, { mode, project: req.project, limit: 6 });
  if (hits.length === 0) {
    logEvent("ai.no_evidence", { mode });
    return noEvidence(mode, text, req.project);
  }

  stage("Reviewing relevant evidence");
  const records = hits.map((h) => h.record);
  let out: AiResponse | null = null;

  const chat = getModel();
  if (chat && !circuit.isOpen() && (await withinModelBudget())) {
    stage("Preparing a grounded answer");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LIMITS.timeoutMs);
    try {
      const draft = await chat.generate({ question: text, history, records, mode, signal: controller.signal });
      circuit.success();
      if (draft) {
        if (!draft.hasEvidence) return noEvidence(mode, text, req.project);
        // Deterministic citation check: the model may only cite records it was actually given.
        const byId = new Map(records.map((r) => [r.id, r]));
        const cited = draft.citedRecordIds.map((id) => byId.get(id)).filter((r): r is KnowledgeRecord => Boolean(r));
        if (cited.length !== draft.citedRecordIds.length) logEvent("ai.citation_rejected", { mode });
        if (cited.length > 0) {
          out = base(mode);
          out.engine = "model";
          out.answer = draft.answer;
          out.interpretation = draft.interpretation;
          const points = draft.supportingPoints.slice(0, 5).map((t) => ({ text: scrubOutput(t).slice(0, 400) }));
          if (points.length) out.blocks.push({ title: "Supporting evidence", items: points });
          out.sources = toSources(cited);
          out.followups = draft.followups.slice(0, 3).map((f) => scrubOutput(f).slice(0, 120));
        }
        // An answer with no valid citation is discarded and replaced by the grounded fallback below.
      }
    } catch {
      circuit.failure();
      logEvent("ai.model_error", { mode });
    } finally {
      clearTimeout(timer);
    }
  } else {
    stage("Preparing a grounded answer");
  }

  if (!out) out = composeLocally(mode, hits);
  const next = nextActions(records, req.project);
  out.actions = next.actions;
  if (out.followups.length === 0) out.followups = next.followups;
  return out;
}

/* ------------------------------------------------------------------ *
 * Rule-based modes. Fully deterministic and shown to the visitor.
 * ------------------------------------------------------------------ */

function pickResume(text: string): { slug: string; matched: string[]; rule: string } {
  const lower = ` ${text.toLowerCase()} `;
  let best = { slug: "product-manager-ai-products", matched: [] as string[], rule: resumeRules[2].when };
  for (const rule of resumeRules) {
    const matched = rule.keywords.filter((k) => new RegExp(`[^a-z]${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(lower));
    if (matched.length > best.matched.length) best = { slug: rule.resume, matched, rule: rule.when };
  }
  return best;
}

function recruiter(req: AiRequest, text: string): AiResponse {
  const role = roles.find((r) => r.id === req.role) ?? roles.find((r) => text.toLowerCase().includes(r.label.toLowerCase())) ?? otherRole;
  const resume = resumeBySlug(role.resume)!;
  const r = base("recruiter");
  r.answer = `${role.label}: ${role.alignment.toLowerCase()}. ${role.why}`;
  r.blocks = [
    { title: "Strongest evidence", items: role.strongest.map((t) => ({ text: t })) },
    {
      title: "Recommended case studies",
      items: role.caseStudies.map((s, i) => ({ text: `${i + 1}. ${projectBySlug(s)?.title ?? s}`, href: `/work/${s}` })),
    },
    { title: "Recommended résumé", items: [{ text: `${resume.name} résumé`, href: `/resume/${resume.slug}` }] },
    { title: "Transferable strengths", items: role.transferable.map((t) => ({ text: t })) },
    { title: "Potential discussion areas", items: role.discussion.map((t) => ({ text: t })) },
  ];
  r.interpretation =
    "Alignment labels are a reading of published portfolio evidence against the role. They are not an assessment of Riyad as a person and not a hiring recommendation.";
  r.sources = role.caseStudies.map((s) => ({ label: projectBySlug(s)?.title ?? s, href: `/work/${s}`, evidence: "Portfolio evidence" }));
  r.sources.push({ label: "Experience", href: "/experience", evidence: "Portfolio evidence" });
  r.actions = [
    { type: "resume", label: `Open the ${resume.short} résumé`, slug: resume.slug },
    { type: "mode", label: "Compare a job description", mode: "fit" },
    CONTACT_ACTION,
  ];
  r.followups = ["Has Riyad led cross-functional teams?", "What is Riyad's strongest experience?"];
  return r;
}

function resumeAgent(req: AiRequest, text: string): AiResponse {
  const role = roles.find((x) => x.id === req.role);
  const pick = role ? { slug: role.resume, matched: [role.label], rule: `Selected role: ${role.label}.` } : pickResume(text);
  const resume = resumeBySlug(pick.slug)!;
  const r = base("resume");
  r.answer = `For this, I recommend the ${resume.name} résumé.`;
  r.blocks = [
    { title: "Reasons", items: resume.reasons.map((t) => ({ text: t })) },
    {
      title: "Recommendation logic",
      items: [
        { text: `Rule applied: ${pick.rule}` },
        { text: pick.matched.length ? `Matched on: ${pick.matched.slice(0, 6).join(", ")}` : "No specific terms matched, so the default product résumé is suggested." },
        { text: "There is no hidden scoring. The rule with the most matching terms wins." },
      ],
    },
    { title: "All résumé paths", items: resumes.map((x) => ({ text: `${x.name} — for ${x.forRoles.slice(0, 3).join(", ")}`, href: `/resume/${x.slug}` })) },
  ];
  r.sources = [{ label: `${resume.name} résumé`, href: `/resume/${resume.slug}`, evidence: "Verified" }];
  r.actions = [
    { type: "resume", label: `Open the ${resume.short} résumé`, slug: resume.slug },
    { type: "navigate", label: "See all résumés", href: "/resume" },
  ];
  return r;
}

function fit(text: string): AiResponse {
  const lower = ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
  const has = (k: string) => lower.includes(k);
  const matched = capabilities.map((c) => ({ c, hits: c.keywords.filter(has) })).filter((m) => m.hits.length > 0);
  const strong = matched.filter((m) => m.c.strength === "strong").sort((a, b) => b.hits.length - a.hits.length);
  const partial = matched.filter((m) => m.c.strength === "partial").sort((a, b) => b.hits.length - a.hits.length);
  const gaps = knownGaps.filter((g) => g.keywords.some(has));
  const words = text.split(/\s+/).length;
  const r = base("fit");

  if (words < 25 || matched.length + gaps.length === 0) {
    r.status = "no-evidence";
    r.answer = "I need a fuller job description to compare. Paste the responsibilities and requirements sections and I will map them against Riyad's published evidence.";
    r.actions = [{ type: "mode", label: "Choose a role instead", mode: "recruiter" }];
    return r;
  }

  const titleLine = text.split("\n").map((l) => l.trim()).find((l) => l.length > 3 && l.length < 90) ?? "";
  const resume = resumeBySlug(pickResume(text).slug)!;
  const sourceSet = new Map<string, { label: string; href: string; evidence: string }>();
  for (const m of [...strong, ...partial]) for (const s of m.c.sources) sourceSet.set(s.href, { ...s, evidence: "Portfolio evidence" });
  const path = [...new Set([...strong, ...partial].flatMap((m) => m.c.sources).filter((s) => s.href.startsWith("/work/")).map((s) => s.href))].slice(0, 3);

  r.answer = `Role summary: this description${titleLine ? ` (“${scrubOutput(titleLine).slice(0, 80)}”)` : ""} touches ${matched.length} area${matched.length === 1 ? "" : "s"} covered by Riyad's portfolio evidence — ${strong.length} with direct evidence and ${partial.length} with partial or transferable evidence — and ${gaps.length} requirement${gaps.length === 1 ? "" : "s"} the portfolio does not yet evidence.`;
  r.blocks = [
    {
      title: "Strongest matches",
      items: strong.length ? strong.slice(0, 7).map((m) => ({ text: `${m.c.label} — ${m.c.evidence}`, href: m.c.sources[0].href })) : [{ text: "No requirement in this description maps to direct portfolio evidence." }],
    },
    { title: "Partial matches", items: partial.length ? partial.slice(0, 5).map((m) => ({ text: `${m.c.label} — ${m.c.evidence}`, href: m.c.sources[0].href })) : [{ text: "None identified." }] },
    {
      title: "Missing or unverified requirements",
      items: gaps.length ? gaps.slice(0, 8).map((g) => ({ text: `${g.label} — no verified portfolio evidence yet.` })) : [{ text: "No commonly required item was flagged as missing. Requirements outside the portfolio's vocabulary may still exist — read the description against the case studies." }],
    },
    { title: "Recommended résumé", items: [{ text: `${resume.name} résumé`, href: `/resume/${resume.slug}` }] },
    { title: "Recommended portfolio path", items: path.map((href, i) => ({ text: `${i + 1}. ${projectBySlug(href.replace("/work/", ""))?.title ?? href}`, href })) },
    {
      title: "Suggested interview discussion points",
      items: [
        ...strong.slice(0, 2).map((m) => ({ text: `Ask how the evidence for “${m.c.label}” would transfer to your context.` })),
        ...partial.slice(0, 2).map((m) => ({ text: `Explore depth on “${m.c.label}”, where evidence is partial.` })),
        ...gaps.slice(0, 2).map((g) => ({ text: `Ask directly about “${g.label}”, which the portfolio does not cover.` })),
      ],
    },
  ].filter((b) => b.items.length > 0);
  r.interpretation =
    "This comparison is an informational portfolio feature, not an automated hiring decision. It matches terms in the description against a published list of evidenced capabilities and known gaps. It gives no score, and the pasted text is not stored.";
  r.sources = [...sourceSet.values()];
  r.actions = [{ type: "resume", label: `Open the ${resume.short} résumé`, slug: resume.slug }, { type: "mode", label: "Prepare a message", mode: "contact" }];
  return r;
}

const INQUIRIES: { label: string; keywords: string[]; include: string[]; relevant: string }[] = [
  { label: "Learning technology role", keywords: ["learning", "elearning", "training", "lms", "instructional", "course", "edtech"], include: ["The role title and team", "The learning platforms and authoring tools you use", "The scale of the catalogue or audience"], relevant: "1,500–2,000+ eLearning courses across 20–25 UK brands, Storyline and Rise frameworks, and team enablement." },
  { label: "UX or product design role", keywords: ["design", "ux", "ui", "designer", "brand"], include: ["The role title and product", "The design problems you most need solved", "How design works with product and engineering"], relevant: "UI/UX and design-system work for StudyHub UK and the end-to-end design of OsynJobs." },
  { label: "AI and automation collaboration", keywords: ["ai", "automation", "agent", "llm", "workflow"], include: ["The workflow you want to improve", "Where AI is used today, if at all", "What a good result would look like"], relevant: "An AI-assisted learning media workflow led in production, and AI-native product building." },
  { label: "Consulting project", keywords: ["consult", "freelance", "contract", "project", "advis"], include: ["The problem you are trying to solve", "Timeline and scope", "Who the work is for"], relevant: "Experience taking problems from need to working system across learning, design and AI." },
  { label: "Product role", keywords: ["product", "pm", "roadmap", "startup", "founder"], include: ["The role title and product stage", "The team Riyad would work with", "The problems the role owns"], relevant: "Founder and Product Manager of OsynJobs, and cross-functional leadership of a 15–20-person project." },
  { label: "International remote opportunity", keywords: ["remote", "role", "job", "position", "hiring", "opportunity", "recruit"], include: ["The role title and a link to the description", "Time-zone expectations", "The hiring process and timeline"], relevant: "Riyad is available for selected international remote opportunities." },
];

function contact(text: string): AiResponse {
  const lower = text.toLowerCase();
  const inquiry = INQUIRIES.find((i) => i.keywords.some((k) => lower.includes(k))) ?? {
    label: "Professional conversation",
    include: ["Who you are and what you work on", "What you would like to talk about", "Any link that gives useful context"],
    relevant: "Riyad works across product, learning systems, design and AI.",
  };
  const r = base("contact");
  r.answer = `This looks like: ${inquiry.label}. I can prepare a draft for you to review. Nothing is sent by me — you approve it, it fills the contact form, and you decide whether to submit.`;
  r.blocks = [
    { title: "Worth including", items: inquiry.include.map((t) => ({ text: t })) },
    { title: "Relevant experience", items: [{ text: inquiry.relevant, href: "/experience" }] },
  ];
  const visitorWords = sanitize(text, 600).text;
  r.actions = [
    {
      type: "contact_prefill",
      label: "Preview a draft message",
      fields: {
        inquiry: inquiry.label,
        message: `Hello Riyad,\n\n${visitorWords}\n\nDetails:\n${inquiry.include.map((i) => `- ${i}: `).join("\n")}\n\nBest regards,`,
      },
    },
    CONTACT_ACTION,
  ];
  r.sources = [{ label: "Contact", href: "/contact", evidence: "Verified" }];
  return r;
}

/* ------------------------------------------------------------------ */

export async function runAgent(req: AiRequest, stage: Stage): Promise<AiResponse> {
  const max = req.mode === "fit" ? LIMITS.jobDescription : LIMITS.message;
  const { text, removedInvisible } = sanitize(req.message, max);
  if (!text) return finalize({ ...base(req.mode), status: "blocked", answer: "That message was empty after removing unsupported characters. Please try again in plain text." });

  // Hidden characters in a short question are a strong sign of smuggled instructions.
  if (removedInvisible > 8 && req.mode !== "fit") {
    logEvent("ai.blocked.invisible", { mode: req.mode, removed: removedInvisible });
    return finalize({ ...base(req.mode), status: "blocked", answer: "That message contained hidden characters, so I have not processed it. Please retype your question in plain text." });
  }

  // A pasted job description is only ever keyword-matched in code — it never
  // reaches a model — so embedded instructions in it have nothing to act on.
  // The same is true of recruiter, résumé and contact modes: rules only, no model.
  if (req.mode === "concierge" || req.mode === "project") {
    if (detectInjection(text)) {
      logEvent("ai.blocked.injection", { mode: req.mode, length: text.length });
      return finalize({
        ...base(req.mode),
        status: "blocked",
        answer: "I can only answer questions about Riyad's published work, experience and projects. I cannot share or change how I am configured, or access anything outside the public portfolio.",
        followups: ["Who is Riyad?", "What is Riyad's strongest experience?"],
      });
    }
    const restricted = detectRestricted(text);
    if (restricted) {
      logEvent("ai.declined.restricted", { mode: req.mode, kind: restricted });
      return finalize({ ...base(req.mode), status: "declined", answer: RESTRICTED_REPLY[restricted], actions: [{ type: "mode", label: "Prepare a message", mode: "contact" }, CONTACT_ACTION] });
    }
  }

  switch (req.mode) {
    case "recruiter":
      return finalize(recruiter(req, text));
    case "resume":
      return finalize(resumeAgent(req, text));
    case "fit":
      stage("Reviewing relevant evidence");
      return finalize(fit(text));
    case "contact":
      return finalize(contact(text));
    default:
      return finalize(await answerGrounded(req, text, stage));
  }
}
