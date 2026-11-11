import type { Metadata } from "next";
import Link from "next/link";
import { lab } from "@/content/lab";
import { EVIDENCE_LABEL, STATUS_LABEL } from "@/content/types";
import type { StatusKey } from "@/content/types";

export const metadata: Metadata = {
  title: "Product Lab",
  description: "Products, prototypes and experiments by Riyad Ahmed — each labelled with its real status, from active testing to exploration.",
  alternates: { canonical: "/lab" },
};

const P = ({ text }: { text: string }) => (text.startsWith("[") ? <span className="placeholder">{text}</span> : <>{text}</>);
const ORDER: StatusKey[] = ["active", "testing", "prototype", "concept", "exploring", "paused", "completed"];

export default function LabPage() {
  return (
    <>
      <header className="tone-ink">
        <div className="wrap page-head">
          <p className="eyebrow">Product Lab</p>
          <h1 className="h1" style={{ marginTop: "1rem", maxWidth: "20ch" }}>
            Ideas become valuable when they survive contact with reality.
          </h1>
          <p className="lede" style={{ marginTop: "1.25rem" }}>
            This is where I build to find out. Nothing here is presented as commercially launched. Every item carries its real status, what was built, and what is still unknown.
          </p>
          <ul className="cluster" style={{ marginTop: "2rem" }} aria-label="Status system">
            {ORDER.map((s) => (
              <li key={s} className="badge" data-status={s}>
                {STATUS_LABEL[s]}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="wrap lab" aria-label="Lab initiatives">
        {lab.map((l, i) => (
          <article key={l.slug} id={l.slug} className="lab__item" data-reveal>
            <header className="lab__head">
              <p className="mono muted">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="h1">{l.name}</h2>
              <p className="cluster">
                <span className="badge" data-status={l.status}>
                  {STATUS_LABEL[l.status]}
                </span>
                <span className="meta">{l.statusLabel}</span>
              </p>
              <p className="lede">
                <P text={l.oneLine.replace(/\s*\[VERIFY[^\]]*\]/, "")} />
              </p>
              {l.oneLine.includes("[VERIFY") && <span className="placeholder">{l.oneLine.match(/\[VERIFY[^\]]*\]/)?.[0]}</span>}
              <span className="evidence" data-e={l.evidence}>
                {EVIDENCE_LABEL[l.evidence]}
              </span>
            </header>
            <dl className="lab__facts">
              <div>
                <dt className="meta">Problem explored</dt>
                <dd>
                  <P text={l.problem} />
                </dd>
              </div>
              <div>
                <dt className="meta">Hypothesis</dt>
                <dd>
                  <P text={l.hypothesis} />
                </dd>
              </div>
              <div>
                <dt className="meta">What was built</dt>
                <dd>
                  <P text={l.built} />
                </dd>
              </div>
              <div>
                <dt className="meta">What was learned</dt>
                <dd>
                  <P text={l.learned} />
                </dd>
              </div>
              <div>
                <dt className="meta">Why it continued or paused</dt>
                <dd>
                  <P text={l.decision} />
                </dd>
              </div>
              <div>
                <dt className="meta">Related capability</dt>
                <dd>{l.capability}</dd>
              </div>
            </dl>
            {(l.caseStudy || l.link) && (
              <p className="cluster">
                {l.caseStudy && (
                  <Link href={`/work/${l.caseStudy}`} className="btn btn--ghost btn--sm">
                    {l.slug === l.caseStudy ? "Read the case study" : "Related case study"} <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                )}
                {l.link && (
                  <a href={l.link.href} className="link small" rel="noopener noreferrer" target="_blank">
                    {l.link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </p>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
