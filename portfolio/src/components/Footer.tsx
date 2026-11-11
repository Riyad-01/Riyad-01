import Link from "next/link";
import { nav, site } from "@/content/site";
import { AskAI, PreferencesButton } from "./UI";

export default function Footer() {
  return (
    <footer className="site-footer tone-ink">
      <div className="wrap">
        <div className="site-footer__cta">
          <p className="eyebrow">Next step</p>
          <h2 className="h1">What are you trying to make easier?</h2>
          <div className="cluster">
            <Link href="/contact" className="btn btn--primary">
              Start a conversation <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/resume" className="btn btn--ghost">
              Choose a résumé
            </Link>
            <AskAI entry="nav">Ask Riyad AI</AskAI>
          </div>
        </div>
        <div className="site-footer__grid">
          <div>
            <p className="wordmark__name">{site.name}</p>
            <p className="small muted" style={{ marginTop: "0.5rem", maxWidth: "32ch" }}>
              {site.role}. {site.location}.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="meta">Site</p>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ai" className="link">
                  Riyad AI
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <p className="meta">Contact</p>
            <ul>
              <li>
                <a href={`mailto:${site.contact.email}`} className="link">
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={site.contact.linkedin} className="link" rel="noopener noreferrer" target="_blank">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={site.contact.github} className="link" rel="noopener noreferrer" target="_blank">
                  GitHub<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="meta">Trust</p>
            <ul>
              <li>
                <Link href="/privacy" className="link">
                  Privacy and AI transparency
                </Link>
              </li>
              <li>
                <PreferencesButton>Display and privacy settings</PreferencesButton>
              </li>
            </ul>
          </div>
        </div>
        <p className="meta site-footer__legal">
          © {new Date().getFullYear()} {site.name}. Figures are approximate professional scope. Content last reviewed {site.lastReviewed}.
        </p>
      </div>
    </footer>
  );
}
