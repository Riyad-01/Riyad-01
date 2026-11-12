import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectAsk, ReadingProgress, Toc, Walkthrough } from "@/components/case/CaseClient";
import { Track } from "@/components/UI";
import { osynjobsExtras, projectBySlug, projects } from "@/content/projects";
import { site } from "@/content/site";
import { EVIDENCE_LABEL, SECTION_ORDER, SECTION_TITLE } from "@/content/types";
import type { Section } from "@/content/types";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = projectBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.title} — Case study`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} — ${p.headline}`, description: p.summary, url: `/work/${p.slug}`, type: "article" },
  };
}

function SectionBlock({ id, title, s }: { id: string; title: string; s: Section }) {
  if (s.evidence === "do-not-publish") return null;
  return (
    <section id={id} className="case-section" aria-labelledby={`${id}-title`}>
      <header>
        <h2 id={`${id}-title`} className="h2">
          {title}
        </h2>
        <span className="evidence" data-e={s.evidence}>
          {EVIDENCE_LABEL[s.evidence]}
        </span>
      </header>
      <div className="prose stack">
        {s.body?.map((b) => <p key={b}>{b}</p>)}
        {s.list && (
          <ul className="list">
            {s.list.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        )}
        {s.placeholders?.map((ph) => (
          <span key={ph} className="placeholder">
            {ph}
          </span>
        ))}
        {s.note && (
          <details className="note">
            <summary>Process note: {s.note.title}</summary>
            <p>{s.note.body}</p>
          </details>
        )}
      </div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const isOsyn = slug === "osynjobs";
  const toc = [
    { id: "walkthrough", title: isOsyn ? "Product walkthrough" : "System at a glance" },
    ...SECTION_ORDER.filter((k) => p.sections[k].evidence !== "do-not-publish").map((k) => ({ id: k, title: SECTION_TITLE[k] })),
    { id: "related", title: "Related work" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: p.title,
      headline: p.headline,
      description: p.summary,
      url: `${site.url}/work/${p.slug}`,
      author: { "@type": "Person", name: site.name, url: site.url },
      creator: { "@type": "Person", name: site.name },
      keywords: [...p.classification, ...p.disciplines].join(", "),
      creativeWorkStatus: p.statusLabel,
      isPartOf: { "@type": "CollectionPage", name: "Selected work", url: `${site.url}/work` },
      isRelatedTo: p.related.map((r) => ({ "@type": "CreativeWork", name: projectBySlug(r)?.title, url: `${site.url}/work/${r}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/work` },
        { "@type": "ListItem", position: 3, name: p.title, item: `${site.url}/work/${p.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Track event="project_viewed" props={{ slug: p.slug }} />
      <ReadingProgress slug={p.slug} />

      <header className="case-head tone-ink" data-accent={p.accent}>
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="crumbs mono">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/work">Work</Link>
              </li>
              <li aria-current="page">{p.title}</li>
            </ol>
          </nav>
          <ul className="cluster" aria-label="Classification">
            {p.classification.map((c) => (
              <li key={c} className="chip">
                {c}
              </li>
            ))}
          </ul>
          <h1 className="display case-head__title">
            <span className="mask">
              <span>{p.title}</span>
            </span>
          </h1>
          <p className="case-head__headline">{p.headline}</p>
          <p className="lede">{p.summary}</p>
          <dl className="case-meta">
            <div>
              <dt className="meta">Type</dt>
              <dd>{p.kind}</dd>
            </div>
            <div>
              <dt className="meta">Status</dt>
              <dd>
                <span className="badge" data-status={p.status}>
                  {p.statusLabel}
                </span>
              </dd>
            </div>
            <div>
              <dt className="meta">Timeline</dt>
              <dd>{p.timeline.startsWith("[") ? <span className="placeholder">{p.timeline}</span> : p.timeline}</dd>
            </div>
            <div>
              <dt className="meta">Role</dt>
              <dd>{p.roles.join(" · ")}</dd>
            </div>
            <div>
              <dt className="meta">Key evidence</dt>
              <dd>{p.proof.join(" · ")}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="wrap case-layout">
        <Toc items={toc} />
        <article id="case-body" className="case-body">
          <section id="walkthrough" className="case-section" aria-label={toc[0].title}>
            {isOsyn && (
              <div className="osyn-compare">
                <div>
                  <p className="meta">Before: the fragmented workflow</p>
                  <ul className="osyn-compare__scatter">
                    {osynjobsExtras.fragmented.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <p className="osyn-compare__arrow" aria-hidden="true">
                  →
                </p>
                <div>
                  <p className="meta">After: one connected workflow</p>
                  <p className="h3">A single place where a search is organised from first sighting to final outcome.</p>
                </div>
              </div>
            )}
            <Walkthrough diagram={p.diagram} />
          </section>

          {SECTION_ORDER.map((k) => (
            <div key={k}>
              <SectionBlock id={k} title={SECTION_TITLE[k]} s={p.sections[k]} />
              {isOsyn && k === "architecture" && (
                <section className="case-section case-section--extra" aria-labelledby="feature-map">
                  <header>
                    <h2 id="feature-map" className="h3">
                      Feature map and prioritisation
                    </h2>
                    <span className="evidence" data-e="awaiting-confirmation">
                      {EVIDENCE_LABEL["awaiting-confirmation"]}
                    </span>
                  </header>
                  <dl className="feature-map">
                    {osynjobsExtras.featureMap.areas.map((a) => (
                      <div key={a.area}>
                        <dt>{a.area}</dt>
                        <dd>{a.detail}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="placeholder">{osynjobsExtras.featureMap.note}</span>
                </section>
              )}
              {isOsyn && k === "nextSteps" && (
                <section className="case-section case-section--extra" aria-labelledby="roadmap">
                  <header>
                    <h2 id="roadmap" className="h3">
                      Roadmap and what is deliberately excluded
                    </h2>
                  </header>
                  <div className="two-col">
                    <div className="stack">
                      <p className="meta">Roadmap</p>
                      {osynjobsExtras.roadmap.map((r) => (
                        <span key={r} className="placeholder">
                          {r}
                        </span>
                      ))}
                    </div>
                    <div className="stack">
                      <p className="meta">Excluded</p>
                      <ul className="list">
                        {osynjobsExtras.excluded.filter((x) => !x.startsWith("[")).map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                      {osynjobsExtras.excluded.filter((x) => x.startsWith("[")).map((x) => (
                        <span key={x} className="placeholder">
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          ))}

          <section id="related" className="case-section" aria-labelledby="related-title">
            <header>
              <h2 id="related-title" className="h2">
                Related work
              </h2>
            </header>
            <ul className="related">
              {p.related.map((r) => {
                const rp = projectBySlug(r)!;
                return (
                  <li key={r}>
                    <Link href={`/work/${r}`} className="card card--link">
                      <span className="meta">{rp.kind}</span>
                      <strong className="h3">{rp.title}</strong>
                      <span className="small muted">{rp.summary}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <ProjectAsk slug={p.slug} title={p.title} />

          <p className="meta" style={{ marginTop: "2rem" }}>
            Shareable link: {site.url.replace(/^https?:\/\//, "")}/work/{p.slug} · Last reviewed {p.lastReviewed}
          </p>
        </article>
      </div>

      <nav className="case-pager" aria-label="More case studies">
        <div className="wrap">
          <Link href={`/work/${prev.slug}`} rel="prev">
            <span className="meta">← Previous project</span>
            <span className="h3">{prev.title}</span>
          </Link>
          <Link href={`/work/${next.slug}`} rel="next">
            <span className="meta">Next project →</span>
            <span className="h3">{next.title}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
