import type { Metadata } from "next";
import Link from "next/link";
import { PreferencesButton } from "@/components/UI";
import { site } from "@/content/site";
import { aiStatus } from "@/lib/ai/engine";
import { publicRecords } from "@/lib/ai/knowledge";
import { LIMITS } from "@/lib/ai/types";
import { contactDeliveryConfigured } from "@/lib/services/contact";

export const metadata: Metadata = {
  title: "Privacy and AI transparency",
  description: "How Riyad AI works, what it can and cannot do, which sources it uses, and how this site handles your data.",
  alternates: { canonical: "/privacy" },
};

// Reads live configuration so the page always describes the system as it is actually running.
export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  const ai = aiStatus();
  const records = publicRecords().length;
  const delivery = contactDeliveryConfigured();

  return (
    <div className="wrap doc">
      <header className="page-head">
        <p className="eyebrow">Trust</p>
        <h1 className="h1" style={{ marginTop: "1rem" }}>
          Privacy and AI transparency
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem" }}>
          This page explains, in plain language, what Riyad AI is, what it does with what you type, and how the rest of this site treats your data. Last reviewed {site.lastReviewed}.
        </p>
      </header>

      <div className="doc__body">
        <section aria-labelledby="t-what">
          <h2 id="t-what" className="h2">
            What Riyad AI is
          </h2>
          <p>
            Riyad AI is a guide to this portfolio. It answers questions about Riyad Ahmed’s work, experience and projects using only content that has been published and approved on this site. It is a software feature, not Riyad, and it does not speak for him.
          </p>
          <p className="state">
            <strong>Current configuration.</strong>{" "}
            {!ai.enabled
              ? "Riyad AI is currently switched off. The portfolio works fully without it."
              : ai.engine === "model"
                ? `Answers are written by a language model (${ai.vendor}, model “${ai.model}”) from approved portfolio records, then checked in code before you see them.`
                : "Riyad AI is running in grounded retrieval mode: answers are assembled directly from approved portfolio records by rules, and no language model or third-party AI provider is called."}{" "}
            It can currently draw on {records} approved records.
          </p>
        </section>

        <section aria-labelledby="t-can">
          <h2 id="t-can" className="h2">
            What it can do
          </h2>
          <ul className="list">
            <li>Answer questions about Riyad’s published work, experience, projects and tools, with links to the source.</li>
            <li>Show which evidence is relevant to a role you are hiring for, including genuine gaps.</li>
            <li>Compare a pasted job description against published evidence.</li>
            <li>Recommend one of three résumés and show the rule it used.</li>
            <li>Help you prepare a contact message, which you review and send yourself.</li>
          </ul>
        </section>

        <section aria-labelledby="t-cannot">
          <h2 id="t-cannot" className="h2">
            What it cannot do
          </h2>
          <ul className="list">
            <li>It cannot send email, submit forms, schedule meetings or take any action outside this page.</li>
            <li>It cannot access Riyad’s private accounts, email, calendar, files or analytics.</li>
            <li>It cannot make commitments, accept offers or discuss compensation on Riyad’s behalf.</li>
            <li>It does not assess anyone using personal or protected characteristics.</li>
            <li>It does not make hiring decisions. The job-description comparison is informational only and gives no score.</li>
            <li>It will not reveal its configuration or anything that has not been published.</li>
          </ul>
        </section>

        <section aria-labelledby="t-sources">
          <h2 id="t-sources" className="h2">
            Which sources it uses
          </h2>
          <p>
            Only this site’s published content: case studies, the experience timeline, résumé content, Product Lab entries, approved FAQs and working principles. Each record carries an evidence status. Records marked “awaiting confirmation” or “do not publish” are never available to the AI.
          </p>
          <p>It does not use private email, internal company documents, client files, personal information, analytics, or previous visitors’ conversations.</p>
        </section>

        <section aria-labelledby="t-stored">
          <h2 id="t-stored" className="h2">
            Whether conversations are stored
          </h2>
          <ul className="list">
            <li>
              <strong>Not stored.</strong> Your conversation lives in your browser tab only. It is cleared when you press “Clear” or “New conversation”, or close the tab. There is no conversation history on the server and no memory between visitors or visits.
            </li>
            <li>
              <strong>Job descriptions</strong> you paste are processed once to produce the comparison and are not stored or logged.
            </li>
            <li>
              <strong>Security logs</strong> record that a request happened, its mode and its length, and a short anonymous identifier that changes daily, so abuse can be limited. They do not contain what you typed. Retention target: 30 days.
            </li>
            <li>
              <strong>Limits.</strong> Messages are capped at {LIMITS.message.toLocaleString("en-GB")} characters (job descriptions at {LIMITS.jobDescription.toLocaleString("en-GB")}), with per-visitor rate limits.
            </li>
          </ul>
        </section>

        <section aria-labelledby="t-third">
          <h2 id="t-third" className="h2">
            Model provider and third parties
          </h2>
          {ai.engine === "model" ? (
            <p>
              When you ask a question in “Ask” or “This project” mode, your question and the relevant approved portfolio records are sent to {ai.vendor} to generate the answer. Requests are made from this site’s server; no key or account detail reaches your browser. The provider’s own retention terms apply to that request. Recruiter, résumé, job-description and contact modes run entirely on this site and send nothing to a model provider.
            </p>
          ) : (
            <p>In the current configuration nothing you type is sent to a third-party AI provider. If a model provider is enabled later, this section will name it and say what is sent.</p>
          )}
        </section>

        <section aria-labelledby="t-wrong">
          <h2 id="t-wrong" className="h2">
            If an answer is wrong
          </h2>
          <p>
            AI responses may be incomplete or mistaken. <strong>The portfolio pages remain the authoritative source</strong> — every answer links to them. To report a problem, use “Report an issue” under any answer, or email{" "}
            <a className="link" href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Riyad AI — report an issue")}`}>
              {site.contact.email}
            </a>
            .
          </p>
          <p>Because conversations are not stored, there is normally nothing to delete. If you have emailed a report and want it removed, ask at the same address.</p>
        </section>

        <section aria-labelledby="t-site">
          <h2 id="t-site" className="h2">
            The rest of the site
          </h2>
          <ul className="list">
            <li>
              <strong>Contact form.</strong>{" "}
              {delivery
                ? "After you preview and confirm, your message is emailed to Riyad through an email delivery service and used only to reply to you."
                : "This site does not send email for you. After you preview your message, it opens in your own email app, and nothing is stored here."}
            </li>
            <li>
              <strong>Analytics.</strong> Off unless you switch it on. When on, it counts events such as “case study viewed” — never AI conversations, job descriptions, contact messages or personal details.
            </li>
            <li>
              <strong>Browser storage.</strong> Your theme and motion choices are saved in your browser because you asked for them. Your chosen perspective is saved only if you enable “Remember my view”. There are no advertising cookies.
            </li>
          </ul>
          <p>
            <PreferencesButton className="btn btn--ghost btn--sm">Open display and privacy settings</PreferencesButton>
          </p>
        </section>

        <p className="small muted">
          Prefer not to use AI at all?{" "}
          <Link href="/work" className="link">
            Everything is available on the ordinary pages
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
