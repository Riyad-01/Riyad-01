/**
 * Input and output guards. These run in application code, before and after
 * the model. The model is treated as an untrusted reasoning component: it is
 * never asked to police itself, and the system prompt is not relied on as a
 * security boundary.
 */

// Zero-width, bidi-control, tag and other invisible characters used to hide instructions.
const INVISIBLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F­͏؜ᅟᅠ឴឵᠋-᠎​-‏‪-‮⁠-⁯ㅤ︀-️﻿ﾠ￹-￻]|\uDB40[\uDC00-\uDC7F]/g;

export function sanitize(input: string, max: number): { text: string; removedInvisible: number } {
  const normalized = input.normalize("NFKC");
  const stripped = normalized.replace(INVISIBLE, "");
  const text = stripped
    .replace(/<[^>]{0,200}>/g, " ") // markup is never needed and never trusted
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
  return { text, removedInvisible: normalized.length - stripped.length };
}

const INJECTION: RegExp[] = [
  /\b(ignore|disregard|forget|override|bypass)\b[^.\n]{0,40}\b(previous|prior|above|earlier|all|your|system|these)\b[^.\n]{0,30}\b(instruction|prompt|rule|guideline|context|message)s?/i,
  /\b(reveal|show|print|repeat|output|display|leak|share|tell me|what (is|are)|give me)\b[^.\n]{0,40}\b(system|hidden|initial|developer|secret|internal)\b[^.\n]{0,20}\b(prompt|instruction|message|rule|configuration|config)s?/i,
  /\b(system prompt|developer message|hidden instructions?|initial instructions?)\b/i,
  /\byou are now\b|\bact as (?!a recruiter|an? hiring)|\bpretend (to be|you are)\b|\broleplay as\b|\bfrom now on\b[^.\n]{0,30}\byou\b/i,
  /\b(jailbreak|dan mode|developer mode|do anything now|unfiltered mode)\b/i,
  /\b(new|updated|revised)\s+(system\s+)?(instruction|rule|prompt)s?\s*:/i,
  /^\s*(system|assistant|developer)\s*:/im,
  /\[\/?(INST|SYSTEM)\]|<\|[a-z_]+\|>|###\s*(system|instruction)/i,
  /\b(api[_ -]?key|access token|password|credentials?|env(ironment)? variables?|\.env)\b/i,
  /\b(private|confidential|internal|unpublished|hidden|do[- ]not[- ]publish)\b[^.\n]{0,30}\b(data|document|file|email|record|note|information|content)s?\b/i,
];

export function detectInjection(text: string): boolean {
  return INJECTION.some((re) => re.test(text));
}

export type Restricted = "protected" | "salary" | "commitment" | "impersonation" | null;

const RESTRICTED: [Exclude<Restricted, null>, RegExp][] = [
  [
    "protected",
    /\b(his|riyad'?s?|he)\b[^.\n]{0,40}\b(age|religion|religious|ethnicity|race|caste|marital|married|wife|children|kids|pregnan|disabilit|health|sexual|political|nationality|gender|date of birth)\b|\bhow old\b|\b(is|was) (he|riyad) (a )?(muslim|hindu|christian|married|single|gay|disabled)\b/i,
  ],
  ["salary", /\b(salary|compensation|pay rate|day rate|hourly rate|rate card|ctc|remuneration|wage)\b|\bhow much\b[^.\n]{0,30}\b(charge|cost|paid|pay|expect)\b/i],
  [
    "commitment",
    /\b(accept|confirm|agree to|commit to|sign)\b[^.\n]{0,30}\b(offer|job|role|contract|terms|start date|deal|nda)\b|\b(schedule|book|arrange|set up)\b[^.\n]{0,25}\b(meeting|call|interview)\b[^.\n]{0,25}\b(for me|now|automatically)\b|\bsend (him|riyad) (an |the )?(email|message)\b/i,
  ],
  ["impersonation", /\b(speak|answer|reply|respond|write)\b[^.\n]{0,20}\b(as|like)\b[^.\n]{0,10}\b(riyad|him)\b|\bare you riyad\b/i],
];

export function detectRestricted(text: string): Restricted {
  for (const [kind, re] of RESTRICTED) if (re.test(text)) return kind;
  return null;
}

export const RESTRICTED_REPLY: Record<Exclude<Restricted, null>, string> = {
  protected:
    "I can only discuss Riyad's professional work and published portfolio evidence. I do not hold or assess personal characteristics, and they are not part of this portfolio.",
  salary:
    "I cannot discuss or negotiate compensation on Riyad's behalf. That is a conversation to have with Riyad directly — I can help you prepare a message.",
  commitment:
    "I cannot make commitments, accept offers, schedule meetings or send messages on Riyad's behalf. I can help you prepare a message, which you then review and send yourself.",
  impersonation:
    "I am Riyad AI, a guide to Riyad's published portfolio — not Riyad himself. I can tell you what the portfolio evidence says, and help you contact him directly.",
};

/** Strip anything from model output that should never reach a visitor. */
export function scrubOutput(text: string, allowedHosts: string[] = []): string {
  return text
    .replace(INVISIBLE, "")
    .replace(/<[^>]{0,200}>/g, "")
    .replace(/https?:\/\/[^\s)]+/gi, (url) => {
      try {
        return allowedHosts.includes(new URL(url).hostname) ? url : "";
      } catch {
        return "";
      }
    })
    .replace(/\b(sk|pk|rk)-[A-Za-z0-9_-]{16,}\b/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Redact personal data before anything is written to a log. */
export function redact(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[number]")
    .replace(/https?:\/\/\S+/gi, "[url]");
}

export type SecurityEvent =
  | "ai.request"
  | "ai.blocked.injection"
  | "ai.blocked.invisible"
  | "ai.declined.restricted"
  | "ai.rate_limited"
  | "ai.budget_exhausted"
  | "ai.no_evidence"
  | "ai.model_error"
  | "ai.invalid_request"
  | "ai.citation_rejected"
  | "contact.submitted"
  | "contact.spam"
  | "contact.invalid";

/**
 * Privacy-conscious security log: event name, hashed visitor, mode and sizes.
 * Message text, job descriptions and contact messages are never logged.
 */
export function logEvent(event: SecurityEvent, data: Record<string, string | number | boolean | undefined> = {}) {
  const line = { t: new Date().toISOString(), event, ...data };
  if (event.includes("blocked") || event.includes("error") || event.includes("spam")) console.warn(JSON.stringify(line));
  else console.info(JSON.stringify(line));
}
