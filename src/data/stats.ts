import type { NationStats, StatKey } from "../types/game";

export const statLabels: Record<StatKey, string> = {
  approval: "支持率",
  happiness: "幸福度",
  gdp: "GDP",
  budget: "国家予算",
  unemployment: "失業率",
  inflation: "インフレ率",
  trust: "外交信用",
  military: "軍事力",
  technology: "技術力",
  environment: "環境評価",
};

/** やさしい言い換え（ゲーム内で優先表示） */
export const statEasy: Record<StatKey, string> = {
  approval: "支持",
  happiness: "暮らし",
  gdp: "豊かさ",
  budget: "国の財布",
  unemployment: "仕事",
  inflation: "物価",
  trust: "外交",
  military: "守り",
  technology: "技術",
  environment: "環境",
};

/** 一言の補足（専門用語の意味）。詳細やツールチップ用 */
export const statHelp: Record<StatKey, string> = {
  approval: "支持率：国民がどれだけあなたを支持しているか",
  happiness: "幸福度：国民の暮らしの満足度",
  gdp: "GDP（国内総生産）：国全体の稼ぐ力＝国の豊かさ",
  budget: "国家予算：国の財布。マイナスは赤字",
  unemployment: "失業率：仕事を探している人の割合。低いほど良い",
  inflation: "インフレ率：物価の上がり方。高すぎると生活が苦しい",
  trust: "外交信用：世界からの信頼の厚さ",
  military: "軍事力：国を守る力・抑止力",
  technology: "技術力：産業や研究の進み具合",
  environment: "環境評価：脱炭素や自然との両立度",
};

export const initialStats: NationStats = {
  approval: 56,
  happiness: 58,
  gdp: 420,
  budget: 120,
  unemployment: 6.8,
  inflation: 3.4,
  trust: 52,
  military: 38,
  technology: 42,
  environment: 54,
};
