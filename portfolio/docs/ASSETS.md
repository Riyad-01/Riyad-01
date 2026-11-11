# Asset-requirements list

Everything the site is still waiting for from Riyad. Each appears on the site as a visible placeholder until supplied. Search the code for the text in brackets to find it.

## Must confirm before public launch
| Item | Where | Search for |
| --- | --- | --- |
| Official job titles, employers and dates (3 entries) | `experience.ts` | `[VERIFY BEFORE PUBLISHING: official title]` |
| OsynJobs start date | `projects.ts`, `experience.ts` | `start date` |
| OsynJobs: principles, feature map, stack, roadmap, exclusions | `projects.ts` | sections marked `awaiting-confirmation` |
| Education, certifications, languages | `experience.ts` → `resumeShared` | `[ADD VERIFIED` |
| Specific AI tools and models used | `site.ts` → `tools.placeholder` | `specific AI tools` |
| Lab one-liners for OsynLearn, OsynLingo, ClientHunt, OsynConnect | `lab.ts` | `[VERIFY BEFORE PUBLISHING: one-line` |
| StudyHub UK and Saudi Compliance Institute: scope, role, dates, what may be shown | `projects.ts` | `[VERIFY BEFORE PUBLISHING` |

## Visual assets
| Asset | Spec |
| --- | --- |
| Portrait | Real photo, 4:5, at least 1200×1500, WebP or AVIF. Place in `public/` and replace the placeholder in `src/app/about/page.tsx` using `next/image`. |
| OsynJobs screenshots | Real product screens, 16:10, 2× resolution, personal data removed |
| StudyHub UK screenshots | Approved by the client/employer, sanitized |
| Template/framework examples | Sanitized Storyline/Rise examples |
| Process diagrams | Sanitized versions of real workflows |
| Résumé PDFs (optional) | The site already produces print-ready PDFs from the browser. To offer fixed files, add them to `public/resumes/` and link them on the résumé pages. |

## Evidence to add when available
`[ADD VERIFIED METRIC]`, `[ADD VERIFIED RESULT]`, `[ADD REAL TESTING INSIGHT]`, `[ADD SANITIZED PROCESS]`, `[ADD APPROVED FEEDBACK]`, `[ADD APPROVED TESTIMONIAL]`.

## Rule
If you cannot verify it or do not have permission to show it, leave the placeholder. A visible gap is honest; an invented fact is a liability in an interview.
