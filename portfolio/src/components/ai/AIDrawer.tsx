"use client";

import { useEffect, useRef } from "react";
import AIWorkspace from "./AIWorkspace";
import type { AIEntry } from "../UI";

/** Riyad AI as a side workspace, opened from the nav, command palette or a case study. */
export default function AIDrawer({ open, onClose, entry }: { open: boolean; onClose: () => void; entry: AIEntry }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="drawer" onClose={onClose} aria-labelledby="ai-drawer-title" onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div className="drawer__panel">
        <header className="ai-head">
          <div>
            <p id="ai-drawer-title" className="ai-head__title">
              Riyad AI
            </p>
            <p className="meta">Evidence-grounded portfolio guide</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => ref.current?.close()}>
            Close
          </button>
        </header>
        <AIWorkspace variant="drawer" initialMode={entry.mode} project={entry.project} initialPrompt={entry.prompt} onNavigate={() => ref.current?.close()} />
      </div>
    </dialog>
  );
}
