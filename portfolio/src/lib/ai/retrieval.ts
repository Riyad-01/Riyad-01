import { publicRecords } from "./knowledge";
import type { KnowledgeRecord, Retrieved, RetrievalProvider } from "./types";

/**
 * Default retrieval: BM25 lexical search over the curated public records.
 *
 * The knowledge base is small (a few hundred short records), so lexical
 * search is fast, deterministic, free to run and easy to audit. To move to
 * vector search later, implement RetrievalProvider with an EmbeddingModel
 * and a vector store, and return it from getRetriever().
 */

const STOP = new Set(
  "a an and are as at be by can could did do does for from had has have he her his how i in is it its me my of on or our should so that the their them they this to was we were what when where which who why will with would you your about tell show give riyad riyads ahmed please".split(
    " ",
  ),
);

const SYNONYMS: Record<string, string[]> = {
  managed: ["led", "leadership"],
  manage: ["led", "leadership"],
  manager: ["led", "leadership"],
  lead: ["led"],
  leading: ["led"],
  hire: ["roles", "hiring"],
  cv: ["resume"],
  résumé: ["resume"],
  job: ["role", "roles"],
  jobs: ["osynjobs", "roles"],
  osyn: ["osynjobs"],
  edtech: ["elearning", "learning"],
  courses: ["course", "elearning"],
  mentoring: ["mentored"],
  designer: ["design", "ux"],
  team: ["teams", "people"],
  built: ["build", "building"],
  projects: ["case", "work", "lab"],
};

export function tokenize(text: string): string[] {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+.#/\- ]+/g, " ")
    .split(/[\s/\-]+/)
    .map((t) => t.replace(/^[.#]+|[.#]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));
  return base;
}

function expand(tokens: string[]): string[] {
  const out = [...tokens];
  for (const t of tokens) if (SYNONYMS[t]) out.push(...SYNONYMS[t]);
  return [...new Set(out)];
}

interface Indexed {
  record: KnowledgeRecord;
  tf: Map<string, number>;
  len: number;
  boost: Set<string>;
}

let index: { docs: Indexed[]; df: Map<string, number>; avg: number } | null = null;

function getIndex() {
  if (index) return index;
  const df = new Map<string, number>();
  const docs = publicRecords().map((record) => {
    const tokens = tokenize(`${record.title} ${record.title} ${record.content} ${(record.keywords ?? []).join(" ")}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    const boost = new Set((record.keywords ?? []).flatMap((k) => tokenize(k)));
    return { record, tf, len: tokens.length, boost };
  });
  const avg = docs.reduce((n, d) => n + d.len, 0) / Math.max(docs.length, 1);
  index = { docs, df, avg };
  return index;
}

const K1 = 1.4;
const B = 0.7;
/** Below this score a result is treated as "no evidence" rather than stretched into an answer. */
export const MIN_SCORE = 2.4;

export const lexicalRetriever: RetrievalProvider = {
  name: "bm25-lexical",
  async search(query, { mode, project, limit }) {
    const { docs, df, avg } = getIndex();
    let terms = expand(tokenize(query));
    // "Who is Riyad?" is all stop-words: treat a bare question about him as a profile request.
    if (terms.length === 0 && /\b(riyad|he|him|his)\b/i.test(query)) terms = ["profile", "identity", "summary"];
    if (terms.length === 0) return [];
    const n = docs.length;
    const scored: Retrieved[] = [];
    for (const d of docs) {
      if (!d.record.modes.includes(mode)) continue;
      // Project mode: only the current project and directly connected evidence.
      const inProject = project ? d.record.relatedProjects.includes(project) : false;
      if (mode === "project" && project && !inProject && d.record.category === "case-study") continue;
      let score = 0;
      for (const t of terms) {
        const f = d.tf.get(t);
        if (f) {
          const idf = Math.log(1 + (n - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
          score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / avg)));
        }
        if (d.boost.has(t)) score += 3;
      }
      if (score <= 0) continue;
      if (d.record.category === "faq") score *= 1.5;
      if (d.record.id.endsWith("-overview") || d.record.id === "profile") score *= 1.25;
      if (inProject) score *= mode === "project" ? 1.6 : 1.1;
      scored.push({ record: d.record, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.filter((s) => s.score >= MIN_SCORE).slice(0, limit);
  },
};

export function getRetriever(): RetrievalProvider {
  return lexicalRetriever;
}
