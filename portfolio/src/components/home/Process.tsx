"use client";

import { useEffect, useRef, useState } from "react";
import { workSteps } from "@/content/site";

/**
 * How Riyad works. Desktop: a scroll-linked narrative — the page scrolls
 * normally (no hijacking) while a pinned index follows the step in view.
 * Mobile: a plain vertical sequence.
 */
export default function Process() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="process">
      <div className="process__pin" aria-hidden="true">
        <p className="process__num">{workSteps[active].n}</p>
        <p className="process__name">{workSteps[active].label}</p>
        <div className="process__bar">
          {workSteps.map((s, i) => (
            <i key={s.n} data-on={i <= active || undefined} />
          ))}
        </div>
      </div>
      <ol className="process__list">
        {workSteps.map((s, i) => (
          <li
            key={s.n}
            ref={(el) => {
              items.current[i] = el;
            }}
            data-i={i}
            data-active={i === active || undefined}
          >
            <p className="mono process__step">{s.n}</p>
            <h3 className="h2">{s.label}</h3>
            <p className="lede">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
