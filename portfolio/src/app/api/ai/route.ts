import { runAgent } from "@/lib/ai/engine";
import { logEvent } from "@/lib/ai/guard";
import { checkLimits } from "@/lib/ai/ratelimit";
import { RequestSchema } from "@/lib/ai/types";
import type { AiResponse, StreamEvent } from "@/lib/ai/types";
import { readJson, sameOrigin, visitorOf } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const simple = (mode: AiResponse["mode"], status: AiResponse["status"], answer: string): AiResponse => ({
  mode,
  status,
  answer,
  interpretation: null,
  blocks: [],
  sources: [],
  actions: [{ type: "navigate", label: "Browse selected work", href: "/work" }, { type: "navigate", label: "Contact Riyad", href: "/contact" }],
  followups: [],
  engine: "rules",
});

const json = (body: AiResponse, status: number) =>
  new Response(JSON.stringify({ type: "final", payload: body } satisfies StreamEvent) + "\n", {
    status,
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function POST(req: Request) {
  if (process.env.AI_ENABLED === "off") return json(simple("concierge", "unavailable", "Riyad AI is switched off at the moment. Every page of the portfolio works without it."), 503);
  if (!sameOrigin(req)) return json(simple("concierge", "blocked", "This endpoint only accepts requests from the portfolio itself."), 403);

  const visitor = visitorOf(req);
  const body = await readJson(req, 40_000);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    logEvent("ai.invalid_request", { visitor });
    return json(simple("concierge", "blocked", "That request could not be read. Please shorten your message and try again."), 400);
  }

  const limit = await checkLimits(visitor, "ai");
  if (!limit.ok) {
    logEvent("ai.rate_limited", { visitor, reason: limit.reason });
    return json(
      simple(parsed.data.mode, "rate-limited", limit.reason === "minute" ? "You are asking quickly — please wait a minute and try again." : "You have reached today's question limit for Riyad AI. The full portfolio remains available, and you can contact Riyad directly."),
      429,
    );
  }

  // Message text is never logged: only mode and size.
  logEvent("ai.request", { visitor, mode: parsed.data.mode, length: parsed.data.message.length });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      try {
        const payload = await runAgent(parsed.data, (label) => send({ type: "stage", label }));
        send({ type: "final", payload });
      } catch {
        // Never expose raw errors, prompts or stack traces.
        logEvent("ai.model_error", { visitor, mode: parsed.data.mode });
        send({ type: "final", payload: simple(parsed.data.mode, "unavailable", "Riyad AI could not answer just now. Nothing is wrong with the portfolio itself — you can keep browsing, or try again shortly.") });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } });
}
