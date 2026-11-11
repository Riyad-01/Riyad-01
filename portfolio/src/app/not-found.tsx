import type { Metadata } from "next";
import Link from "next/link";
import { AskAI } from "@/components/UI";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="tone-ink notfound">
      <div className="wrap">
        <p className="eyebrow">404 — no working system here</p>
        <h1 className="display" style={{ marginTop: "1.5rem" }}>
          This path
          <br />
          leads nowhere.
        </h1>
        <p className="lede" style={{ marginTop: "1.5rem" }}>
          The page may have moved, or the link may be mistyped. These all work:
        </p>
        <div className="cluster" style={{ marginTop: "2rem" }}>
          <Link href="/" className="btn btn--primary">
            Go home
          </Link>
          <Link href="/work" className="btn btn--ghost">
            Selected work
          </Link>
          <Link href="/resume" className="btn btn--ghost">
            Resume
          </Link>
          <Link href="/contact" className="btn btn--ghost">
            Contact
          </Link>
          <AskAI entry="page">Ask Riyad AI</AskAI>
        </div>
      </div>
    </div>
  );
}
