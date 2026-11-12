import { createHash } from "node:crypto";

/** Daily-rotating, salted hash so a visitor can be rate-limited without storing their IP. */
export function visitorKey(ip: string): string {
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.AI_LOG_SALT ?? "riyad-portfolio";
  return createHash("sha256").update(`${salt}:${day}:${ip}`).digest("hex").slice(0, 16);
}

/** Same-origin check for state-changing or costly endpoints. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export function visitorOf(req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return visitorKey(ip);
}

/** Read a JSON body with a hard size cap. Returns null when invalid or too large. */
export async function readJson(req: Request, maxBytes: number): Promise<unknown | null> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return null;
  const text = await req.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
