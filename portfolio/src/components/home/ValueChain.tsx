"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { projectBySlug } from "@/content/projects";
import { valueChain } from "@/content/site";

/** Interactive value chain. Tabs pattern: works with hover, focus, tap, arrow keys and screen readers. */
export default function ValueChain() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = valueChain[active];
  const related = projectBySlug(stage.related);

  const onKey = (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    let next = active;
    if (delta) next = (active + delta + valueChain.length) % valueChain.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = valueChain.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="chain">
      <div className="chain__track" role="tablist" aria-label="Value chain stages" onKeyDown={onKey}>
        {valueChain.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`chain-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls="chain-panel"
            tabIndex={i === active ? 0 : -1}
            className="chain__stage"
            data-done={i < active || undefined}
            onClick={() => setActive(i)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
          >
            <span className="chain__n mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="chain__label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="chain__panel" role="tabpanel" id="chain-panel" aria-labelledby={`chain-tab-${stage.id}`} tabIndex={0}>
        <div key={stage.id} className="chain__content">
          <p className="mono chain__count">
            {String(active + 1).padStart(2, "0")} / {valueChain.length}
          </p>
          <h3 className="h2">{stage.label}</h3>
          <dl className="chain__facts">
            <div>
              <dt className="meta">Purpose</dt>
              <dd>{stage.purpose}</dd>
            </div>
            <div>
              <dt className="meta">Typical activity</dt>
              <dd>{stage.activity}</dd>
            </div>
            <div>
              <dt className="meta">From my work</dt>
              <dd>{stage.example}</dd>
            </div>
          </dl>
          {related && (
            <Link href={`/work/${related.slug}`} className="btn btn--ghost btn--sm">
              Related case study: {related.title} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
