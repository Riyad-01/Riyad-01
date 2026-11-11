import { logEvent } from "@/lib/ai/guard";
import { checkLimits } from "@/lib/ai/ratelimit";
import { readJson, sameOrigin, visitorOf } from "@/lib/http";
import { ContactSchema, getEmailService } from "@/lib/services/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const reply = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return reply({ ok: false, error: "forbidden" }, 403);
  const visitor = visitorOf(req);
  const limit = await checkLimits(visitor, "contact");
  if (!limit.ok) return reply({ ok: false, error: "rate-limited" }, 429);

  const parsed = ContactSchema.safeParse(await readJson(req, 20_000));
  if (!parsed.success) {
    logEvent("contact.invalid", { visitor });
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message;
    // A filled honeypot is treated as success so bots learn nothing.
    if (fields.website) {
      logEvent("contact.spam", { visitor });
      return reply({ ok: true, delivery: "sent" });
    }
    return reply({ ok: false, error: "invalid", fields }, 400);
  }
  if (parsed.data.elapsedMs < 2500) {
    logEvent("contact.spam", { visitor });
    return reply({ ok: true, delivery: "sent" });
  }

  const email = getEmailService();
  // No delivery service configured: tell the client to fall back to the visitor's own email app.
  if (!email) return reply({ ok: true, delivery: "mailto" });

  try {
    const sent = await email.send(parsed.data);
    if (!sent) return reply({ ok: false, error: "delivery" }, 502);
    // Only the inquiry type is logged — never the message or the sender's details.
    logEvent("contact.submitted", { visitor, inquiry: parsed.data.inquiry });
    return reply({ ok: true, delivery: "sent" });
  } catch {
    return reply({ ok: false, error: "delivery" }, 502);
  }
}
