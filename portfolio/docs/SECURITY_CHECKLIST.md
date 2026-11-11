# Security checklist

Status of each control from the brief, and where it lives. "Operator" items need action from you at deployment.

## Boundaries
- [x] Model treated as untrusted; system prompt not relied on as a boundary — guards run in code (`guard.ts`, `engine.ts`)
- [x] Instructions, evidence, user input and history kept structurally separate (`providers/anthropic.ts`)
- [x] Retrieved and pasted text treated as data; pasted job descriptions never reach a model
- [x] No memory: nothing persists between requests, visitors or sessions; nothing a visitor types can change the knowledge base

## Prompt injection
- [x] Detection of prompt-reveal and instruction-override attempts (`detectInjection`)
- [x] Invisible/zero-width/bidi characters stripped and flagged; markup removed; length capped (`sanitize`)
- [x] Restricted content cannot be retrieved: drafts and "do not publish" never enter the index
- [x] Output scrubbed of URLs outside the allow-list, markup and key-shaped strings

## Least privilege and authorization
- [x] Public agents are read-only: no filesystem, shell, email, calendar, CMS, deployment or database access exists in the code path
- [x] The model has no tools at all; "actions" are suggestions validated by schema and allow-list in code
- [x] Citations verified deterministically against supplied records
- [x] Request and response schemas validated (zod); invalid responses fail closed

## Human approval
- [x] Contact draft: preview → explicit approval → fills the form only; never sends
- [x] Contact form: preview → explicit confirmation → send; cancel at every step
- [x] Approved submissions logged by inquiry type only

## Rate and cost
- [x] Per-visitor per-minute and per-day limits; message, history and token limits; 20-second timeout
- [x] Single model call per request (no loops); circuit breaker after repeated failures
- [x] Global daily model budget with an 80% alert log line
- [ ] **Operator:** set a hard spend limit in the model provider's console
- [ ] **Operator:** for strict global limits on serverless, back `LimitStore` with a shared store

## Data protection
- [x] API keys server-side only; model and email calls made from the server
- [x] Logs contain event name, mode, sizes and a daily-rotating salted hash — never message text; `redact()` available for any future logging
- [x] Same-origin check on API routes; request size caps; `no-store` on API responses
- [x] Security headers: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- [x] Contact spam protection: honeypot, minimum fill time, rate limit
- [ ] **Operator:** set `AI_LOG_SALT`; set host log retention to 30 days; confirm HTTPS (encryption in transit) and your host's encryption at rest

## Monitoring
- [x] Security events logged: blocked injection, hidden characters, declined restricted topics, rate limits, rejected citations, no-evidence, model errors
- [x] Hallucination reports: "Report an issue" under every answer
- [ ] **Operator:** there is no admin dashboard. Review events in your hosting provider's log viewer (filter on `"event":"ai.`), or forward logs to a monitoring tool

## Failure behaviour
- [x] Restricted actions fail closed; model failure falls back to grounded retrieval; total failure shows non-AI navigation
- [x] Raw errors, prompts and stack traces are never returned
- [x] Whole site works with AI off, with JavaScript off (content pages), and with WebGL unavailable

## Known limits (honest)
- Pattern-based injection detection can be evaded by a determined attacker. That is why the design does not depend on it: the model has no tools, no secrets and no private data, so the worst case is a wrong sentence, which the citation check and the visible sources constrain.
- The CSP allows inline scripts and styles because the framework requires them without a nonce setup.
