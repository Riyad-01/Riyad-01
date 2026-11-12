import type { Metadata } from "next";
import Link from "next/link";
import ResumeChooser from "@/components/ResumeChooser";
import { resumes } from "@/content/experience";
import { projectBySlug } from "@/content/projects";

export const metadata: Metadata = {
  title: "Resume",
  description: "Three résumé paths for Riyad Ahmed: Product Manager and AI Products, Learning Technology Manager, and Creative Product and UX Designer.",
  alternates: { canonical: "/resume" },
};

export default function ResumeHub() {
  return (
    <>
      <header className="wrap page-head">
        <p className="eyebrow">Resume</p>
        <h1 className="h1" style={{ marginTop: "1rem", maxWidth: "18ch" }}>
          One career, three résumés. Take the one that fits.
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem" }}>
          The facts are identical in all three. What changes is the order and the emphasis, so you see the most relevant evidence first.
        </p>
      </header>

      <section className="wrap" style={{ paddingBottom: "var(--s-16)" }} aria-label="Find the right résumé">
        <ResumeChooser />
      </section>

      <section className="section tone-alt" aria-labelledby="all-title">
        <div className="wrap">
          <h2 id="all-title" className="h2">
            All three résumés
          </h2>
          <ul className="resume-cards">
            {resumes.map((r, i) => (
              <li key={r.slug}>
                <article className="card resume-card">
                  <p className="mono muted">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="h3">{r.name}</h3>
                  <p className="small muted">For: {r.forRoles.join(", ")}</p>
                  <p>{r.summary}</p>
                  <p className="meta">Leads with</p>
                  <ul className="list small">
                    {r.leadCaseStudies.map((s) => (
                      <li key={s}>{projectBySlug(s)?.title}</li>
                    ))}
                  </ul>
                  <Link href={`/resume/${r.slug}`} className="btn btn--ghost btn--sm">
                    View and download<span className="sr-only">: {r.name} résumé</span> <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
