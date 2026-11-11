"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { roles } from "@/content/fit";
import { projectBySlug } from "@/content/projects";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { AI_LABEL, LIMITS } from "@/lib/ai/types";
import type { AgentMode, AiAction, AiResponse, StreamEvent } from "@/lib/ai/types";
import { useUI } from "../UI";

/**
 * Riyad AI workspace — one coordinated interface for every agent mode.
 * The conversation lives in component state only: it is never written to
 * storage, and it disappears when the tab closes or "Clear" is pressed.
 */

interface Turn {
  id: number;
  mode: AgentMode;
  question: string;
  stage: string | null;
  response: AiResponse | null;
}

const MODES: { id: AgentMode; label: string; hint: string }[] = [
  { id: "concierge", label: "Ask", hint: "Ask anything about Riyad’s work, experience and projects." },
  { id: "recruiter", label: "I am hiring", hint: "Pick a role to see the evidence that matters for it." },
  { id: "fit", label: "Compare a job description", hint: "Paste a job description to map it against published evidence." },
  { id: "resume", label: "Choose a résumé", hint: "Tell me what you are hiring for and I will recommend one of three résumés." },
  { id: "contact", label: "Contact Riyad", hint: "Describe why you are getting in touch and I will prepare a draft for you to review." },
];

const PATHS: { label: string; mode: AgentMode; prompt?: string }[] = [
  { label: "I am hiring", mode: "recruiter" },
  { label: "Explore projects", mode: "concierge", prompt: "Which case study should I read first?" },
  { label: "Understand experience", mode: "concierge", prompt: "What is Riyad's strongest experience?" },
  { label: "Find relevant skills", mode: "concierge", prompt: "What tools and skills does Riyad have?" },
  { label: "Choose a résumé", mode: "resume" },
  { label: "Compare a job description", mode: "fit" },
  { label: "Contact Riyad", mode: "contact" },
];

const PROJECT_QUESTIONS = [
  "What problem did this project solve?",
  "What was Riyad's role?",
  "What tradeoffs were involved?",
  "What evidence is verified?",
  "What did Riyad learn?",
  "What is complete and what remains experimental?",
  "Which skills does this project demonstrate?",
  "Show me related work.",
];

const MAX_TURNS = 20;

export interface WorkspaceProps {
  initialMode?: AgentMode;
  project?: string;
  initialPrompt?: string;
  variant: "page" | "drawer";
  onNavigate?: () => void;
}

export default function AIWorkspace({ initialMode, project, initialPrompt, variant, onNavigate }: WorkspaceProps) {
  const router = useRouter();
  const { toast } = useUI();
  const projectTitle = project ? projectBySlug(project)?.title : undefined;
  const [mode, setMode] = useState<AgentMode>(initialMode ?? (project ? "project" : "concierge"));
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Extract<AiAction, { type: "contact_prefill" }> | null>(null);
  const abort = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const sentInitial = useRef(false);
  const nextId = useRef(1);

  const send = useCallback(
    async (text: string, as: AgentMode = mode, role?: string) => {
      const message = text.trim();
      if (!message || busy) return;
      if (turns.length >= MAX_TURNS) {
        toast("This conversation has reached its limit. Start a new one to continue.");
        return;
      }
      const id = nextId.current++;
      const history = turns
        .filter((t) => t.response && (t.mode === "concierge" || t.mode === "project"))
        .slice(-3)
        .flatMap((t) => [
          { role: "user" as const, text: t.question.slice(0, LIMITS.historyText) },
          { role: "assistant" as const, text: (t.response?.answer ?? "").slice(0, LIMITS.historyText) },
        ]);
      setTurns((prev) => [...prev, { id, mode: as, question: as === "fit" ? "Job description pasted for comparison" : message, stage: "Searching approved portfolio sources", response: null }]);
      setInput("");
      setBusy(true);
      track("ai_question", { category: as });
      if (as === "fit") track("job_description_compared", {});
      if (as === "recruiter" && role) track("recruiter_mode_activated", { role });

      const controller = new AbortController();
      abort.current = controller;
      const timeout = setTimeout(() => controller.abort(), 28_000);
      const update = (patch: Partial<Turn>) => setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: as, message, project: as === "project" ? project : undefined, role, history: as === "concierge" || as === "project" ? history : undefined }),
          signal: controller.signal,
        });
        if (!res.body) throw new Error("no body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let done = false;
        let final: AiResponse | null = null;
        while (!done) {
          const chunk = await reader.read();
          done = chunk.done;
          buffer += decoder.decode(chunk.value ?? new Uint8Array(), { stream: !done });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as StreamEvent;
            if (event.type === "stage") update({ stage: event.label });
            else final = event.payload;
          }
        }
        if (!final) throw new Error("no answer");
        update({ response: final, stage: null });
      } catch {
        update({
          stage: null,
          response: {
            mode: as,
            status: "unavailable",
            answer: controller.signal.aborted
              ? "That took too long, so I stopped. You can try again, or continue without AI — every page of the portfolio works on its own."
              : "Riyad AI is unavailable right now. Nothing is wrong with the portfolio itself — you can keep browsing, or try again shortly.",
            interpretation: null,
            blocks: [],
            sources: [],
            actions: [
              { type: "navigate", label: "Browse selected work", href: "/work" },
              { type: "navigate", label: "Contact Riyad", href: "/contact" },
            ],
            followups: [],
            engine: "rules",
          },
        });
      } finally {
        clearTimeout(timeout);
        setBusy(false);
        abort.current = null;
      }
    },
    [busy, mode, project, toast, turns],
  );

  // A prompt handed in from a case study, the palette or another page is sent once.
  useEffect(() => {
    if (initialPrompt && !sentInitial.current) {
      sentInitial.current = true;
      void send(initialPrompt, initialMode ?? (project ? "project" : "concierge"));
    }
    return () => abort.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const last = log.current?.lastElementChild;
    last?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [turns.length]);

  const clear = () => {
    abort.current?.abort();
    setTurns([]);
    setPreview(null);
    setInput("");
    toast("Conversation cleared. Nothing was stored.");
    field.current?.focus();
  };

  const navigate = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  const act = (a: AiAction) => {
    if (a.type === "navigate") navigate(a.href);
    else if (a.type === "resume") {
      track("resume_variant_selected", { variant: a.slug });
      navigate(`/resume/${a.slug}`);
    } else if (a.type === "mode") {
      setMode(a.mode);
      field.current?.focus();
    } else setPreview(a);
  };

  const approvePrefill = () => {
    if (!preview) return;
    try {
      sessionStorage.setItem("ra.contact.prefill", JSON.stringify(preview.fields));
    } catch {
      /* ignore */
    }
    setPreview(null);
    navigate("/contact");
  };

  const current = MODES.find((m) => m.id === mode);
  const isLong = mode === "fit" || mode === "contact";
  const limit = mode === "fit" ? LIMITS.jobDescription : LIMITS.message;
  const empty = turns.length === 0;

  return (
    <div className={`ai ai--${variant}`}>
      <div className="ai__modes" role="tablist" aria-label="Riyad AI modes">
        {project && (
          <button type="button" role="tab" aria-selected={mode === "project"} onClick={() => setMode("project")}>
            This project
          </button>
        )}
        {MODES.map((m) => (
          <button key={m.id} type="button" role="tab" aria-selected={mode === m.id} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="ai__scroll">
        {empty && (
          <div className="ai__entry">
            {mode === "project" && projectTitle ? (
              <>
                <h2 className="h3">Ask about {projectTitle}</h2>
                <p className="small muted">Answers here are limited to this project and directly connected evidence.</p>
                <ul className="ai__suggest">
                  {PROJECT_QUESTIONS.map((q) => (
                    <li key={q}>
                      <button type="button" onClick={() => send(q, "project")}>
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : mode === "recruiter" || mode === "resume" ? (
              <>
                <h2 className="h3">{mode === "recruiter" ? "What type of role are you hiring for?" : "What are you hiring for?"}</h2>
                <p className="small muted">{current?.hint}</p>
                <ul className="ai__suggest ai__suggest--roles">
                  {roles.map((r) => (
                    <li key={r.id}>
                      <button type="button" onClick={() => send(r.label, mode, r.id)}>
                        {r.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button type="button" onClick={() => (mode === "recruiter" ? setMode("fit") : field.current?.focus())}>
                      Other
                    </button>
                  </li>
                </ul>
              </>
            ) : mode === "fit" ? (
              <>
                <h2 className="h3">Compare a job description</h2>
                <p className="small muted">
                  Paste the responsibilities and requirements. I will show the strongest matches, partial matches and anything the portfolio does not evidence. There is no match percentage.
                </p>
                <p className="ai__disclosure">
                  The comparison is an informational portfolio feature, not an automated hiring decision. Pasted text is processed once to produce the comparison and is not stored.
                </p>
              </>
            ) : mode === "contact" ? (
              <>
                <h2 className="h3">Prepare a message to Riyad</h2>
                <p className="small muted">
                  Tell me in a sentence or two why you are getting in touch. I will suggest what to include and prepare a draft. I never send anything: you preview it, approve it, and submit the form yourself.
                </p>
              </>
            ) : (
              <>
                <h2 className="h3">What would you like to understand about Riyad?</h2>
                <p className="small muted">An evidence-grounded guide to Riyad’s work, experience, projects, and professional fit.</p>
                <ul className="ai__suggest">
                  {PATHS.map((p) => (
                    <li key={p.label}>
                      <button
                        type="button"
                        onClick={() => {
                          if (p.prompt) void send(p.prompt, p.mode);
                          else setMode(p.mode);
                        }}
                      >
                        {p.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div className="ai__log" ref={log} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
          {turns.map((t) => (
            <article key={t.id} className="ai__turn">
              <p className="ai__q">
                <span className="sr-only">You asked: </span>
                {t.question}
              </p>
              {t.response ? (
                <Answer response={t.response} onAct={act} onAsk={(q) => send(q, t.mode === "project" ? "project" : "concierge")} onNavigate={onNavigate} />
              ) : (
                <div className="ai__pending" role="status">
                  <span className="ai__pulse" aria-hidden="true" />
                  <span className="mono">{t.stage}</span>
                  <div className="skeleton" style={{ height: "0.9rem", width: "92%", marginTop: "1rem" }} />
                  <div className="skeleton" style={{ height: "0.9rem", width: "70%", marginTop: "0.5rem" }} />
                </div>
              )}
            </article>
          ))}
        </div>

        {preview && (
          <section className="ai__preview" aria-labelledby="preview-title">
            <p className="eyebrow">Needs your approval</p>
            <h3 id="preview-title" className="h3">
              Preview: fill the contact form
            </h3>
            <p className="small muted">
              If you approve, this draft is placed in the contact form on this site. Nothing is sent. You can edit everything there and decide whether to submit.
            </p>
            <dl className="ai__preview-fields">
              <dt>Inquiry type</dt>
              <dd>{preview.fields.inquiry}</dd>
              <dt>Message</dt>
              <dd>
                <pre>{preview.fields.message}</pre>
              </dd>
            </dl>
            <div className="cluster">
              <button type="button" className="btn btn--primary btn--sm" onClick={approvePrefill}>
                Approve and open contact form
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPreview(null)}>
                Cancel
              </button>
            </div>
          </section>
        )}
      </div>

      <form
        className="ai__composer"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <label htmlFor={`ai-input-${variant}`} className="sr-only">
          {current?.hint ?? `Ask about ${projectTitle ?? "this project"}`}
        </label>
        <textarea
          id={`ai-input-${variant}`}
          ref={field}
          className="input"
          rows={isLong ? 5 : 2}
          value={input}
          maxLength={limit}
          placeholder={
            mode === "fit" ? "Paste a job description…" : mode === "contact" ? "For example: we are hiring a Learning Technology Manager for a remote team…" : mode === "project" ? `Ask about ${projectTitle ?? "this project"}…` : mode === "resume" || mode === "recruiter" ? "Or describe the role in your own words…" : "Ask about Riyad’s work, experience or projects…"
          }
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isLong) {
              e.preventDefault();
              void send(input);
            }
          }}
        />
        <div className="ai__composer-row">
          <div className="cluster">
            <button type="button" className="btn btn--quiet btn--sm" onClick={clear} disabled={empty && !input}>
              {empty ? "Clear" : "New conversation"}
            </button>
            <Link href="/work" className="btn btn--quiet btn--sm" onClick={onNavigate}>
              Continue without AI
            </Link>
          </div>
          <button type="submit" className="btn btn--primary btn--sm" disabled={busy || !input.trim()}>
            {busy ? "Working…" : mode === "fit" ? "Compare" : mode === "contact" ? "Prepare draft" : "Ask"}
          </button>
        </div>
        <p className="meta ai__note">
          Temporary session · not stored · answers come only from approved public content ·{" "}
          <Link href="/privacy" className="link" onClick={onNavigate}>
            AI transparency
          </Link>
        </p>
      </form>
    </div>
  );
}

function Answer({ response: r, onAct, onAsk, onNavigate }: { response: AiResponse; onAct: (a: AiAction) => void; onAsk: (q: string) => void; onNavigate?: () => void }) {
  const { toast } = useUI();
  const copy = async () => {
    const text = [r.answer, ...r.blocks.map((b) => `${b.title}:\n${b.items.map((i) => `- ${i.text}`).join("\n")}`), r.sources.length ? `Sources: ${r.sources.map((s) => s.label).join("; ")}` : ""].filter(Boolean).join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      toast("Answer copied.");
    } catch {
      toast("Copy is not available in this browser.");
    }
  };
  const report = `mailto:${site.contact.email}?subject=${encodeURIComponent("Riyad AI — report an issue")}&body=${encodeURIComponent("What was wrong with the answer?\n\n(Please paste the question and answer here if you are happy to share them.)")}`;
  const flagged = r.status !== "answered";

  return (
    <div className="ai__a" data-status={r.status}>
      <p className="ai__answer">{r.answer}</p>
      {r.blocks.map((b) => (
        <section key={b.title} className="ai__block">
          <h4 className="meta">{b.title}</h4>
          <ul className="list">
            {b.items.map((i, n) => (
              <li key={n}>
                {i.href ? (
                  <Link href={i.href} className="link" onClick={onNavigate}>
                    {i.text}
                  </Link>
                ) : (
                  i.text
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {r.interpretation && (
        <p className="ai__interp">
          <span className="meta">Interpretation, not fact</span>
          {r.interpretation}
        </p>
      )}
      {r.sources.length > 0 && (
        <details className="ai__sources" open>
          <summary>
            <span className="meta">
              View sources ({r.sources.length})
            </span>
          </summary>
          <ul>
            {r.sources.map((s) => (
              <li key={s.href + s.label}>
                <Link href={s.href} className="ai__source" onClick={() => { track("source_opened", { href: s.href.split("#")[0] }); onNavigate?.(); }}>
                  <span>{s.label}</span>
                  <span className="evidence" data-e="verified">
                    {s.evidence}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
      {r.actions.length > 0 && (
        <div className="cluster ai__actions">
          {r.actions.map((a, i) => (
            <button key={i} type="button" className={`btn btn--sm ${i === 0 ? "btn--primary" : "btn--ghost"}`} onClick={() => onAct(a)}>
              {a.label}
            </button>
          ))}
        </div>
      )}
      {r.followups.length > 0 && (
        <ul className="ai__followups" aria-label="Suggested next questions">
          {r.followups.map((f) => (
            <li key={f}>
              <button type="button" onClick={() => onAsk(f)}>
                {f}
              </button>
            </li>
          ))}
        </ul>
      )}
      <footer className="ai__meta">
        <p className="meta">
          {flagged
            ? "System message from Riyad AI."
            : r.engine === "model"
              ? AI_LABEL
              : r.engine === "retrieval"
                ? "Answer assembled directly from Riyad’s approved public portfolio content."
                : "Produced by published rules from Riyad’s approved public portfolio content."}
        </p>
        <div className="cluster">
          <button type="button" className="btn btn--quiet btn--sm" onClick={copy}>
            Copy answer
          </button>
          <a className="btn btn--quiet btn--sm" href={report}>
            Report an issue
          </a>
        </div>
      </footer>
    </div>
  );
}
