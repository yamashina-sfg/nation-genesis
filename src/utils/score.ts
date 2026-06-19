import type { NationStats } from "../types/game";

/**
 * 歴史的評価スコア（プレイの"北極星"）。
 * 高支持・豊かさ・技術・外交・長い在任を加点、赤字を減点。
 */
export function legacyScore(stats: NationStats, years: number): number {
  return Math.max(
    0,
    Math.round(
      stats.approval * 2 +
        stats.happiness * 2 +
        stats.gdp / 4 +
        stats.trust * 1.2 +
        stats.technology * 1.2 +
        stats.military * 0.6 +
        years * 4 -
        Math.max(0, -stats.budget) * 1.5,
    ),
  );
}

export type Rank = "S" | "A" | "B" | "C" | "D";

export function rankFor(score: number): Rank {
  if (score >= 1100) return "S";
  if (score >= 850) return "A";
  if (score >= 600) return "B";
  if (score >= 350) return "C";
  return "D";
}

export const rankTitle: Record<Rank, string> = {
  S: "歴史に名を刻む名指導者",
  A: "偉大な指導者",
  B: "堅実な指導者",
  C: "平凡な指導者",
  D: "苦難の指導者",
};
