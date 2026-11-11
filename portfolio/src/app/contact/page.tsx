import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { site } from "@/content/site";
import { INQUIRY_TYPES } from "@/lib/services/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Riyad Ahmed about international remote roles, product, learning technology, UX, AI collaboration or consulting.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="wrap contact">
      <header className="contact__head">
        <p className="eyebrow">Contact</p>
        <h1 className="h1" style={{ marginTop: "1rem" }}>
          What are you trying to make easier?
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem" }}>
          Tell me about the role, the project or the problem. I read every message myself.
        </p>
        {site.availability.open && (
          <p className="status-pill" style={{ marginTop: "1.5rem", whiteSpace: "normal", padding: "0.6rem 0.9rem", minHeight: 0 }}>
            <span className="status-pill__dot" aria-hidden="true" />
            {site.availability.label}
          </p>
        )}
        <dl className="contact__direct">
          <div>
            <dt className="meta">Email</dt>
            <dd>
              <a href={`mailto:${site.contact.email}`} className="link">
                {site.contact.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="meta">LinkedIn</dt>
            <dd>
              <a href={site.contact.linkedin} className="link" rel="noopener noreferrer" target="_blank">
                {site.contact.linkedinLabel}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </dd>
          </div>
          <div>
            <dt className="meta">I can help with</dt>
            <dd>
              <ul className="list small">
                {INQUIRY_TYPES.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </header>
      <section className="contact__form" aria-label="Contact form">
        <ContactForm />
        <p className="small muted" style={{ marginTop: "2rem" }}>
          <strong>Privacy.</strong> Your message is used only to reply to you. It is not added to a mailing list, not used for analytics, and not shown to Riyad AI.{" "}
          <Link href="/privacy" className="link">
            Privacy and AI transparency
          </Link>
        </p>
        <noscript>
          <p className="state" style={{ marginTop: "1rem" }}>
            The form needs JavaScript. You can email {site.contact.email} directly instead.
          </p>
        </noscript>
      </section>
    </div>
  );
}
