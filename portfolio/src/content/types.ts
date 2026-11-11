/**
 * Content model. Every page, the search index and the AI knowledge base
 * are built from these types — content is written once and never duplicated.
 */

export type Perspective = "product" | "learning" | "creative";

export type EvidenceStatus =
  | "verified"
  | "approximate"
  | "personal-project"
  | "professional-work"
  | "sanitized"
  | "awaiting-confirmation"
  | "do-not-publish";

/** Statuses the public AI is allowed to retrieve. Everything else is invisible to it. */
export const PUBLIC_EVIDENCE: EvidenceStatus[] = [
  "verified",
  "approximate",
  "personal-project",
  "professional-work",
  "sanitized",
];

export const EVIDENCE_LABEL: Record<EvidenceStatus, string> = {
  verified: "Verified",
  approximate: "Approximate scope",
  "personal-project": "Personal project",
  "professional-work": "Professional work",
  sanitized: "Sanitized",
  "awaiting-confirmation": "Draft — verify before publishing",
  "do-not-publish": "Do not publish",
};

export type StatusKey =
  | "active"
  | "testing"
  | "prototype"
  | "concept"
  | "exploring"
  | "paused"
  | "completed";

export const STATUS_LABEL: Record<StatusKey, string> = {
  active: "Active",
  testing: "Testing",
  prototype: "Prototype",
  concept: "Concept",
  exploring: "Exploring",
  paused: "Paused",
  completed: "Completed",
};

export type WorkKind = "Professional work" | "Personal product";

export interface Metric {
  id: string;
  value: string;
  label: string;
  detail: string;
  evidence: EvidenceStatus;
  source: { label: string; href: string };
}

export const SECTION_ORDER = [
  "context",
  "problem",
  "whyItMattered",
  "users",
  "constraints",
  "role",
  "collaborators",
  "research",
  "strategy",
  "ia",
  "architecture",
  "visualDesign",
  "implementation",
  "testing",
  "iteration",
  "challenges",
  "tradeoffs",
  "outcome",
  "evidence",
  "limitations",
  "lessons",
  "currentStatus",
  "nextSteps",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

export const SECTION_TITLE: Record<SectionKey, string> = {
  context: "Context",
  problem: "Problem",
  whyItMattered: "Why it mattered",
  users: "Users and audience",
  constraints: "Constraints",
  role: "My role",
  collaborators: "Collaborators",
  research: "Research",
  strategy: "Strategy",
  ia: "Information architecture",
  architecture: "Workflow and system architecture",
  visualDesign: "Visual design",
  implementation: "Prototype and implementation",
  testing: "Testing",
  iteration: "Iteration",
  challenges: "Challenges",
  tradeoffs: "Tradeoffs",
  outcome: "Outcome",
  evidence: "Verified evidence",
  limitations: "Limitations",
  lessons: "Lessons learned",
  currentStatus: "Current status",
  nextSteps: "Next steps",
};

export interface Section {
  body?: string[];
  list?: string[];
  /** Explicit, visible gaps. Rendered as placeholder chips, never hidden. */
  placeholders?: string[];
  evidence: EvidenceStatus;
  /** Optional expandable process note. */
  note?: { title: string; body: string };
}

export interface Diagram {
  title: string;
  caption: string;
  steps: { label: string; detail: string }[];
  conceptual?: boolean;
}

export interface CaseStudy {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  classification: string[];
  kind: WorkKind;
  status: StatusKey;
  statusLabel: string;
  timeline: string;
  accent: "product" | "learning" | "creative" | "ai";
  perspectives: Perspective[];
  disciplines: string[];
  proof: string[];
  roles: string[];
  sections: Record<SectionKey, Section>;
  diagram: Diagram;
  related: string[];
  lastReviewed: string;
}

export interface LabItem {
  slug: string;
  name: string;
  status: StatusKey;
  statusLabel: string;
  oneLine: string;
  problem: string;
  hypothesis: string;
  built: string;
  learned: string;
  decision: string;
  capability: string;
  evidence: EvidenceStatus;
  caseStudy?: string;
  link?: { label: string; href: string };
}

export interface ExperienceEntry {
  id: string;
  chapter: string;
  title: string;
  organization: string;
  period: string;
  kind: WorkKind;
  summary: string;
  responsibilities: string[];
  evidence: string[];
  related: string[];
  status: EvidenceStatus;
}

export interface ResumeVariant {
  slug: string;
  name: string;
  short: string;
  forRoles: string[];
  headline: string;
  summary: string;
  reasons: string[];
  highlights: string[];
  leadCaseStudies: string[];
  skills: string[];
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sources: { label: string; href: string }[];
  evidence: EvidenceStatus;
  keywords?: string[];
}
