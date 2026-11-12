# Content-editing guide

All content lives in `src/content/`. You do not need to edit components to change what the site says.

| File | Contains |
| --- | --- |
| `site.ts` | Name, role, statement, **availability status**, contact details, navigation, metrics, perspectives, value chain, process steps, career stages, principles, tools |
| `projects.ts` | The five case studies and OsynJobs extras |
| `lab.ts` | Product Lab items |
| `experience.ts` | Experience timeline, three résumé variants, approved FAQs |
| `fit.ts` | Capability list, known gaps, role profiles and résumé rules used by the recruiter and job-fit agents |
| `types.ts` | The shape every piece of content must follow |

## Common edits

**Change availability.** In `site.ts`, edit `availability`. `open: false` hides the indicator everywhere.

**Replace a placeholder.** Search for `[VERIFY` or `[ADD` and replace the bracketed text with the real fact. If a section was `evidence: "awaiting-confirmation"`, change it to the correct status once confirmed (see below) — that is also what makes it visible to Riyad AI.

**Evidence statuses.**
- `verified` — a confirmed fact
- `approximate` — a real figure given as a range
- `professional-work` / `personal-project` — where the work comes from
- `sanitized` — real material with confidential detail removed
- `awaiting-confirmation` — draft; shown with a warning label; hidden from the AI
- `do-not-publish` — never rendered, never retrievable

**Add a case study.** Copy an existing object in `projects.ts`, give it a new `slug`, and fill every section (TypeScript will tell you if one is missing). It appears automatically in Work, search, the sitemap and the AI. To feature it on the homepage, add its slug to the `order` lists in `site.ts` and give it a composition in `src/components/home/FeaturedWork.tsx`.

**Add a Lab item, FAQ, role or résumé.** Add an object to the matching array. FAQs are the highest-quality AI answers — add one whenever you notice a question the AI should answer well.

**Add a testimonial or article.** These are not on the site yet because none were supplied. Add a new array in `src/content/`, render it in a page, and add records in `src/lib/ai/knowledge.ts` if the AI should use it. Only add real, approved quotes.

## Rules to keep
1. Never invent a metric, user count, client, result, title or quote.
2. Keep ranges and "approximately" exactly as they are.
3. Label personal projects, prototypes and experiments as what they are.
4. After editing, run `npm run typecheck && npm test`.

## Moving to a CMS later
Each content file exports plain typed data. Replace the export with a loader that returns the same type (from MDX files, a headless CMS or a database). Pages and the AI do not need to change.
