/**
 * Analytics event map. Privacy-conscious by construction: the type system
 * only allows the properties listed here, and none of them can carry AI
 * conversation text, job descriptions, contact messages or personal data.
 *
 * Nothing is sent unless the visitor has switched analytics on in the
 * privacy settings panel AND a provider is configured.
 */

export type AnalyticsEvents = {
  project_viewed: { slug: string };
  case_study_completed: { slug: string };
  resume_downloaded: { variant: string };
  resume_variant_selected: { variant: string };
  ai_opened: { entry: "nav" | "palette" | "case-study" | "resume" | "contact" | "hero" | "page" };
  ai_question: { category: "concierge" | "recruiter" | "project" | "resume" | "fit" | "contact" };
  source_opened: { href: string };
  recruiter_mode_activated: { role: string };
  job_description_compared: Record<string, never>;
  contact_started: Record<string, never>;
  contact_submitted: { inquiry: string };
  linkedin_opened: Record<string, never>;
  role_perspective_changed: { perspective: string };
  project_filter_used: { filter: string };
  command_palette_used: { action: string };
  theme_changed: { theme: string };
  motion_reduced: { reduced: boolean };
};

export interface AnalyticsProvider {
  name: string;
  track(event: string, props: Record<string, string | boolean>): void;
}

const plausible: AnalyticsProvider = {
  name: "plausible",
  track(event, props) {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain) return;
    navigator.sendBeacon?.(
      "https://plausible.io/api/event",
      new Blob([JSON.stringify({ name: event, url: location.origin + location.pathname, domain, props })], { type: "text/plain" }),
    );
  },
};

function provider(): AnalyticsProvider | null {
  return process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === "plausible" ? plausible : null;
}

export function analyticsConsent(): boolean {
  try {
    return localStorage.getItem("ra.consent.analytics") === "1";
  } catch {
    return false;
  }
}

export function track<K extends keyof AnalyticsEvents>(event: K, props: AnalyticsEvents[K]) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
  if (!analyticsConsent() || navigator.doNotTrack === "1") return;
  provider()?.track(event, props as Record<string, string | boolean>);
}
