import type { NationStats } from "../types/game";

export type AchvContext = {
  stats: NationStats;
  turns: number; // 在任日数
  policies: number; // 実行した政策数
  diplomacy: number; // 外交回数
  alliances: number; // 同盟数
};

export type Achievement = {
  id: string;
  /** 解除で得られる称号 */
  title: string;
  icon: string;
  desc: string;
  check: (c: AchvContext) => boolean;
};

/**
 * 実績（解除すると称号がつく）。
 * 「遊んでいたら次の目標が見える」ための軽いゲーム性。
 */
export const achievements: Achievement[] = [
  { id: "first_policy", title: "改革の第一歩", icon: "📜", desc: "はじめて政策を実行した", check: (c) => c.policies >= 1 },
  { id: "five_policies", title: "改革の旗手", icon: "🏛️", desc: "政策を5回実行した", check: (c) => c.policies >= 5 },
  { id: "first_diplo", title: "外交デビュー", icon: "🤝", desc: "はじめて外交を行った", check: (c) => c.diplomacy >= 1 },
  { id: "alliance", title: "同盟の盟主", icon: "⚔️", desc: "他国と同盟を結んだ", check: (c) => c.alliances >= 1 },
  { id: "approval70", title: "国民の英雄", icon: "👑", desc: "支持率が70を超えた", check: (c) => c.stats.approval >= 70 },
  { id: "happy80", title: "幸福の国", icon: "😊", desc: "暮らしの満足度が80を超えた", check: (c) => c.stats.happiness >= 80 },
  { id: "rich", title: "経済再生請負人", icon: "💰", desc: "国の豊かさ(GDP)が800を超えた", check: (c) => c.stats.gdp >= 800 },
  { id: "tech90", title: "技術立国の父", icon: "🔬", desc: "技術力が90を超えた", check: (c) => c.stats.technology >= 90 },
  { id: "trust80", title: "世界の信頼", icon: "🌐", desc: "外交信用が80を超えた", check: (c) => c.stats.trust >= 80 },
  { id: "surplus", title: "黒字の魔術師", icon: "🏦", desc: "国の財布(予算)が200を超えた", check: (c) => c.stats.budget >= 200 },
  { id: "survive10", title: "一国の指導者", icon: "📅", desc: "在任10年を達成した", check: (c) => c.turns >= 10 },
  { id: "survive40", title: "時代を見届けた指導者", icon: "🎖️", desc: "在任40年を達成した", check: (c) => c.turns >= 40 },
];

/** 現在のステータスから新たに解除された実績を返す */
export function newlyUnlocked(ctx: AchvContext, unlocked: string[]): Achievement[] {
  const set = new Set(unlocked);
  return achievements.filter((a) => !set.has(a.id) && a.check(ctx));
}

/** 解除済みのうち、表示する称号（最後に取ったもの） */
export function currentTitle(unlocked: string[]): string {
  if (unlocked.length === 0) return "新米大統領";
  const last = unlocked[unlocked.length - 1];
  return achievements.find((a) => a.id === last)?.title ?? "新米大統領";
}
