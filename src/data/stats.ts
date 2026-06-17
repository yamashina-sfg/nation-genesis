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
