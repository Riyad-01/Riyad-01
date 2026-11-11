"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { projects } from "@/content/projects";
import { track } from "@/lib/analytics";

const FILTERS = [
  { id: "all", label: "All work" },
  { id: "product", label: "Product" },
  { id: "learning", label: "Learning technology" },
  { id: "creative", label: "Creative UX" },
  { id: "ai", label: "AI" },
  { id: "leadership", label: "Leadership" },
  { id: "professional", label: "Professional work" },
  { id: "personal", label: "Personal product" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

const matches = (p: (typeof projects)[number], f: FilterId) => {
  if (f === "all") return true;
  if (f === "professional") return p.kind === "Professional work";
  if (f === "personal") return p.kind === "Personal product";
  if (f === "ai") return p.disciplines.includes("AI");
  if (f === "leadership") return p.disciplines.includes("Leadership");
  return p.perspectives.includes(f);
};

/** Project index with bookmarkable filters (?filter=…). */
export default function WorkIndex() {
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    const f = new URLSearchParams(location.search).get("filter") ?? new URLSearchParams(location.search).get("view");
    if (FILTERS.some((x) => x.id === f)) setFilter(f as FilterId);
  }, []);

  const choose = (f: FilterId) => {
    setFilter(f);
    const url = new URL(location.href);
    url.searchParams.delete("view");
    if (f === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", f);
    history.replaceState(null, "", url);
    track("project_filter_used", { filter: f });
  };

  const shown = projects.filter((p) => matches(p, filter));

  return (
    <>
      <div className="filterbar">
        <p className="label" id="filter-label">
          Filter
        </p>
        <div className="segmented" role="group" aria-labelledby="filter-label">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => choose(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <p className="meta" role="status" aria-live="polite">
          Showing {shown.length} of {projects.length} case studies
        </p>
      </div>

      {shown.length === 0 ? (
        <div className="state">
          <p className="h3">No case studies match this filter.</p>
          <p className="muted">Try another filter, or view all work.</p>
          <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: "1rem" }} onClick={() => choose("all")}>
            Show all work
          </button>
        </div>
      ) : (
        <ol className="index">
          {shown.map((p, i) => (
            <li key={p.slug} data-accent={p.accent}>
              <Link href={`/work/${p.slug}`} className="index__row">
                <span className="mono index__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="index__main">
                  <span className="h2">{p.title}</span>
                  <span className="lede">{p.summary}</span>
                </span>
                <span className="index__side">
                  <span className="badge" data-status={p.status}>
                    {p.statusLabel}
                  </span>
                  <span className="meta">{p.kind}</span>
                  <span className="small muted">{p.proof.join(" · ")}</span>
                </span>
                <span className="index__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
