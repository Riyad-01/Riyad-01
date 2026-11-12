"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { Diagram } from "@/content/types";
import { useUI } from "../UI";

/** Reading progress bar + "case study completed" analytics event. */
export function ReadingProgress({ slug }: { slug: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let done = false;
    let raf = 0;
    const update = () => {
      raf = 0;
      const article = document.getElementById("case-body");
      if (!article || !bar.current) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      bar.current.style.transform = `scaleX(${p})`;
      bar.current.parentElement?.setAttribute("aria-valuenow", String(Math.round(p * 100)));
      if (p > 0.95 && !done) {
        done = true;
        track("case_study_completed", { slug });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [slug]);
  return (
    <div className="progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <div ref={bar} className="progress__bar" />
    </div>
  );
}

/** Sticky table of contents with scroll-spy. Collapses into a disclosure on small screens. */
export function Toc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  const list = (
    <ol>
      {items.map((i, n) => (
        <li key={i.id}>
          <a href={`#${i.id}`} aria-current={active === i.id ? "location" : undefined}>
            <span className="mono">{String(n + 1).padStart(2, "0")}</span>
            {i.title}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <nav className="toc" aria-label="Case study contents">
      <p className="meta toc__title">Contents</p>
      <div className="toc__desktop">{list}</div>
      <details className="toc__mobile">
        <summary>
          <span className="meta">Contents</span>
          <span>{items.find((i) => i.id === active)?.title ?? "Jump to a section"}</span>
        </summary>
        {list}
      </details>
    </nav>
  );
}

/** Interactive walkthrough of a diagram, with an accessible enlarge view. */
export function Walkthrough({ diagram }: { diagram: Diagram }) {
  const [step, setStep] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const s = diagram.steps[step];
  const steps = (large = false) => (
    <ol className={`walk__steps${large ? " walk__steps--large" : ""}`}>
      {diagram.steps.map((d, i) => (
        <li key={d.label}>
          <button type="button" aria-pressed={i === step} onClick={() => setStep(i)} data-done={i < step || undefined}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <strong>{d.label}</strong>
            {large && <span className="small">{d.detail}</span>}
          </button>
        </li>
      ))}
    </ol>
  );
  return (
    <figure className="walk">
      {diagram.conceptual && (
        <p className="walk__flag mono">
          <span>Concept visualization</span>
          <span>Not current production interface</span>
        </p>
      )}
      <h3 className="h3">{diagram.title}</h3>
      {steps()}
      <div className="walk__detail" aria-live="polite">
        <p className="mono">
          Step {step + 1} of {diagram.steps.length}
        </p>
        <p className="lede" key={s.label}>
          <strong>{s.label}.</strong> {s.detail}
        </p>
      </div>
      <div className="cluster">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep((step - 1 + diagram.steps.length) % diagram.steps.length)}>
          Previous step
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStep((step + 1) % diagram.steps.length)}>
          Next step
        </button>
        <button type="button" className="btn btn--quiet btn--sm" onClick={() => dialog.current?.showModal()}>
          Enlarge diagram
        </button>
      </div>
      <figcaption className="meta">{diagram.caption}</figcaption>

      <dialog ref={dialog} className="modal lightbox" aria-label={`${diagram.title} — enlarged`} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="modal__panel">
          <div className="lightbox__head">
            <h3 className="h3">{diagram.title}</h3>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
          {steps(true)}
          <p className="meta">{diagram.caption}</p>
        </div>
      </dialog>
    </figure>
  );
}

/** Contextual "Ask AI about this project" panel. */
export function ProjectAsk({ slug, title }: { slug: string; title: string }) {
  const { openAI } = useUI();
  const questions = ["What problem did this project solve?", "What was Riyad's role?", "What evidence is verified?", "What is complete and what remains experimental?"];
  return (
    <aside className="ask-panel tone-ink" aria-labelledby="ask-title">
      <p className="eyebrow">Riyad AI</p>
      <h2 id="ask-title" className="h3">
        Ask AI about this project
      </h2>
      <p className="small muted">Answers are limited to {title} and connected evidence, with sources.</p>
      <ul>
        {questions.map((q) => (
          <li key={q}>
            <button type="button" onClick={() => openAI({ entry: "case-study", mode: "project", project: slug, prompt: q })}>
              {q} <span aria-hidden="true">→</span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--primary btn--sm" onClick={() => openAI({ entry: "case-study", mode: "project", project: slug })}>
        Ask your own question
      </button>
    </aside>
  );
}

export function PrintButton({ children, variant }: { children: ReactNode; variant: string }) {
  return (
    <button
      type="button"
      className="btn btn--primary"
      onClick={() => {
        track("resume_downloaded", { variant });
        window.print();
      }}
    >
      {children}
    </button>
  );
}
