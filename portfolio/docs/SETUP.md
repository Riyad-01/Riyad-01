# Setup guide

## You need
- Node.js 20 or newer (`node -v` to check)
- A terminal, opened in the `portfolio/` folder

## Steps
1. `npm install` — downloads the libraries the site uses.
2. `cp .env.example .env.local` — creates your private settings file. It is ignored by git, so secrets never get committed.
3. `npm run dev` — starts the site at http://localhost:3000. Edits appear as you save.

## Settings (`.env.local`)

| Setting | Needed? | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Before launch | Your real address, e.g. `https://yourdomain.com`. Used for sharing cards, sitemap and canonical links. |
| `ANTHROPIC_API_KEY` | Optional | Lets Riyad AI write answers with a language model. Leave empty for grounded retrieval mode. |
| `AI_MODEL` | Optional | Which model to use. Default `claude-opus-5-5`. A cheaper option for a public site is `claude-haiku-5-5`. |
| `AI_ENABLED` | Optional | Set to `off` to switch the AI endpoint off instantly. |
| `AI_RATE_LIMIT_PER_MINUTE`, `AI_RATE_LIMIT_PER_DAY`, `AI_DAILY_BUDGET_REQUESTS` | Optional | Per-visitor limits and a global daily ceiling on model calls. |
| `AI_LOG_SALT` | Recommended | Any random text. Makes the anonymous visitor identifier in logs unguessable. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Optional | Lets the contact form send email from the server (via Resend). Without them it opens the visitor's email app. |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | `plausible` + your domain to enable privacy-friendly analytics (still requires visitor opt-in). |

## Checking your work
- `npm test` — the AI safety and grounding tests. All should pass.
- `npm run typecheck` — catches mistakes in content files (for example a missing field).
- `npm run build` — the same build the host will run. If it passes here, it will deploy.

## Thinking like an engineer: three habits this project models
1. **One source of truth.** A fact lives in one file; everything else reads it.
2. **Make gaps visible.** A labelled placeholder is better than a confident guess.
3. **Check, do not trust.** Tests and validation run in code; nothing relies on "it should be fine".
