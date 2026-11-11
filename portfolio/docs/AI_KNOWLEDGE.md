# AI knowledge-management guide

## What Riyad AI knows
Only records built in `src/lib/ai/knowledge.ts` from `src/content/`. It reads nothing else: no files, email, analytics, CMS drafts or past conversations.

Each record carries: id, title, content, category, source URL, source label, evidence status, publication status, last-reviewed date, owner, sensitivity, related projects, and the agent modes allowed to use it.

A record is retrievable **only if** `publication = published`, `sensitivity = public`, and its evidence status is one of: verified, approximate, personal-project, professional-work, sanitized. Text containing a `[PLACEHOLDER]` is stripped before indexing. A test fails if a placeholder or draft ever leaks in.

## How an answer is produced (Ask and This-project modes)
1. The question is validated, cleaned of hidden characters, and screened for prompt injection and restricted topics.
2. BM25 search finds the most relevant approved records. If nothing scores above the threshold, the answer is: "I do not have verified portfolio evidence for that yet." plus adjacent material and a contact route.
3. If a model is configured, it receives the fixed instructions, the records (marked as data) and the question (marked as untrusted). It must return structured output including the ids of records it used.
4. Code checks every cited id against the records actually supplied. Answers with no valid citation are discarded and replaced by a direct, rule-assembled answer.
5. Links are checked against an allow-list of real site routes; the response is validated against a schema before it is sent.

## Improving answers
- **Add an FAQ** in `src/content/experience.ts` with `keywords`. This is the most effective lever.
- **Confirm draft sections** in case studies so they become retrievable.
- **Add synonyms** in `SYNONYMS` in `retrieval.ts` if visitors use words your content does not.
- **Add capabilities or gaps** in `src/content/fit.ts` to sharpen job-description comparison.
- Then run `npm test`. Add a test for any question that matters to you.

## Review routine (monthly, 15 minutes)
1. Update `lastReviewed` in `site.ts`.
2. Ask the ten questions in section 13 of the brief and read the answers and sources.
3. Check hosting logs for `ai.no_evidence` (questions you cannot yet answer) and `ai.blocked.*` (attack attempts).
4. Read any "Report an issue" emails.

## Changing providers
- **Model**: implement `ChatModel` (see `providers/anthropic.ts`) and return it from `getModel()` in `engine.ts`.
- **Vector search**: implement `RetrievalProvider` using an `EmbeddingModel` and return it from `getRetriever()`. With a few hundred short records, lexical search is accurate, free and auditable; switch only when the knowledge base grows.

## What must never be added
Private email, internal employer or client documents, unredacted team information, health or financial information, credentials, private analytics, job applications, or any chat history.
