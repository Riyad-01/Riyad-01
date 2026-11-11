import type { Metadata } from "next";
import Link from "next/link";
import { experience, experienceNote } from "@/content/experience";
import { projectBySlug } from "@/content/projects";
import { career, metrics, metricsNote } from "@/content/site";
import { EVIDENCE_LABEL } from "@/content/types";

export const metadata: Metadata = {
  title: "Experience",
  description: "Riyad Ahmed's career story: from web publishing and course development to learning architecture, cross-functional leadership, AI workflows and product building.",
  alternates: { canonical: "/experience" },
};

const P = ({ text }: { text: string }) => (text.startsWith("[") ? <span className="placeholder">{text}</span> : <>{text}</>);

export default function ExperiencePage() {
  return (
    <>
      <header className="wrap page-head">
        <p className="eyebrow">Experience</p>
        <h1 className="h1" style={{ marginTop: "1rem", maxWidth: "20ch" }}>
          A career that kept widening its scope.
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem" }}>
          {experienceNote}
        </p>
      </header>

      <section className="tone-ink section--tight section" aria-labelledby="scope-title">
        <div className="wrap">
          <h2 id="scope-title" className="eyebrow">
            Scope handled
          </h2>
          <dl className="exp-metrics">
            {metrics.map((m) => (
              <div key={m.id}>
                <dd className="metric__value">{m.value}</dd>
                <dt className="metric__label">{m.label}</dt>
                <Link href={m.source.href} className="link small">
                  Source: {m.source.label}
                </Link>
              </div>
            ))}
          </dl>
          <p className="meta" style={{ marginTop: "1.5rem", textTransform: "none", letterSpacing: 0 }}>
            {metricsNote}
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="timeline-title">
        <div className="wrap">
          <h2 id="timeline-title" className="h2">
            Timeline, most recent first
          </h2>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.id} id={e.id} className="timeline__item" data-reveal>
                <div className="timeline__when">
                  <p className="mono timeline__chapter">{e.chapter}</p>
                  <p className="small">
                    <P text={e.period} />
                  </p>
                  <p className="meta">{e.kind}</p>
                </div>
                <div className="timeline__what stack">
                  <h3 className="h3">
                    <P text={e.title} />
                  </h3>
                  <p className="small muted">
                    <P text={e.organization} />
                  </p>
                  <p className="lede">{e.summary}</p>
                  <ul className="list">
                    {e.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <p className="cluster">
                    <span className="evidence" data-e={e.status}>
                      {EVIDENCE_LABEL[e.status]}
                    </span>
                    {e.related.map((r) => (
                      <Link key={r} href={`/work/${r}`} className="link small">
                        {projectBySlug(r)?.title}
                      </Link>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tone-alt" aria-labelledby="evolution-title">
        <div className="wrap">
          <p className="eyebrow">Evolution</p>
          <h2 id="evolution-title" className="h2" style={{ marginTop: "1rem", maxWidth: "24ch" }}>
            From individual assets to complete systems.
          </h2>
          <ol className="evolution">
            {career.map((c, i) => (
              <li key={c.label}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <strong>{c.label}</strong>
                <span className="small muted">{c.gain}</span>
              </li>
            ))}
          </ol>
          <div className="cluster" style={{ marginTop: "2.5rem" }}>
            <Link href="/resume" className="btn btn--primary">
              Choose a résumé <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/work" className="btn btn--ghost">
              See the work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
