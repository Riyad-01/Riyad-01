import { projects } from "@/content/projects";
import { lab } from "@/content/lab";
import { experience, experienceNote, faqs, resumes } from "@/content/experience";
import { metrics, metricsNote, principles, workSteps, site, tools } from "@/content/site";
import { PUBLIC_EVIDENCE, SECTION_ORDER, SECTION_TITLE, STATUS_LABEL } from "@/content/types";
import type { EvidenceStatus } from "@/content/types";
import type { AgentMode, KnowledgeRecord } from "./types";

/**
 * The curated public knowledge base.
 *
 * Records are generated from the same structured content that renders the
 * site, so the AI can never know something the pages do not say. Nothing is
 * read from the filesystem, a CMS, analytics, email or any private source.
 */

const ALL: AgentMode[] = ["concierge", "recruiter", "project", "resume", "fit", "contact"];
const PLACEHOLDER = /\[[A-Z][A-Z ,:'’\-—a-z0-9()]*\]/g;

const clean = (text: string) => text.replace(PLACEHOLDER, "").replace(/\s{2,}/g, " ").trim();
const hasPlaceholder = (text: string) => /\[(ADD|VERIFY)\b/.test(text);

function rec(
  r: Pick<KnowledgeRecord, "id" | "title" | "content" | "category" | "sourceUrl" | "sourceLabel" | "evidence"> &
    Partial<KnowledgeRecord>,
): KnowledgeRecord {
  return {
    publication: "published",
    lastReviewed: site.lastReviewed,
    owner: "Riyad Ahmed",
    sensitivity: "public",
    relatedProjects: [],
    modes: ALL,
    ...r,
    content: clean(r.content),
  };
}

function build(): KnowledgeRecord[] {
  const out: KnowledgeRecord[] = [];

  out.push(
    rec({
      id: "profile",
      title: "Profile",
      content: `${site.name} is an ${site.role} based in ${site.location}. He designs and builds AI-enabled products, learning systems, and intelligent workflows that make learning and work easier. Mission: ${site.mission} Status: ${site.availability.label}. Riyad connects human needs, learning, product strategy, UX and design, content, AI and automation, team enablement and business outcomes.`,
      category: "profile",
      sourceUrl: "/about",
      sourceLabel: "About",
      evidence: "verified",
      keywords: ["who", "riyad", "about", "summary", "identity"],
    }),
    rec({
      id: "philosophy",
      title: "Working principles",
      content: `Principles: ${principles.join(" ")} Process: ${workSteps.map((p) => `${p.label} — ${p.body}`).join(" ")}`,
      category: "philosophy",
      sourceUrl: "/about",
      sourceLabel: "About",
      evidence: "verified",
      keywords: ["principles", "process", "approach", "philosophy", "method"],
    }),
    rec({
      id: "tools",
      title: "Tools and skills",
      content: `Tools and skills listed in the portfolio: ${tools.verified.map((g) => `${g.group}: ${g.items.join(", ")}`).join(". ")}. The specific AI tools and models used are not yet listed.`,
      category: "tools",
      sourceUrl: "/about#tools",
      sourceLabel: "About — tools",
      evidence: "verified",
      keywords: ["tools", "skills", "stack", "software", "figma", "storyline", "rise", "react", "next.js"],
    }),
    rec({
      id: "experience-overview",
      title: "Experience overview",
      content: experienceNote,
      category: "experience",
      sourceUrl: "/experience",
      sourceLabel: "Experience",
      evidence: "approximate",
    }),
  );

  for (const f of faqs) {
    out.push(
      rec({
        id: `faq-${f.id}`,
        title: f.question,
        content: f.answer,
        category: "faq",
        sourceUrl: f.sources[0].href,
        sourceLabel: f.sources[0].label,
        evidence: f.evidence,
        keywords: f.keywords,
      }),
    );
  }

  for (const m of metrics) {
    out.push(
      rec({
        id: `metric-${m.id}`,
        title: `${m.value} ${m.label}`,
        content: `${m.value} — ${m.label}. ${m.detail} ${metricsNote}`,
        category: "metric",
        sourceUrl: m.source.href,
        sourceLabel: m.source.label,
        evidence: m.evidence,
      }),
    );
  }

  for (const p of projects) {
    const url = `/work/${p.slug}`;
    out.push(
      rec({
        id: `cs-${p.slug}-overview`,
        title: `${p.title} — overview`,
        content: `${p.summary} Classification: ${p.classification.join(", ")}. Type: ${p.kind}. Status: ${p.statusLabel}. Riyad's roles: ${p.roles.join(", ")}. Demonstrates: ${p.disciplines.join(", ")}. Key evidence: ${p.proof.join("; ")}.`,
        category: "case-study",
        sourceUrl: url,
        sourceLabel: p.title,
        evidence: p.kind === "Personal product" ? "personal-project" : "professional-work",
        relatedProjects: [p.slug, ...p.related],
        keywords: [p.title.toLowerCase(), ...p.disciplines.map((d) => d.toLowerCase())],
      }),
    );
    for (const key of SECTION_ORDER) {
      const s = p.sections[key];
      const text = [...(s.body ?? []), ...(s.list ?? [])].filter((t) => !hasPlaceholder(t)).join(" ");
      if (text.length < 40) continue;
      out.push(
        rec({
          id: `cs-${p.slug}-${key}`,
          title: `${p.title} — ${SECTION_TITLE[key]}`,
          content: text,
          category: "case-study",
          sourceUrl: `${url}#${key}`,
          sourceLabel: `${p.title} — ${SECTION_TITLE[key]}`,
          evidence: s.evidence,
          relatedProjects: [p.slug],
          keywords: [p.title.toLowerCase(), SECTION_TITLE[key].toLowerCase()],
        }),
      );
    }
  }

  for (const l of lab) {
    out.push(
      rec({
        id: `lab-${l.slug}`,
        title: `${l.name} — Product Lab`,
        content: hasPlaceholder(l.oneLine)
          ? `${l.name} is a Product Lab initiative. Status: ${l.statusLabel} (${STATUS_LABEL[l.status]}). Further detail is awaiting confirmation. It is not commercially launched.`
          : `${l.name}: ${l.oneLine} Status: ${l.statusLabel} (${STATUS_LABEL[l.status]}). Problem explored: ${l.problem} What was built: ${l.built} Decision: ${l.decision} Related capability: ${l.capability}. It is not commercially launched.`,
        category: "lab",
        sourceUrl: `/lab#${l.slug}`,
        sourceLabel: `Product Lab — ${l.name}`,
        // Status and name are confirmed facts even when the description is not.
        evidence: "personal-project",
        relatedProjects: l.caseStudy ? [l.caseStudy] : [],
        keywords: [l.name.toLowerCase(), "lab", "prototype", "experiment"],
      }),
    );
  }

  for (const e of experience) {
    out.push(
      rec({
        id: `exp-${e.id}`,
        title: `Experience — ${e.chapter}`,
        content: `${e.summary} ${e.responsibilities.join(" ")} Type: ${e.kind}.`,
        category: "experience",
        sourceUrl: `/experience#${e.id}`,
        sourceLabel: `Experience — ${e.chapter}`,
        evidence: e.status,
        relatedProjects: e.related,
      }),
    );
  }

  for (const r of resumes) {
    out.push(
      rec({
        id: `resume-${r.slug}`,
        title: `${r.name} résumé`,
        content: `The ${r.name} résumé is recommended for: ${r.forRoles.join(", ")}. ${r.summary} Why: ${r.reasons.join("; ")}.`,
        category: "resume",
        sourceUrl: `/resume/${r.slug}`,
        sourceLabel: `${r.name} résumé`,
        evidence: "verified",
        keywords: ["resume", "résumé", "cv", "download"],
      }),
    );
  }

  return out;
}

const isPublic = (r: KnowledgeRecord) =>
  r.publication === "published" && r.sensitivity === "public" && (PUBLIC_EVIDENCE as EvidenceStatus[]).includes(r.evidence);

let cache: KnowledgeRecord[] | null = null;

/** Only public, approved records ever leave this module. */
export function publicRecords(): KnowledgeRecord[] {
  if (!cache) cache = build().filter(isPublic);
  return cache;
}

/** Internal routes the AI is allowed to link to. Anything else is dropped. */
export function allowedHrefs(): Set<string> {
  const set = new Set<string>(["/", "/work", "/lab", "/about", "/experience", "/resume", "/ai", "/contact", "/privacy", "/#process"]);
  for (const r of publicRecords()) {
    set.add(r.sourceUrl);
    set.add(r.sourceUrl.split("#")[0]);
  }
  for (const r of resumes) set.add(`/resume/${r.slug}`);
  return set;
}
