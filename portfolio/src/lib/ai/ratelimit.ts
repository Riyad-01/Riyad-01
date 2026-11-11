/**
 * Rate, cost and abuse controls.
 *
 * In-memory by default, which is correct for a single server process and a
 * sensible floor on serverless (each instance enforces its own limits). For
 * strict global limits in production, implement LimitStore against Redis or
 * a similar shared store and return it from getStore().
 */

export interface LimitStore {
  hit(key: string, windowMs: number): Promise<number>;
}

class MemoryStore implements LimitStore {
  private buckets = new Map<string, number[]>();
  async hit(key: string, windowMs: number) {
    const now = Date.now();
    const list = (this.buckets.get(key) ?? []).filter((t) => now - t < windowMs);
    list.push(now);
    this.buckets.set(key, list);
    if (this.buckets.size > 5000) {
      for (const [k, v] of this.buckets) if (v.every((t) => now - t > 86_400_000)) this.buckets.delete(k);
    }
    return list.length;
  }
}

const store: LimitStore = new MemoryStore();
export const getStore = () => store;

const num = (v: string | undefined, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : d;
};

export async function checkLimits(visitor: string, scope: "ai" | "contact"): Promise<{ ok: true } | { ok: false; reason: "minute" | "day" | "budget" }> {
  const perMinute = scope === "ai" ? num(process.env.AI_RATE_LIMIT_PER_MINUTE, 8) : 3;
  const perDay = scope === "ai" ? num(process.env.AI_RATE_LIMIT_PER_DAY, 60) : 10;
  if ((await store.hit(`${scope}:m:${visitor}`, 60_000)) > perMinute) return { ok: false, reason: "minute" };
  if ((await store.hit(`${scope}:d:${visitor}`, 86_400_000)) > perDay) return { ok: false, reason: "day" };
  return { ok: true };
}

/** Global daily budget for model calls: a hard ceiling on spend. */
export async function withinModelBudget(): Promise<boolean> {
  const budget = num(process.env.AI_DAILY_BUDGET_REQUESTS, 1500);
  const used = await store.hit("ai:budget", 86_400_000);
  if (used === Math.floor(budget * 0.8)) console.warn(JSON.stringify({ event: "ai.budget_alert", used, budget }));
  return used <= budget;
}

/** Circuit breaker: after repeated model failures, stop calling the model for a while. */
const breaker = { failures: 0, openUntil: 0 };
export const circuit = {
  isOpen: () => Date.now() < breaker.openUntil,
  success: () => {
    breaker.failures = 0;
  },
  failure: () => {
    breaker.failures += 1;
    if (breaker.failures >= 3) {
      breaker.openUntil = Date.now() + 5 * 60_000;
      breaker.failures = 0;
    }
  },
};
