"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useUI } from "./UI";
import type { Theme } from "./UI";

/** Display and privacy settings: theme control, motion, and consent. */
export default function Preferences({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const ui = useUI();
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const themes: { id: Theme; label: string }[] = [
    { id: "system", label: "System" },
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ];

  return (
    <dialog ref={ref} className="modal" onClose={onClose} aria-labelledby="prefs-title" onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div className="modal__panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
          <div>
            <p className="eyebrow">Settings</p>
            <h2 id="prefs-title" className="h3" style={{ marginTop: "0.5rem" }}>
              Display and privacy
            </h2>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => ref.current?.close()}>
            Close
          </button>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <p className="label" id="theme-label">
            Theme
          </p>
          <div className="segmented" role="radiogroup" aria-labelledby="theme-label" style={{ marginTop: "0.5rem" }}>
            {themes.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={ui.theme === t.id} onClick={() => ui.setTheme(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <label className="switch">
            <span>
              <span className="label">Reduce motion</span>
              <span className="small muted" style={{ display: "block" }}>
                Turns off animation and the live hero visualization. Follows your device setting by default.
              </span>
            </span>
            <input type="checkbox" checked={ui.reducedMotion} onChange={(e) => ui.setReducedMotion(e.target.checked)} />
          </label>
          <label className="switch">
            <span>
              <span className="label">Remember my view</span>
              <span className="small muted" style={{ display: "block" }}>
                Saves your chosen perspective (Product, Learning Technology or Creative UX) in this browser only. Off by default.
              </span>
            </span>
            <input type="checkbox" checked={ui.remember} onChange={(e) => ui.setRemember(e.target.checked)} />
          </label>
          <label className="switch">
            <span>
              <span className="label">Anonymous usage analytics</span>
              <span className="small muted" style={{ display: "block" }}>
                Counts events such as “case study viewed”. Never records AI conversations, job descriptions or contact messages. Off by default.
              </span>
            </span>
            <input type="checkbox" checked={ui.analytics} onChange={(e) => ui.setAnalytics(e.target.checked)} />
          </label>
        </div>
        <p className="small muted" style={{ marginTop: "1rem" }}>
          Riyad AI conversations stay in this browser tab and are cleared when you close it.{" "}
          <Link href="/privacy" className="link" onClick={() => ref.current?.close()}>
            Privacy and AI transparency
          </Link>
        </p>
      </div>
    </dialog>
  );
}
