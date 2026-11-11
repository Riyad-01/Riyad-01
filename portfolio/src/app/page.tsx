import Link from "next/link";
import FeaturedWork from "@/components/home/FeaturedWork";
import Hero from "@/components/home/Hero";
import Process from "@/components/home/Process";
import ValueChain from "@/components/home/ValueChain";
import { career } from "@/content/site";

const PHASES = [
  { title: "Making assets", note: "Individual pieces of work, done well.", range: [0, 3] },
  { title: "Designing systems", note: "Structures other people build with.", range: [3, 6] },
  { title: "Leading teams, building products", note: "Whole systems: people, workflow and product.", range: [6, 10] },
] as const;

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section" aria-labelledby="chain-title">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">The value chain</p>
            <h2 id="chain-title" className="h1">
              I do not stop at design.
              <br />I connect the entire system.
            </h2>
            <p className="lede">Ten stages from a person’s need to an organisation’s outcome. Select any stage to see its purpose, what I typically do there, and where it shows up in my work.</p>
          </div>
          <ValueChain />
        </div>
      </section>

      <section className="section tone-alt" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title" className="h1">
              Five projects. One way of working.
            </h2>
          </div>
          <FeaturedWork />
          <p style={{ marginTop: "3rem" }}>
            <Link href="/work" className="btn btn--ghost">
              All work and filters <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="section" id="process" aria-labelledby="process-title">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">How Riyad works</p>
            <h2 id="process-title" className="h1">
              Seven steps, repeated until it works.
            </h2>
          </div>
          <Process />
        </div>
      </section>

      <section className="section tone-alt" aria-labelledby="career-title">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Career evolution</p>
            <h2 id="career-title" className="h1">
              From making one asset to building the whole system.
            </h2>
            <p className="lede">Each stage added a wider scope without discarding the one before it. That is why I can work at any point in the chain.</p>
          </div>
          <div className="career">
            {PHASES.map((ph, pi) => (
              <div key={ph.title} className="career__phase" data-reveal style={{ "--i": pi } as React.CSSProperties}>
                <p className="mono career__phase-n">Phase {pi + 1}</p>
                <h3 className="h3">{ph.title}</h3>
                <p className="small muted">{ph.note}</p>
                <ol start={ph.range[0] + 1}>
                  {career.slice(ph.range[0], ph.range[1]).map((c, i) => (
                    <li key={c.label}>
                      <span className="mono">{String(ph.range[0] + i + 1).padStart(2, "0")}</span>
                      <span>
                        <strong>{c.label}</strong>
                        <span className="small muted">{c.gain}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "3rem" }}>
            <Link href="/experience" className="btn btn--ghost">
              View the full career story <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
