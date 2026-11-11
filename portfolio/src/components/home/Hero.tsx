import Link from "next/link";
import { projects } from "@/content/projects";
import { metrics, metricsNote, site } from "@/content/site";
import { AskAI } from "../UI";
import HeroSystems from "./HeroSystems";

export default function Hero() {
  return (
    <section className="hero tone-ink" aria-labelledby="hero-title">
      <div className="wrap hero__inner">
        <div className="hero__top">
          <p className="hero__roles mono">
            {site.roles.map((r, i) => (
              <span key={r}>
                {i > 0 && <span aria-hidden="true"> / </span>}
                {i === 0 ? <strong>{r}</strong> : r}
              </span>
            ))}
          </p>
          <p className="mono muted hero__place">{site.location}</p>
        </div>

        <h1 id="hero-title" className="display hero__statement">
          <span className="mask">
            <span style={{ "--i": 0 } as React.CSSProperties}>From human needs</span>
          </span>
          <span className="mask">
            <span style={{ "--i": 1 } as React.CSSProperties}>
              to <em>working systems.</em>
            </span>
          </span>
        </h1>

        <div className="hero__body">
          <div className="hero__copy">
            <p className="lede">{site.promise}</p>
            <div className="cluster hero__cta">
              <Link href="/work" className="btn btn--primary">
                Explore Selected Work <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <AskAI entry="hero">Ask Riyad AI</AskAI>
            </div>
            <p className="small hero__links">
              <Link href="/experience" className="link">
                View Career Story
              </Link>
              <Link href="/resume" className="link">
                Download Resume
              </Link>
              {site.availability.open && (
                <span className="hero__avail">
                  <span className="status-pill__dot" aria-hidden="true" />
                  {site.availability.label}
                </span>
              )}
            </p>
          </div>
          <HeroSystems />
        </div>

        <div className="hero__evidence" aria-labelledby="evidence-title">
          <h2 id="evidence-title" className="sr-only">
            Evidence of scale
          </h2>
          <dl className="hero__metrics">
            {metrics.map((m, i) => (
              <div key={m.id} className="metric" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <dt className="metric__label">{m.label}</dt>
                <dd className="metric__value">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="hero__foot">
            <p className="meta">{metricsNote}</p>
            <p className="meta hero__work">
              <span>Selected work</span>
              {projects.map((p) => (
                <Link key={p.slug} href={`/work/${p.slug}`}>
                  {p.title}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
