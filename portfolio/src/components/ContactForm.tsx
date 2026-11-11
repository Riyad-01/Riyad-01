"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { INQUIRY_TYPES } from "@/lib/services/contact";
import { useUI } from "./UI";

type Fields = { name: string; email: string; organization: string; inquiry: string; link: string; message: string; consent: boolean; website: string };
const EMPTY: Fields = { name: "", email: "", organization: "", inquiry: "", link: "", message: "", consent: false, website: "" };
type Phase = "edit" | "preview" | "sending" | "sent" | "mailto" | "error";

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Please enter a valid email address, for example name@company.com.";
  if (!f.inquiry) e.inquiry = "Please choose an inquiry type.";
  if (f.link.trim() && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(f.link.trim())) e.link = "Please enter a full link starting with https://";
  if (f.message.trim().length < 20) e.message = "Please write at least a couple of sentences.";
  if (!f.consent) e.consent = "Please confirm you agree to be contacted about this message.";
  return e;
}

export default function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [phase, setPhase] = useState<Phase>("edit");
  const [prefilled, setPrefilled] = useState(false);
  const opened = useRef(Date.now());
  const started = useRef(false);
  const summary = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const { openAI } = useUI();

  // A draft approved in Riyad AI is placed here. It is never submitted automatically.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ra.contact.prefill");
      if (!raw) return;
      sessionStorage.removeItem("ra.contact.prefill");
      const d = JSON.parse(raw) as { inquiry?: string; message?: string };
      setF((prev) => ({
        ...prev,
        inquiry: (INQUIRY_TYPES as readonly string[]).includes(d.inquiry ?? "") ? d.inquiry! : prev.inquiry,
        message: typeof d.message === "string" ? d.message.slice(0, 4000) : prev.message,
      }));
      setPrefilled(true);
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    if (!started.current) {
      started.current = true;
      track("contact_started", {});
    }
    setF((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const toPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setPhase("preview");
    requestAnimationFrame(() => status.current?.focus());
  };

  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Portfolio inquiry: ${f.inquiry} — ${f.name}`)}&body=${encodeURIComponent(
    `${f.message}\n\n—\n${f.name}${f.organization ? `, ${f.organization}` : ""}\n${f.email}${f.link ? `\n${f.link}` : ""}`,
  )}`;

  const submit = async () => {
    setPhase("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, consent: true, elapsedMs: Date.now() - opened.current }),
        signal: AbortSignal.timeout(15_000),
      });
      const data = (await res.json()) as { ok: boolean; delivery?: "sent" | "mailto"; fields?: Record<string, string> };
      if (res.status === 400 && data.fields) {
        setErrors(data.fields);
        setPhase("edit");
        requestAnimationFrame(() => summary.current?.focus());
        return;
      }
      if (!data.ok) throw new Error("failed");
      if (data.delivery === "mailto") setPhase("mailto");
      else {
        setPhase("sent");
        track("contact_submitted", { inquiry: f.inquiry });
      }
    } catch {
      setPhase("error");
    }
    requestAnimationFrame(() => status.current?.focus());
  };

  const errorList = Object.entries(errors).filter(([, v]) => v) as [keyof Fields, string][];
  const describe = (k: keyof Fields) => (errors[k] ? `${k}-error` : undefined);

  if (phase === "sent")
    return (
      <div className="state contact-state" ref={status} tabIndex={-1} role="status">
        <p className="eyebrow">Sent</p>
        <h2 className="h3">Thank you — your message is on its way to Riyad.</h2>
        <p className="muted">He will reply to {f.email}. Nothing else happens automatically.</p>
      </div>
    );

  if (phase === "mailto")
    return (
      <div className="state contact-state" ref={status} tabIndex={-1} role="status">
        <p className="eyebrow">One more step</p>
        <h2 className="h3">Send this from your own email.</h2>
        <p className="muted">This site does not send email on your behalf. The button below opens your email app with the message ready. Nothing has been sent or stored yet.</p>
        <div className="cluster" style={{ marginTop: "1rem" }}>
          <a className="btn btn--primary" href={mailto} onClick={() => track("contact_submitted", { inquiry: f.inquiry })}>
            Open in my email app
          </a>
          <button type="button" className="btn btn--ghost" onClick={() => setPhase("edit")}>
            Back to the form
          </button>
        </div>
        <p className="small muted" style={{ marginTop: "1rem" }}>
          Or write directly to <a className="link" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>
      </div>
    );

  if (phase === "preview" || phase === "sending" || phase === "error")
    return (
      <div className="contact-preview" ref={status} tabIndex={-1} aria-labelledby="preview-h">
        <p className="eyebrow">Confirm before sending</p>
        <h2 id="preview-h" className="h3">
          Please check your message.
        </h2>
        <p className="small muted">When you confirm, this message is sent to Riyad by email. It is not shared with anyone else and is not used for analytics. You can still cancel.</p>
        <dl className="contact-preview__fields">
          <dt>Name</dt>
          <dd>{f.name}</dd>
          <dt>Email</dt>
          <dd>{f.email}</dd>
          {f.organization && (
            <>
              <dt>Organization</dt>
              <dd>{f.organization}</dd>
            </>
          )}
          <dt>Inquiry type</dt>
          <dd>{f.inquiry}</dd>
          {f.link && (
            <>
              <dt>Link</dt>
              <dd>{f.link}</dd>
            </>
          )}
          <dt>Message</dt>
          <dd>
            <pre>{f.message}</pre>
          </dd>
        </dl>
        {phase === "error" && (
          <div className="state state--error" role="alert">
            <p>
              <strong>The message could not be sent.</strong> Your text is safe — nothing was lost. Try again, or send it from your own email app instead.
            </p>
            <a className="link" href={mailto}>
              Open in my email app
            </a>
          </div>
        )}
        <div className="cluster">
          <button type="button" className="btn btn--primary" onClick={submit} disabled={phase === "sending"}>
            {phase === "sending" ? "Sending…" : phase === "error" ? "Try again" : "Confirm and send"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setPhase("edit")} disabled={phase === "sending"}>
            Cancel and edit
          </button>
        </div>
      </div>
    );

  return (
    <form className="contact-form" onSubmit={toPreview} noValidate>
      {prefilled && (
        <p className="state small" role="status">
          A draft prepared with Riyad AI has been placed below. Edit anything you like — it has not been sent.
        </p>
      )}
      {errorList.length > 0 && (
        <div className="state state--error" ref={summary} tabIndex={-1} role="alert" aria-labelledby="err-title">
          <p id="err-title">
            <strong>Please fix {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`}:</strong>
          </p>
          <ul className="list small">
            {errorList.map(([k, v]) => (
              <li key={k}>
                <a href={`#f-${k}`} className="link">
                  {v}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="two-col">
        <div className="field">
          <label htmlFor="f-name">Name</label>
          <input id="f-name" className="input" autoComplete="name" required value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describe("name")} maxLength={100} />
          {errors.name && <p id="name-error" className="error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input id="f-email" type="email" className="input" autoComplete="email" required value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describe("email")} maxLength={200} />
          {errors.email && <p id="email-error" className="error">{errors.email}</p>}
        </div>
      </div>
      <div className="two-col">
        <div className="field">
          <label htmlFor="f-organization">
            Organization <span className="hint">(optional)</span>
          </label>
          <input id="f-organization" className="input" autoComplete="organization" value={f.organization} onChange={(e) => set("organization", e.target.value)} maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="f-inquiry">Inquiry type</label>
          <select id="f-inquiry" className="input" required value={f.inquiry} onChange={(e) => set("inquiry", e.target.value)} aria-invalid={Boolean(errors.inquiry)} aria-describedby={describe("inquiry")}>
            <option value="">Choose one…</option>
            {INQUIRY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {errors.inquiry && <p id="inquiry-error" className="error">{errors.inquiry}</p>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-link">
          Job or project link <span className="hint">(optional)</span>
        </label>
        <input id="f-link" type="url" className="input" inputMode="url" placeholder="https://" value={f.link} onChange={(e) => set("link", e.target.value)} aria-invalid={Boolean(errors.link)} aria-describedby={describe("link")} maxLength={300} />
        {errors.link && <p id="link-error" className="error">{errors.link}</p>}
      </div>
      <div className="field">
        <label htmlFor="f-message">Message</label>
        <textarea id="f-message" className="input" rows={7} required value={f.message} onChange={(e) => set("message", e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={`message-hint${errors.message ? " message-error" : ""}`} maxLength={4000} />
        <p id="message-hint" className="hint">
          What are you trying to make easier? A few sentences is enough.{" "}
          <button type="button" className="link" onClick={() => openAI({ entry: "contact", mode: "contact" })}>
            Get help preparing a message
          </button>
        </p>
        {errors.message && <p id="message-error" className="error">{errors.message}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots fill it in. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className="field">
        <label className="check" htmlFor="f-consent">
          <input id="f-consent" type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={describe("consent")} />
          <span>I agree that Riyad may use these details to reply to this message.</span>
        </label>
        {errors.consent && <p id="consent-error" className="error">{errors.consent}</p>}
      </div>

      <div className="cluster">
        <button type="submit" className="btn btn--primary">
          Preview message <span className="arrow" aria-hidden="true">→</span>
        </button>
        <p className="small muted">You will see a preview and confirm before anything is sent.</p>
      </div>
    </form>
  );
}
