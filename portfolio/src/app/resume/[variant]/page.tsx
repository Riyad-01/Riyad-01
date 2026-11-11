import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/case/CaseClient";
import { experience, resumeBySlug, resumeShared, resumes } from "@/content/experience";
import { projectBySlug } from "@/content/projects";
import { metricsNote, site, tools } from "@/content/site";

type Params = { params: Promise<{ variant: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => resumes.map((r) => ({ variant: r.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = resumeBySlug((await params).variant);
  if (!r) return {};
  return { title: `${r.name} résumé`, description: r.summary, alternates: { canonical: `/resume/${r.slug}` } };
}

const P = ({ text }: { text: string }) => (text.startsWith("[") ? <span className="placeholder">{text}</span> : <>{text}</>);

export default async function ResumePage({ params }: Params) {
  const r = resumeBySlug((await params).variant);
  if (!r) notFound();
  // Lead with the experience most relevant to this variant; the facts never change.
  const order = r.slug === "learning-technology-manager" ? ["learning-systems", "leadership", "product-building", "foundations"] : r.slug === "creative-product-ux-designer" ? ["learning-systems", "product-building", "leadership", "foundations"] : ["product-building", "leadership", "learning-systems", "foundations"];
  const entries = order.map((id) => experience.find((e) => e.id === id)!);

  return (
    <div className="wrap resume-page">
      <div className="resume-bar no-print">
        <Link href="/resume" className="link small">
          ← All résumés
        </Link>
        <div className="cluster">
          <PrintButton variant={r.slug}>Download as PDF</PrintButton>
          <a className="btn btn--ghost" href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Résumé request — ${r.name}`)}`}>
            Request by email
          </a>
        </div>
        <p className="meta" style={{ flexBasis: "100%", textTransform: "none", letterSpacing: 0 }}>
          “Download as PDF” opens your browser’s print dialog — choose “Save as PDF”. The page is formatted for A4 and Letter.
        </p>
      </div>

      <article className="resume" aria-label={`${r.name} résumé`}>
        <header className="resume__head">
          <h1>{site.name}</h1>
          <p className="resume__title">{r.headline}</p>
          <p className="resume__contact">
            {site.location} · <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> · <a href={site.contact.linkedin}>{site.contact.linkedinLabel}</a> · {site.availability.label}
          </p>
        </header>

        <section aria-labelledby="r-summary">
          <h2 id="r-summary">Summary</h2>
          <p>{r.summary}</p>
        </section>

        <section aria-labelledby="r-highlights">
          <h2 id="r-highlights">Selected evidence</h2>
          <ul>
            {r.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="resume__note">{metricsNote}</p>
        </section>

        <section aria-labelledby="r-experience">
          <h2 id="r-experience">Experience</h2>
          {entries.map((e) => (
            <div key={e.id} className="resume__role">
              <h3>
                <P text={e.title} />
              </h3>
              <p className="resume__org">
                <P text={e.organization} /> · <P text={e.period} />
              </p>
              <ul>
                {e.responsibilities.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="r-projects">
          <h2 id="r-projects">Selected projects</h2>
          <ul>
            {r.leadCaseStudies.map((s) => {
              const p = projectBySlug(s)!;
              return (
                <li key={s}>
                  <strong>
                    <Link href={`/work/${s}`}>{p.title}</Link>
                  </strong>{" "}
                  ({p.kind}, {p.statusLabel.toLowerCase()}) — {p.summary}
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="r-skills">
          <h2 id="r-skills">Skills and tools</h2>
          <p>
            <strong>Core:</strong> {r.skills.join(", ")}.
          </p>
          {tools.verified.map((g) => (
            <p key={g.group}>
              <strong>{g.group}:</strong> {g.items.join(", ")}.
            </p>
          ))}
        </section>

        <section aria-labelledby="r-education">
          <h2 id="r-education">Education and languages</h2>
          <p>
            <P text={resumeShared.education} />
          </p>
          <p>
            <P text={resumeShared.certifications} />
          </p>
          <p>
            <P text={resumeShared.languages} />
          </p>
        </section>
      </article>
    </div>
  );
}
