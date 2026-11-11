import type { Metadata } from "next";
import Link from "next/link";
import AIWorkspace from "@/components/ai/AIWorkspace";
import { Track } from "@/components/UI";

export const metadata: Metadata = {
  title: "Riyad AI — AI Concierge",
  description: "An evidence-grounded guide to Riyad Ahmed's work, experience, projects, and professional fit. Every answer cites approved public portfolio content.",
  alternates: { canonical: "/ai" },
};

export default function AIPage() {
  return (
    <div className="wrap ai-page">
      <Track event="ai_opened" props={{ entry: "page" }} />
      <header className="ai-page__head">
        <p className="eyebrow">Riyad AI</p>
        <h1 className="h1" style={{ marginTop: "1rem" }}>
          Ask the portfolio.
        </h1>
        <p className="lede" style={{ marginTop: "1rem" }}>
          An evidence-grounded guide to Riyad’s work, experience, projects, and professional fit.
        </p>
        <ul className="list small" style={{ marginTop: "1.5rem" }}>
          <li>Answers come only from approved public portfolio content, and show their sources.</li>
          <li>It says so when the portfolio has no verified evidence.</li>
          <li>It cannot send messages, schedule meetings or make commitments.</li>
          <li>Conversations are temporary and are not stored.</li>
        </ul>
        <p className="small" style={{ marginTop: "1.5rem" }}>
          <Link href="/privacy" className="link">
            How Riyad AI works
          </Link>{" "}
          ·{" "}
          <Link href="/work" className="link">
            Continue without AI
          </Link>
        </p>
        <noscript>
          <p className="state" style={{ marginTop: "1.5rem" }}>
            Riyad AI needs JavaScript. Everything it knows is also on the Work, Experience and Resume pages.
          </p>
        </noscript>
      </header>
      <div className="ai-page__workspace">
        <AIWorkspace variant="page" />
      </div>
    </div>
  );
}
