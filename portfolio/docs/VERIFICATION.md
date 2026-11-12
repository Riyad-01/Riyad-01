# Verification checklist

What was actually tested on the production build, and what remains. Re-run after significant changes.

## Automated (run and passing)
- **AI unit tests — 13/13** (`npm test`): knowledge base contains only public approved records with no placeholders; answers cite sources; leadership figures are exact; unknown facts are acknowledged; prompt injection and hidden characters are blocked; restricted topics are declined; recruiter mode is measured and never says "perfect candidate"; job-fit gives matches and gaps with no percentage and ignores embedded instructions; résumé logic is shown; the contact agent only offers a preview; project mode stays in the project; all links are internal.
- **Accessibility scan (axe-core, WCAG 2.0/2.1/2.2 A and AA)**: 0 violations on 13 routes in both light and dark themes.
- **Browser behaviour**: skip link is the first tab stop; command palette (Ctrl/Cmd+K) searches and navigates; case-study "Ask AI" answers with sources; drawer closes on Escape; perspective switcher reorders work, updates the URL and stores nothing without consent; bookmarkable work filters; value-chain arrow keys; theme persists; contact validation focuses the error summary; confirmation preview before sending; AI draft fills the form only after approval.
- **Resilience**: content pages render with JavaScript disabled (static SVG shown in place of WebGL); 404 returns status 404; no horizontal scrolling at 360px on 8 routes; mobile menu opens and closes.
- **API hardening**: cross-origin requests rejected (403); invalid mode rejected (400); security headers present.
- **Performance (local production build)**: homepage layout shift 0; Three.js is not downloaded on mobile; AI workspace, command palette and settings load only when opened; all content pages are statically generated.

## Not yet verified — do these before launch
- [ ] Screen-reader pass with a real reader (NVDA or VoiceOver) through the homepage, one case study, the AI workspace and the contact form. The automated scan cannot judge reading order or announcement quality.
- [ ] Lighthouse on the deployed URL (real network conditions).
- [ ] The language-model path end to end. It was built to the provider's documented interface and type-checked, but no API key was available in the build environment, so it has not been run against the live service. With a key set, ask the ten questions in section 13 of the brief and confirm sources and labels.
- [ ] Server-side email (Resend) with real keys. Without keys the tested behaviour is the email-app fallback.
- [ ] Print each résumé to PDF and check page breaks once real titles and dates are in.
- [ ] Real devices: one iPhone, one Android, one tablet.

## Review gates from the brief
| Gate | Status |
| --- | --- |
| Creative direction | Pass — original system, one signature visualization, distinct composition per featured project |
| Recruiter | Pass with a dependency — role, value, scale and next action are in the first viewport; **official titles are placeholders until Riyad confirms them** |
| Product | Pass — problems, constraints, tradeoffs, limits and status visible; experiments labelled honestly |
| AI | Pass on rules and retrieval paths; model path pending a live-key run |
| Security | Pass in code; operator items listed in `SECURITY_CHECKLIST.md` |
| Accessibility | Automated pass; manual screen-reader pass pending |
| Performance | Local pass; field measurement pending deployment |
| Content | **Not ready to publish as final** — see `ASSETS.md`. Placeholders are visible wherever evidence is missing, by design |
