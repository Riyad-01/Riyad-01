"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { AnalyticsEvents } from "@/lib/analytics";
import type { Perspective } from "@/content/types";
import type { AgentMode } from "@/lib/ai/types";

/**
 * Global interface state: theme, motion, role perspective, consent, and the
 * three overlays (Riyad AI, command palette, preferences). The heavy overlays
 * are loaded on demand so they cost nothing until someone opens them.
 */

const AIDrawer = dynamic(() => import("./ai/AIDrawer"), { ssr: false });
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });
const Preferences = dynamic(() => import("./Preferences"), { ssr: false });

export type Theme = "system" | "light" | "dark";
export interface AIEntry {
  mode?: AgentMode;
  project?: string;
  prompt?: string;
  entry: AnalyticsEvents["ai_opened"]["entry"];
}

interface UIState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  perspective: Perspective | null;
  setPerspective: (p: Perspective | null) => void;
  remember: boolean;
  setRemember: (v: boolean) => void;
  analytics: boolean;
  setAnalytics: (v: boolean) => void;
  openAI: (e: AIEntry) => void;
  openPalette: () => void;
  openPreferences: () => void;
  toast: (message: string) => void;
}

const Ctx = createContext<UIState | null>(null);
export const useUI = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI must be used inside <UIProvider>");
  return v;
};

const store = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string | null) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      /* storage unavailable: the site still works, it just does not remember */
    }
  },
};

const isPerspective = (v: string | null): v is Perspective => v === "product" || v === "learning" || v === "creative";

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [reducedMotion, setReducedState] = useState(false);
  const [perspective, setPerspectiveState] = useState<Perspective | null>(null);
  const [remember, setRememberState] = useState(false);
  const [analytics, setAnalyticsState] = useState(false);
  const [ai, setAi] = useState<(AIEntry & { key: number }) | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from storage and URL once.
  useEffect(() => {
    const t = store.get("ra.theme");
    if (t === "light" || t === "dark") setThemeState(t);
    setReducedState(store.get("ra.motion") === "reduced" || (store.get("ra.motion") === null && matchMedia("(prefers-reduced-motion: reduce)").matches));
    const rememberOn = store.get("ra.consent.prefs") === "1";
    setRememberState(rememberOn);
    setAnalyticsState(store.get("ra.consent.analytics") === "1");
    const fromUrl = new URLSearchParams(location.search).get("view");
    const saved = rememberOn ? store.get("ra.view") : null;
    if (isPerspective(fromUrl)) setPerspectiveState(fromUrl);
    else if (isPerspective(saved)) setPerspectiveState(saved);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    // An explicit display choice is a strictly functional setting the visitor asked for.
    store.set("ra.theme", t === "system" ? null : t);
    const resolved = t === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : t;
    document.documentElement.dataset.theme = resolved;
    track("theme_changed", { theme: t });
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => (document.documentElement.dataset.theme = mq.matches ? "dark" : "light");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  const setReducedMotion = useCallback((v: boolean) => {
    setReducedState(v);
    store.set("ra.motion", v ? "reduced" : "full");
    document.documentElement.dataset.motion = v ? "reduced" : "full";
    track("motion_reduced", { reduced: v });
  }, []);

  const setPerspective = useCallback((p: Perspective | null) => {
    setPerspectiveState(p);
    // Bookmarkable: the view lives in the URL. It is only saved locally with consent.
    const url = new URL(location.href);
    if (p) url.searchParams.set("view", p);
    else url.searchParams.delete("view");
    history.replaceState(null, "", url);
    if (store.get("ra.consent.prefs") === "1") store.set("ra.view", p);
    if (p) track("role_perspective_changed", { perspective: p });
  }, []);

  const setRemember = useCallback((v: boolean) => {
    setRememberState(v);
    store.set("ra.consent.prefs", v ? "1" : null);
    if (!v) store.set("ra.view", null);
  }, []);

  const setAnalytics = useCallback((v: boolean) => {
    setAnalyticsState(v);
    store.set("ra.consent.analytics", v ? "1" : null);
  }, []);

  const toast = useCallback((m: string) => {
    setMessage(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 3600);
  }, []);

  const openAI = useCallback((e: AIEntry) => {
    setPalette(false);
    setAi({ ...e, key: Date.now() });
    setAiOpen(true);
    track("ai_opened", { entry: e.entry });
  }, []);

  const openPalette = useCallback(() => setPalette(true), []);
  const openPreferences = useCallback(() => {
    setPalette(false);
    setPrefs(true);
  }, []);

  // Command/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<UIState>(
    () => ({ theme, setTheme, reducedMotion, setReducedMotion, perspective, setPerspective, remember, setRemember, analytics, setAnalytics, openAI, openPalette, openPreferences, toast }),
    [theme, setTheme, reducedMotion, setReducedMotion, perspective, setPerspective, remember, setRemember, analytics, setAnalytics, openAI, openPalette, openPreferences, toast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {ai && <AIDrawer open={aiOpen} onClose={() => setAiOpen(false)} entry={ai} key={ai.key} />}
      {palette && <CommandPalette onClose={() => setPalette(false)} />}
      {prefs && <Preferences onClose={() => setPrefs(false)} />}
      <div aria-live="polite" role="status">
        {message && <div className="toast">{message}</div>}
      </div>
    </Ctx.Provider>
  );
}

/** Button that opens Riyad AI from anywhere, including server-rendered pages. */
export function AskAI({ children, className = "btn btn--ghost", ...entry }: AIEntry & { children: ReactNode; className?: string }) {
  const { openAI } = useUI();
  return (
    <button type="button" className={className} onClick={() => openAI(entry)}>
      {children}
    </button>
  );
}

export function PreferencesButton({ children, className = "link" }: { children: ReactNode; className?: string }) {
  const { openPreferences } = useUI();
  return (
    <button type="button" className={className} onClick={openPreferences}>
      {children}
    </button>
  );
}

/** Small client wrapper so server components can record a view without becoming client components. */
export function Track<K extends keyof AnalyticsEvents>({ event, props }: { event: K; props: AnalyticsEvents[K] }) {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/**
 * Reveals [data-reveal] elements as they enter the viewport.
 * Uses the Web Animations API rather than changing attributes, so the
 * server-rendered HTML is never altered underneath React.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reduced = document.documentElement.dataset.motion === "reduced";
    const show = (el: HTMLElement, animate: boolean) => {
      const i = Number(getComputedStyle(el).getPropertyValue("--i")) || 0;
      el.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], {
        duration: animate ? 700 : 0,
        delay: animate ? i * 70 : 0,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      });
    };
    if (!("IntersectionObserver" in window) || reduced) {
      els.forEach((el) => show(el, false));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target as HTMLElement, true);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
