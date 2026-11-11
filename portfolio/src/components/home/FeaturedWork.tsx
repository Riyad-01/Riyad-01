"use client";

import Link from "next/link";
import { projects } from "@/content/projects";
import { perspectives } from "@/content/site";
import type { CaseStudy, Perspective } from "@/content/types";
import { useUI } from "../UI";

const DEFAULT_ORDER = ["osynjobs", "learning-architecture-at-scale", "ai-assisted-learning-media-workflow", "studyhub-uk", "saudi-compliance-institute"];
const KEYS: Perspective[] = ["product", "learning", "creative"];

function Meta({ p, relevant }: { p: CaseStudy; relevant: boolean }) {
  return (
    <p className="work__meta">
      <span className="badge" data-status={p.status}>
        {p.statusLabel}
      </span>
      <span className="meta">{p.kind}</span>
      {relevant && <span className="work__relevant mono">Most relevant to this view</span>}
    </p>
  );
}

const Open = ({ p }: { p: CaseStudy }) => (
  <Link href={`/work/${p.slug}`} className="btn btn--ghost btn--sm work__open">
    Read the case study<span className="sr-only">: {p.title}</span> <span className="arrow" aria-hidden="true">→</span>
  </Link>
);

/** Each project keeps its own composition; the perspective only changes order and emphasis. */
function Composition({ p, relevant }: { p: CaseStudy; relevant: boolean }) {
  switch (p.slug) {
    case "osynjobs":
      return (
        <article className="work work--flagship tone-ink" data-accent={p.accent}>
          <div className="work__flag-head">
            <Meta p={p} relevant={relevant} />
            <p className="mono muted">Flagship</p>
          </div>
          <h3 className="h1">
            <Link href={`/work/${p.slug}`}>{p.title}</Link>
          </h3>
          <p className="work__headline">{p.headline}</p>
          <div className="work__flag-body">
            <div className="stack">
              <p className="lede">{p.summary}</p>
              <ul className="cluster" aria-label="Roles">
                {p.roles.map((r) => (
                  <li key={r} className="chip">
                    {r}
                  </li>
                ))}
              </ul>
              <Open p={p} />
            </div>
            <figure className="work__flow">
              <ol>
                {p.diagram.steps.map((s, i) => (
                  <li key={s.label} style={{ "--i": i } as React.CSSProperties}>
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </li>
                ))}
              </ol>
              <figcaption className="meta">{p.diagram.caption}</figcaption>
            </figure>
          </div>
        </article>
      );
    case "learning-architecture-at-scale":
      return (
        <article className="work work--editorial" data-accent={p.accent}>
          <div className="work__figure" aria-hidden="true">
            <span>1,500–</span>
            <span>2,000+</span>
          </div>
          <div className="stack">
            <Meta p={p} relevant={relevant} />
            <h3 className="h2">
              <Link href={`/work/${p.slug}`}>{p.title}</Link>
            </h3>
            <p className="lede">{p.summary}</p>
            <dl className="work__facts">
              <div>
                <dt className="meta">Courses</dt>
                <dd>1,500–2,000+</dd>
              </div>
              <div>
                <dt className="meta">UK brands</dt>
                <dd>20–25</dd>
              </div>
              <div>
                <dt className="meta">Built in</dt>
                <dd>Storyline, Rise</dd>
              </div>
            </dl>
            <Open p={p} />
          </div>
        </article>
      );
    case "ai-assisted-learning-media-workflow":
      return (
        <article className="work work--diagram" data-accent={p.accent}>
          <div className="stack">
            <Meta p={p} relevant={relevant} />
            <h3 className="h2">
              <Link href={`/work/${p.slug}`}>{p.title}</Link>
            </h3>
            <p className="lede">{p.headline}</p>
            <p className="small muted">{p.proof.join(" · ")}</p>
            <Open p={p} />
          </div>
          <figure className="work__pipeline">
            <ol>
              {p.diagram.steps.map((s) => (
                <li key={s.label} data-ai={s.label === "Generate" || undefined} tabIndex={0}>
                  <span className="mono">{s.label === "Generate" ? "AI" : "People"}</span>
                  <strong>{s.label}</strong>
                  <span className="small">{s.detail}</span>
                </li>
              ))}
            </ol>
            <figcaption className="meta">{p.diagram.caption}</figcaption>
          </figure>
        </article>
      );
    case "studyhub-uk":
      return (
        <article className="work work--interface" data-accent={p.accent}>
          <figure className="work__frame">
            <div className="work__frame-bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="work__frame-body">
              <span className="placeholder">[ADD APPROVED SCREENSHOT: StudyHub UK interface]</span>
            </div>
            <figcaption className="meta">Interface preview awaiting approved screenshots. Nothing is mocked up in its place.</figcaption>
          </figure>
          <div className="stack">
            <Meta p={p} relevant={relevant} />
            <h3 className="h2">
              <Link href={`/work/${p.slug}`}>{p.title}</Link>
            </h3>
            <p className="lede">{p.headline}</p>
            <ul className="cluster" aria-label="Disciplines">
              {p.proof.map((d) => (
                <li key={d} className="chip">
                  {d}
                </li>
              ))}
            </ul>
            <Open p={p} />
          </div>
        </article>
      );
    default:
      return (
        <article className="work work--evidence" data-accent={p.accent}>
          <p className="work__big" aria-hidden="true">
            3
          </p>
          <div className="stack">
            <Meta p={p} relevant={relevant} />
            <h3 className="h2">
              <Link href={`/work/${p.slug}`}>{p.title}</Link>
            </h3>
            <p className="lede">{p.headline}</p>
            <p className="small muted">{p.summary}</p>
            <Open p={p} />
          </div>
        </article>
      );
  }
}

export default function FeaturedWork() {
  const { perspective, setPerspective } = useUI();
  const view = perspective ? perspectives[perspective] : null;
  const order = view?.order ?? DEFAULT_ORDER;
  const sorted = order.map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean);

  return (
    <>
      <div className="switcher">
        <div>
          <p className="label" id="view-label">
            View this portfolio as
          </p>
          <div className="segmented" role="group" aria-labelledby="view-label">
            <button type="button" aria-pressed={perspective === null} onClick={() => setPerspective(null)}>
              Everything
            </button>
            {KEYS.map((k) => (
              <button key={k} type="button" aria-pressed={perspective === k} onClick={() => setPerspective(k)}>
                {perspectives[k].label}
              </button>
            ))}
          </div>
        </div>
        <div className="switcher__panel" aria-live="polite">
          {view ? (
            <>
              <p>{view.intro}</p>
              <ul className="list small">
                {view.priorities.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <Link href={`/resume/${view.resume}`} className="link small">
                Matching résumé for this view
              </Link>
            </>
          ) : (
            <p className="muted">Choose a perspective to reorder the work and surface the evidence that matters most to you. The content stays the same; only the emphasis changes.</p>
          )}
        </div>
      </div>

      <div className="works">
        {sorted.map((p, i) => (
          <Composition key={p.slug} p={p} relevant={Boolean(view) && i < 2} />
        ))}
      </div>
    </>
  );
}
