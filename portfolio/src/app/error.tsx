"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap page-head" role="alert">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="h1" style={{ marginTop: "1rem" }}>
        This page failed to load.
      </h1>
      <p className="lede" style={{ marginTop: "1rem" }}>
        Nothing you entered has been lost elsewhere. Try again, or head back to the work.
      </p>
      <div className="cluster" style={{ marginTop: "2rem" }}>
        <button type="button" className="btn btn--primary" onClick={reset}>
          Try again
        </button>
        <Link href="/work" className="btn btn--ghost">
          Selected work
        </Link>
      </div>
    </div>
  );
}
