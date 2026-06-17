import type { NationStats, StatKey } from "../types/game";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const round1 = (value: number) => Math.round(value * 10) / 10;

export function applyEffect(
  stats: NationStats,
  effect: Partial<NationStats>,
): NationStats {
  const next = { ...stats };
  for (const key of Object.keys(effect) as StatKey[]) {
    next[key] = round1(next[key] + (effect[key] ?? 0));
  }
  next.approval = clamp(next.approval, 0, 100);
  next.happiness = clamp(next.happiness, 0, 100);
  next.gdp = clamp(next.gdp, 120, 1200);
  next.budget = clamp(next.budget, -80, 260);
  next.unemployment = clamp(next.unemployment, 1, 22);
  next.inflation = clamp(next.inflation, -2, 16);
  next.trust = clamp(next.trust, 0, 100);
  next.military = clamp(next.military, 0, 100);
  next.technology = clamp(next.technology, 0, 100);
  next.environment = clamp(next.environment, 0, 100);
  return next;
}

export function formatStat(key: StatKey, value: number) {
  if (key === "gdp") return `${value.toFixed(0)}B`;
  if (key === "budget") return `${value.toFixed(0)}B`;
  if (key === "unemployment" || key === "inflation") {
    return `${value.toFixed(1)}%`;
  }
  return `${value.toFixed(0)}`;
}

export function createFlag(primary: string, accent: string) {
  return `linear-gradient(135deg, ${primary} 0 34%, #f4f1e8 34% 42%, ${accent} 42% 100%)`;
}
