"use client";

import Link from "next/link";
import { useState } from "react";
import { resumes } from "@/content/experience";
import { resumeRules, roles } from "@/content/fit";
import { track } from "@/lib/analytics";
import { useUI } from "./UI";

/** Résumé selection with the logic on display. Works without the AI service. */
export default function ResumeChooser() {
  const [role, setRole] = useState<string | null>(null);
  const { openAI } = useUI();
  const chosen = roles.find((r) => r.id === role);
  const resume = chosen ? resumes.find((r) => r.slug === chosen.resume) : null;

  return (
    <div className="chooser">
      <div>
        <p className="label" id="chooser-label">
          What are you hiring for?
        </p>
        <div className="chooser__roles" role="group" aria-labelledby="chooser-label">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              className="chip-btn"
              aria-pressed={role === r.id}
              onClick={() => {
                setRole(r.id);
                track("resume_variant_selected", { variant: r.resume });
              }}
            >
              {r.label}
            </button>
          ))}
          <button type="button" className="chip-btn" onClick={() => openAI({ entry: "resume", mode: "resume" })}>
            Other — describe the role
          </button>
        </div>
      </div>
      <div className="chooser__result" aria-live="polite">
        {resume && chosen ? (
          <>
            <p className="eyebrow">Recommended</p>
            <h3 className="h3">{resume.name} résumé</h3>
            <p className="small muted">For: {chosen.label}</p>
            <ul className="list small">
              {resume.reasons.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Link href={`/resume/${resume.slug}`} className="btn btn--primary btn--sm">
              Open this résumé <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </>
        ) : (
          <p className="muted">Choose a role and the matching résumé appears here, with the reasons.</p>
        )}
        <details className="note">
          <summary>How the recommendation works</summary>
          <p>Each role maps to one résumé. For a free-text description, the rule with the most matching terms wins. There is no hidden scoring.</p>
          <ul className="list small">
            {resumeRules.map((r) => (
              <li key={r.resume}>
                <strong>{resumes.find((x) => x.slug === r.resume)?.name}:</strong> {r.when}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
