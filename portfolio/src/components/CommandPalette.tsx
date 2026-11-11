"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { buildSearchIndex, search } from "@/lib/search";
import { useUI } from "./UI";

interface Command {
  id: string;
  group: string;
  title: string;
  detail?: string;
  run: () => void;
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const ui = useUI();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const index = useMemo(buildSearchIndex, []);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    input.current?.focus();
  }, []);

  const go = (href: string) => () => router.push(href);
  const actions: Command[] = useMemo(
    () => [
      { id: "work", group: "Actions", title: "View selected work", run: go("/work") },
      { id: "osynjobs", group: "Actions", title: "Open OsynJobs", detail: "Flagship case study", run: go("/work/osynjobs") },
      { id: "ai", group: "Actions", title: "Ask Riyad AI", run: () => ui.openAI({ entry: "palette" }) },
      { id: "recruiter", group: "Actions", title: "Enter Recruiter Mode", run: () => ui.openAI({ entry: "palette", mode: "recruiter" }) },
      { id: "fit", group: "Actions", title: "Compare a job description", run: () => ui.openAI({ entry: "palette", mode: "fit" }) },
      { id: "resume", group: "Actions", title: "Choose a résumé", run: () => ui.openAI({ entry: "palette", mode: "resume" }) },
      { id: "lab", group: "Actions", title: "Explore Product Lab", run: go("/lab") },
      { id: "experience", group: "Actions", title: "View Experience", run: go("/experience") },
      { id: "contact", group: "Actions", title: "Contact Riyad", run: go("/contact") },
      {
        id: "theme",
        group: "Actions",
        title: "Switch theme",
        detail: `Currently ${ui.theme}`,
        run: () => ui.setTheme(ui.theme === "dark" ? "light" : "dark"),
      },
      { id: "search", group: "Actions", title: "Search projects", detail: "Type to search", run: () => input.current?.focus() },
      {
        id: "motion",
        group: "Actions",
        title: ui.reducedMotion ? "Enable motion" : "Disable motion",
        run: () => ui.setReducedMotion(!ui.reducedMotion),
      },
      { id: "prefs", group: "Actions", title: "Display and privacy settings", run: ui.openPreferences },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ui.theme, ui.reducedMotion],
  );

  const results: Command[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    const matchedActions = actions.filter((a) => a.title.toLowerCase().includes(q));
    const found = search(index, q).map<Command>((item) => ({
      id: item.id,
      group: item.group,
      title: item.title,
      detail: item.detail,
      run: item.ask ? () => ui.openAI({ entry: "palette", prompt: item.ask }) : go(item.href!),
    }));
    return [...matchedActions, ...found, { id: "ask-free", group: "Ask Riyad AI", title: `Ask: “${query.trim()}”`, run: () => ui.openAI({ entry: "palette", prompt: query.trim() }) }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, actions, index]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (c: Command) => {
    track("command_palette_used", { action: c.id.startsWith("faq") || c.id === "ask-free" ? "ask" : c.id });
    const keepOpen = c.id === "search";
    c.run();
    if (!keepOpen) ref.current?.close();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    }
  };

  let lastGroup = "";
  return (
    <dialog ref={ref} className="modal palette" onClose={onClose} aria-label="Search and commands" onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div className="modal__panel palette__panel">
        <div className="palette__input">
          <label htmlFor="palette-input" className="sr-only">
            Search the portfolio or run a command
          </label>
          <input
            id="palette-input"
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value.slice(0, 120))}
            onKeyDown={onKey}
            placeholder="Search work, pages and questions…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="kbd" onClick={() => ref.current?.close()} aria-label="Close">
            Esc
          </button>
        </div>
        <ul id="palette-list" ref={list} role="listbox" aria-label="Results" className="palette__list">
          {results.map((c, i) => {
            const heading = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {heading && (
                  <p className="meta palette__group" role="presentation">
                    {heading}
                  </p>
                )}
                <div id={`cmd-${c.id}`} role="option" aria-selected={i === active} className="palette__item" onMouseMove={() => setActive(i)} onClick={() => run(c)}>
                  <span>{c.title}</span>
                  {c.detail && <span className="palette__detail">{c.detail}</span>}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="meta palette__foot" aria-hidden="true">
          ↑↓ to move · Enter to select · Esc to close
        </p>
      </div>
    </dialog>
  );
}
