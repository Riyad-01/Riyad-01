import { z } from "zod";

export const INQUIRY_TYPES = [
  "International remote opportunity",
  "Product role",
  "Learning technology role",
  "UX or product design role",
  "AI and automation collaboration",
  "Consulting project",
  "Professional conversation",
] as const;

export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  organization: z.string().trim().max(120).optional().default(""),
  inquiry: z.enum(INQUIRY_TYPES, { error: "Please choose an inquiry type." }),
  link: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v), "Please enter a full link starting with https://")
    .optional()
    .default(""),
  message: z.string().trim().min(20, "Please write at least a couple of sentences.").max(4000),
  consent: z.literal(true, { error: "Please confirm you agree to be contacted about this message." }),
  /** Spam protection: honeypot must stay empty; form must be open for a few seconds. */
  website: z.string().max(0).optional().default(""),
  elapsedMs: z.number().min(0).max(86_400_000),
});
export type ContactInput = z.infer<typeof ContactSchema>;

export interface EmailService {
  name: string;
  send(input: ContactInput): Promise<boolean>;
}

/** Resend over plain HTTPS — no SDK dependency, easy to replace. */
function resend(): EmailService | null {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return null;
  return {
    name: "resend",
    async send(input) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: input.email,
          subject: `Portfolio inquiry: ${input.inquiry} — ${input.name}`,
          text: `Name: ${input.name}\nEmail: ${input.email}\nOrganization: ${input.organization || "—"}\nInquiry: ${input.inquiry}\nLink: ${input.link || "—"}\n\n${input.message}`,
        }),
      });
      return res.ok;
    },
  };
}

export function getEmailService(): EmailService | null {
  return resend();
}

export const contactDeliveryConfigured = () => getEmailService() !== null;
