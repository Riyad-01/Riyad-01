import type { Metadata } from "next";
import Link from "next/link";
import { AskAI } from "@/components/UI";
import { principles, site, tools, workSteps } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Riyad Ahmed connects human needs, learning, product strategy, design, AI and team enablement into working systems.",
  alternates: { canonical: "/about" },
};

const CHAIN = ["Human Needs", "Learning", "Product Strategy", "UX and Design", "Content", "AI and Automation", "Team Enablement", "Business Outcomes"];
const DOES = [
  "Identifies problems",
  "Conducts research",
  "Creates architecture",
  "Designs workflows",
  "Develops reusable systems",
  "Builds prototypes",
  "Coordinates teams",
  "Tests ideas through real use",
  "Improves operations",
  "Communicates complex ideas clearly",
];

export default function AboutPage() {
  return (
    <>
      <header className="wrap page-head">
        <p className="eyebrow">About</p>
        <h1 className="h1" style={{ marginTop: "1rem", maxWidth: "20ch" }}>
          I am not limited to one discipline. That is the point.
        </h1>
        <div className="about-intro">
          <div className="prose stack">
            <p className="lede">
              I am {site.name}, an {site.role} based in {site.location}. {site.promise}
            </p>
            <p>
              My career began with individual assets: publishing pages, refining voiceovers, building courses. Each step outward taught me that the asset is rarely the problem. The system around it is. So I learned to design the system: the learning architecture, the templates, the workflow, the team’s way of working, and eventually the product itself.
            </p>
            <p>
              Today I work across the whole chain. I can sit with a person who has a problem, frame it, design the structure that solves it, build a working version, and train the team that will run it. I use AI throughout, as a builder and as a designer of workflows, on one condition: it has to improve the workflow, not decorate it.
            </p>
            <p>
              <strong>Mission.</strong> {site.mission}
            </p>
          </div>
          <aside className="about-photo">
            <span className="placeholder">[ADD APPROVED PORTRAIT]</span>
            <p className="meta">A real photograph, not stock imagery.</p>
          </aside>
        </div>
      </header>

      <section className="section tone-ink" aria-labelledby="connect-title">
        <div className="wrap">
          <p className="eyebrow">What I connect</p>
          <h2 id="connect-title" className="sr-only">
            What Riyad connects
          </h2>
          <ol className="about-chain">
            {CHAIN.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="principles-title">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Principles</p>
            <h2 id="principles-title" className="h2" style={{ marginTop: "1rem" }}>
              Five things I hold to.
            </h2>
            <ol className="about-principles">
              {principles.map((p, i) => (
                <li key={p}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {p}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="eyebrow">In practice</p>
            <h2 className="h2" style={{ marginTop: "1rem" }}>
              What I actually do.
            </h2>
            <ul className="list" style={{ marginTop: "1.5rem" }}>
              {DOES.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="small muted" style={{ marginTop: "1.5rem" }}>
              How it runs: {workSteps.map((s) => s.label).join(" → ")}.{" "}
              <Link href="/#process" className="link">
                See the process
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section tone-alt" id="tools" aria-labelledby="tools-title">
        <div className="wrap">
          <p className="eyebrow">Tools</p>
          <h2 id="tools-title" className="h2" style={{ marginTop: "1rem" }}>
            Tools I work with.
          </h2>
          <p className="lede" style={{ marginTop: "1rem" }}>
            A plain list. No skill bars, no percentages — the case studies show how these were used.
          </p>
          <dl className="tools">
            {tools.verified.map((g) => (
              <div key={g.group}>
                <dt className="meta">{g.group}</dt>
                <dd>
                  <ul className="cluster">
                    {g.items.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
          <span className="placeholder" style={{ marginTop: "1.5rem", maxWidth: "40rem" }}>
            {tools.placeholder}
          </span>
          <div className="cluster" style={{ marginTop: "2.5rem" }}>
            <Link href="/experience" className="btn btn--primary">
              View experience <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <AskAI entry="page" prompt="How does Riyad work?">
              Ask Riyad AI about how I work
            </AskAI>
          </div>
        </div>
      </section>
    </>
  );
}
