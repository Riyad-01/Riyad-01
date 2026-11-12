# Deployment guide

The site is a standard Next.js app. Vercel is the simplest host; any Node host works.

## GitHub Pages (free, automatic)
The workflow in `.github/workflows/pages.yml` builds a static version and publishes it.
1. Merge the branch into `main` (GitHub Pages only deploys from `main` by default).
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Open the **Actions** tab; when "Deploy portfolio to GitHub Pages" turns green, your site is at `https://<your-username>.github.io/<repository-name>/`.

In this static version Riyad AI runs in the visitor's browser using the same approved content and rules (no server, no API key, nothing sent anywhere), and the contact form opens the visitor's email app. The Claude model option and server-side email need the Vercel route below.

## Vercel (full version, with server features)
1. Push this repository to GitHub.
2. In Vercel: **Add New → Project →** choose the repository.
3. Set **Root Directory** to `portfolio` (important — the app is not at the repository root).
4. Add the environment variables from `docs/SETUP.md` (at minimum `NEXT_PUBLIC_SITE_URL`).
5. Deploy. Add your custom domain under **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL` and redeploy.

## Any Node host
```bash
npm ci && npm run build && npm start   # serves on port 3000
```

## Before you go live
- [ ] Work through `docs/ASSETS.md` and replace placeholders you are ready to publish.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [ ] If enabling the AI model: set `ANTHROPIC_API_KEY`, choose `AI_MODEL`, set a spend limit in the provider console, and set `AI_LOG_SALT`.
- [ ] If enabling server-side email: verify your sending domain with Resend.
- [ ] Run through `docs/SECURITY_CHECKLIST.md` and `docs/VERIFICATION.md`.
- [ ] Open `/privacy` on the live site — it reports the configuration actually running.

## Production notes
- **Rate limiting** is in-memory. On serverless hosts each instance counts separately, so limits are a floor, not a hard global cap. For strict limits, implement `LimitStore` in `src/lib/ai/ratelimit.ts` with a shared store such as Redis. The daily model budget and the provider-side spend limit are your backstops.
- **Logs** are structured JSON lines with no message content. Set your host's log retention to 30 days to match the privacy page.
- **Search engines**: `/api/*` is disallowed in `robots.txt` and sends `X-Robots-Tag: noindex`.
- **Kill switch**: `AI_ENABLED=off` disables the AI instantly; the rest of the site is unaffected.
