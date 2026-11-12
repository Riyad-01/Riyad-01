# Riyad Ahmed — AI-native portfolio

**From human needs to working systems.**

A production portfolio for Riyad Ahmed, AI Product & Learning Systems Architect. It is built as a product, not a template: structured content, an evidence system, a grounded AI guide ("Riyad AI"), and a token-driven design system.

> New to code? Read this page top to bottom, then `docs/SETUP.md`. You can edit almost everything about the site from the files in `src/content/` without touching any other code.

## What is in here

| Area | Where | What it does |
| --- | --- | --- |
| Content | `src/content/` | Every word, number, project and status on the site. Edit here. |
| Pages | `src/app/` | The routes: home, work, case studies, lab, about, experience, résumé, AI, contact, privacy, 404. |
| Components | `src/components/` | Reusable interface pieces. |
| Design system | `src/app/globals.css` | Colour, type, spacing, motion tokens and primitives. |
| Riyad AI | `src/lib/ai/` | Knowledge base, retrieval, security guards, agent engine, model provider. |
| Services | `src/lib/services/`, `src/lib/analytics.ts` | Contact/email and analytics, behind swappable interfaces. |
| Tests | `tests/ai.test.ts` | 13 checks on grounding, citations, prompt-injection defence and agent rules. |
| Guides | `docs/` | Setup, deployment, content editing, AI knowledge, security, assets, verification. |

## Quick start

```bash
cd portfolio
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

Other commands: `npm run build` (production build), `npm start` (serve the build), `npm test` (AI tests), `npm run typecheck`.

The site runs fully with **no keys at all**. Without `ANTHROPIC_API_KEY`, Riyad AI answers in "grounded retrieval" mode (assembled directly from approved records). Without an email key, the contact form opens the visitor's own email app.

## How the important ideas work

**1. Content is written once.** Pages, global search, the command palette and the AI knowledge base are all generated from `src/content/`. Change a fact in one place and it changes everywhere.

**2. Every claim has an evidence status.** `verified`, `approximate`, `personal-project`, `professional-work`, `sanitized`, `awaiting-confirmation`, `do-not-publish`. Draft material is shown with a visible label. The AI can only read the first five.

**3. Missing evidence is shown, not invented.** Anything in `[SQUARE BRACKETS]` such as `[VERIFY BEFORE PUBLISHING: employer]` is a deliberate placeholder. See `docs/ASSETS.md` for the full list to replace.

**4. Riyad AI is one system with six modes.** Ask (concierge), This project, I am hiring (recruiter), Compare a job description (opportunity fit), Choose a résumé, Contact Riyad (message preparation). Site navigation is handled through validated action buttons in any mode. Only the first two ever call a language model; the rest are transparent rules.

**5. The model is treated as untrusted.** Input is sanitised and screened in code, the model has no tools, citations are checked against the records it was actually given, links are allow-listed, and anything that would act on the outside world needs a preview and an explicit click. Details: `docs/SECURITY_CHECKLIST.md`.

## Architecture at a glance

```
src/content/*  ──►  pages (server-rendered, static)
      │        ──►  search index + command palette
      └──────►  knowledge.ts (public, approved records only)
                     │
visitor ─► /api/ai ─► validate ─► sanitise ─► guards ─► rate limit
                     │
        ┌────────────┴─────────────┐
   rules modes                retrieval (BM25)
 (recruiter, résumé,               │
  fit, contact)          model (optional) ─► citation check
        └────────────┬─────────────┘
              allow-list links ─► schema check ─► response
```

Swappable interfaces (no vendor lock-in): `ChatModel`, `EmbeddingModel`, `RetrievalProvider` (`src/lib/ai/types.ts`), `LimitStore` (`ratelimit.ts`), `EmailService` (`services/contact.ts`), `AnalyticsProvider` (`analytics.ts`). Content can move to MDX, a headless CMS or a database by replacing the exports in `src/content/` with loaders of the same shape.

## Analytics event map

Defined and type-checked in `src/lib/analytics.ts`. Nothing is sent unless the visitor switches analytics on **and** a provider is configured.

`project_viewed` · `case_study_completed` · `resume_downloaded` · `resume_variant_selected` · `ai_opened` · `ai_question` (category only) · `source_opened` · `recruiter_mode_activated` · `job_description_compared` · `contact_started` · `contact_submitted` · `linkedin_opened` · `role_perspective_changed` · `project_filter_used` · `command_palette_used` · `theme_changed` · `motion_reduced`

Never recorded: AI conversation text, job descriptions, contact messages, personal or protected information.

## Quality status

See `docs/VERIFICATION.md` for what was tested and the results, and what still needs Riyad's input before going live.
