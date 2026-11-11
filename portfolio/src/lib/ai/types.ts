import { z } from "zod";
import type { EvidenceStatus } from "@/content/types";

/* ------------------------------------------------------------------ *
 * Knowledge
 * ------------------------------------------------------------------ */

export type AgentMode = "concierge" | "recruiter" | "project" | "resume" | "fit" | "contact";

export type KnowledgeCategory =
  | "faq"
  | "profile"
  | "metric"
  | "case-study"
  | "lab"
  | "experience"
  | "resume"
  | "philosophy"
  | "tools";

export interface KnowledgeRecord {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  sourceUrl: string;
  sourceLabel: string;
  evidence: EvidenceStatus;
  publication: "published" | "draft";
  lastReviewed: string;
  owner: string;
  sensitivity: "public" | "internal" | "restricted";
  relatedProjects: string[];
  modes: AgentMode[];
  keywords?: string[];
}

/* ------------------------------------------------------------------ *
 * Provider interfaces — swap vendors without touching the engine.
 * ------------------------------------------------------------------ */

export interface Retrieved {
  record: KnowledgeRecord;
  score: number;
}

export interface RetrievalProvider {
  name: string;
  search(query: string, opts: { mode: AgentMode; project?: string; limit: number }): Promise<Retrieved[]>;
}

/** Reserved for a future vector-search provider. Not used by the default lexical retriever. */
export interface EmbeddingModel {
  name: string;
  embed(texts: string[]): Promise<number[][]>;
}

export interface GroundedDraft {
  answer: string;
  supportingPoints: string[];
  interpretation: string | null;
  citedRecordIds: string[];
  hasEvidence: boolean;
  followups: string[];
}

export interface ChatModel {
  name: string;
  /** Vendor label shown on the transparency page. */
  vendor: string;
  generate(input: {
    question: string;
    history: { role: "user" | "assistant"; text: string }[];
    records: KnowledgeRecord[];
    mode: AgentMode;
    signal: AbortSignal;
  }): Promise<GroundedDraft | null>;
}

/* ------------------------------------------------------------------ *
 * Wire schema — every request and response is validated.
 * ------------------------------------------------------------------ */

export const LIMITS = {
  message: 1200,
  jobDescription: 12000,
  historyTurns: 6,
  historyText: 600,
  sources: 5,
  timeoutMs: 20000,
} as const;

export const RequestSchema = z.object({
  mode: z.enum(["concierge", "recruiter", "project", "resume", "fit", "contact"]),
  message: z.string().min(1).max(LIMITS.jobDescription),
  project: z.string().regex(/^[a-z0-9-]{1,60}$/).optional(),
  role: z.string().regex(/^[a-z0-9-]{1,40}$/).optional(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(4000) }))
    .max(12)
    .optional(),
});
export type AiRequest = z.infer<typeof RequestSchema>;

const InternalHref = z.string().regex(/^\/[a-z0-9\-/#?=&]*$/i).max(120);

export const ActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("navigate"), label: z.string().max(60), href: InternalHref }),
  z.object({ type: z.literal("resume"), label: z.string().max(60), slug: z.string().max(60) }),
  z.object({ type: z.literal("mode"), label: z.string().max(60), mode: z.enum(["concierge", "recruiter", "project", "resume", "fit", "contact"]) }),
  /** Never executed automatically. The client shows a preview and waits for explicit approval. */
  z.object({
    type: z.literal("contact_prefill"),
    label: z.string().max(60),
    fields: z.object({ inquiry: z.string().max(60), message: z.string().max(1500) }),
  }),
]);
export type AiAction = z.infer<typeof ActionSchema>;

export const ResponseSchema = z.object({
  mode: z.enum(["concierge", "recruiter", "project", "resume", "fit", "contact"]),
  status: z.enum(["answered", "no-evidence", "declined", "blocked", "rate-limited", "unavailable"]),
  answer: z.string().max(2400),
  interpretation: z.string().max(1200).nullable(),
  blocks: z
    .array(
      z.object({
        title: z.string().max(80),
        items: z.array(z.object({ text: z.string().max(400), href: InternalHref.optional() })).max(12),
      }),
    )
    .max(8),
  sources: z.array(z.object({ label: z.string().max(80), href: InternalHref, evidence: z.string().max(40) })).max(8),
  actions: z.array(ActionSchema).max(5),
  followups: z.array(z.string().max(120)).max(4),
  engine: z.enum(["model", "retrieval", "rules"]),
});
export type AiResponse = z.infer<typeof ResponseSchema>;

export type StreamEvent = { type: "stage"; label: string } | { type: "final"; payload: AiResponse };

export const STAGES = [
  "Searching approved portfolio sources",
  "Reviewing relevant evidence",
  "Preparing a grounded answer",
] as const;

export const NO_EVIDENCE = "I do not have verified portfolio evidence for that yet.";
export const AI_LABEL = "AI-generated answer based on Riyad’s approved public portfolio content.";
