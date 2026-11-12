import type { Metadata } from "next";
import Link from "next/link";
import WorkIndex from "@/components/WorkIndex";

export const metadata: Metadata = {
  title: "Selected work",
  description: "Five case studies across AI products, learning architecture at scale, AI-assisted workflows, creative UX and cross-functional leadership.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <header className="wrap page-head">
        <p className="eyebrow">Work</p>
        <h1 className="h1" style={{ marginTop: "1rem" }}>
          Selected work, with the evidence labelled.
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem" }}>
          Each case study separates professional work from personal products, and verified facts from material still awaiting confirmation. Where something is missing, the page says so.
        </p>
      </header>
      <section className="wrap" style={{ paddingBottom: "var(--space-editorial)" }} aria-label="Case studies">
        <WorkIndex />
        <p style={{ marginTop: "3rem" }} className="lede">
          Looking for prototypes and experiments?{" "}
          <Link href="/lab" className="link">
            Visit the Product Lab
          </Link>
          .
        </p>
      </section>
    </>
  );
}
