export default function Loading() {
  return (
    <div className="wrap page-head" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="skeleton" style={{ height: "0.8rem", width: "8rem" }} />
      <div className="skeleton" style={{ height: "3.5rem", width: "min(36rem, 90%)", marginTop: "1.5rem" }} />
      <div className="skeleton" style={{ height: "1rem", width: "min(28rem, 80%)", marginTop: "1.5rem" }} />
    </div>
  );
}
