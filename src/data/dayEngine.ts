import type { EventScope, GameEvent } from "../types/game";
import { dailyDeck } from "./dailyDeck";
import { eraEvents } from "./eraEvents";
import { isUnlocked } from "./eras";

/** 速報イベントの母集団（汎用＋時代別） */
const allDailyEvents: GameEvent[] = [...dailyDeck, ...eraEvents];

/**
 * 1日ごとの進行ロジック（純粋関数）。
 * 「今日は何が起きるだろう」を生むため、毎日いずれかが確率で起きる。
 */

/** 1日ごとの抽選バケツと重み（合計で平穏な日も含む） */
const SCOPE_WEIGHTS: { scope: EventScope | "peaceful"; weight: number }[] = [
  { scope: "peaceful", weight: 30 }, // 何も起きない平穏な日
  { scope: "domestic", weight: 14 },
  { scope: "citizen", weight: 11 },
  { scope: "world", weight: 12 },
  { scope: "market", weight: 12 },
  { scope: "positive", weight: 11 },
  { scope: "diplo", weight: 6 },
  { scope: "crisis", weight: 7 },
];

function pickScope(): EventScope | "peaceful" {
  const total = SCOPE_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of SCOPE_WEIGHTS) {
    r -= w.weight;
    if (r < 0) return w.scope;
  }
  return "peaceful";
}

/**
 * その年の速報イベントを引く。null は平穏な年。
 * その時代に「解放されている」イベントだけが対象（since/until で制限）。
 * crisis は序盤（最初の数ターン）には出さない（いきなり詰まないように）。
 */
export function pickDailyEvent(year: number, turnCount: number): GameEvent | null {
  let scope = pickScope();
  if (scope === "peaceful") return null;
  if (scope === "crisis" && turnCount < 4) scope = "world";
  const pool = allDailyEvents.filter(
    (e) => e.scope === scope && isUnlocked(year, e.since, e.until),
  );
  if (pool.length === 0) {
    // その時代にそのバケツが無ければ、時代に合う何かにフォールバック
    const any = allDailyEvents.filter((e) => isUnlocked(year, e.since, e.until));
    return any.length ? any[Math.floor(Math.random() * any.length)] : null;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ===================== 外交の成功/失敗 ===================== */

export type DiploTier = "大成功" | "成功" | "普通" | "失敗" | "大失敗";

export type DiploContext = {
  /** 相手国との友好度 0..100 */
  relation: number;
  /** 外交信用 0..100 */
  trust: number;
  /** 外務大臣の能力 0..1 程度 */
  foreignSkill: number;
  /** 直近の世界情勢（緊張）0..100。高いほど難しい */
  worldTension: number;
  /** 相手国の性格による補正 -0.1..+0.1 */
  countryMod: number;
};

/** 成功率（0..1）を算出 */
export function diplomacyChance(ctx: DiploContext): number {
  const chance =
    0.3 +
    (ctx.relation - 50) / 160 + // 友好度
    (ctx.trust - 50) / 240 + // 外交信用
    ctx.foreignSkill + // 外務大臣の能力
    ctx.countryMod - // 相手国の性格
    ctx.worldTension / 300; // 世界情勢
  return Math.min(0.95, Math.max(0.05, chance));
}

/** 成功率と乱数から結果ランクを決める */
export function rollDiplomacy(chance: number): DiploTier {
  const margin = chance - Math.random();
  if (margin >= 0.3) return "大成功";
  if (margin >= 0.08) return "成功";
  if (margin >= -0.1) return "普通";
  if (margin >= -0.3) return "失敗";
  return "大失敗";
}

/** 相手国IDから決まる「性格」補正（気難しい国・話の通じる国） */
export function countryPersonalityMod(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return (h / 1000 - 0.5) * 0.2; // -0.1..+0.1
}
