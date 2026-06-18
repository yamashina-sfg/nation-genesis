import type { NationStats } from "../types/game";

/**
 * 本日の課題（ミッション）。
 * 「開いた瞬間に何をすべきか分かる」ための小さな目標。
 * データのみ（関数を持たない）でシリアライズ可能＝セーブできる。
 */
export type MissionType =
  | "approval"
  | "gdp"
  | "trust"
  | "happiness"
  | "diplo"
  | "policy"
  | "inflation"
  | "unemployment"
  | "market";

export type Mission = {
  id: string;
  type: MissionType;
  target: number;
  label: string;
  hint: string;
  done: boolean;
};

export type MissionCtx = {
  stats: NationStats;
  policyCount: number;
  diploCount: number;
  marketIndex: number;
};

let seq = 0;
function mid() {
  seq += 1;
  return `m${Date.now()}_${seq}`;
}

/** 現在の状況から達成しやすい課題を1つ生成 */
export function generateMission(ctx: MissionCtx): Mission {
  const s = ctx.stats;
  // 弱点や次の一歩になりやすいものを優先しつつ、少しランダム
  const pool: Mission[] = [];

  pool.push({
    id: mid(), type: "approval", target: Math.min(95, Math.round(s.approval) + 5),
    label: `支持率を ${Math.min(95, Math.round(s.approval) + 5)} 以上にしよう`,
    hint: "減税や福祉など、国民に響く政策が効きます", done: false,
  });
  pool.push({
    id: mid(), type: "gdp", target: Math.round(s.gdp) + 30,
    label: `国の豊かさを ${Math.round(s.gdp) + 30} 以上にしよう`,
    hint: "インフラ整備や貿易協定で景気を押し上げましょう", done: false,
  });
  pool.push({
    id: mid(), type: "diplo", target: ctx.diploCount + 1,
    label: "他の国と外交をしよう（1回）",
    hint: "外交画面で国を選んでアクションを実行", done: false,
  });
  pool.push({
    id: mid(), type: "policy", target: ctx.policyCount + 1,
    label: "政策を1つ実行しよう",
    hint: "政策画面でカードを選んで実行", done: false,
  });
  pool.push({
    id: mid(), type: "market", target: ctx.marketIndex + 20,
    label: `国内株価指数を ${ctx.marketIndex + 20} 以上にしよう`,
    hint: "景気が良くなる政策や利下げで株価は上がりやすい", done: false,
  });
  if (s.inflation > 4) {
    pool.push({
      id: mid(), type: "inflation", target: 4,
      label: "物価（インフレ）を 4% 以下に抑えよう",
      hint: "金利を上げると物価上昇が落ち着きます", done: false,
    });
  }
  if (s.unemployment > 6) {
    pool.push({
      id: mid(), type: "unemployment", target: 6,
      label: "仕事（失業率）を 6% 以下にしよう",
      hint: "教育・インフラ投資で雇用を増やしましょう", done: false,
    });
  }
  if (s.trust < 60) {
    pool.push({
      id: mid(), type: "trust", target: Math.min(90, Math.round(s.trust) + 6),
      label: `外交信用を ${Math.min(90, Math.round(s.trust) + 6)} 以上にしよう`,
      hint: "首脳会談や文化交流を重ねましょう", done: false,
    });
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateMissions(ctx: MissionCtx, count = 3): Mission[] {
  const result: Mission[] = [];
  const usedTypes = new Set<MissionType>();
  let guard = 0;
  while (result.length < count && guard < 40) {
    guard += 1;
    const m = generateMission(ctx);
    if (usedTypes.has(m.type)) continue;
    usedTypes.add(m.type);
    result.push(m);
  }
  return result;
}

/** ミッションが達成されたか */
export function isMissionDone(m: Mission, ctx: MissionCtx): boolean {
  const s = ctx.stats;
  switch (m.type) {
    case "approval": return s.approval >= m.target;
    case "gdp": return s.gdp >= m.target;
    case "trust": return s.trust >= m.target;
    case "happiness": return s.happiness >= m.target;
    case "diplo": return ctx.diploCount >= m.target;
    case "policy": return ctx.policyCount >= m.target;
    case "inflation": return s.inflation <= m.target;
    case "unemployment": return s.unemployment <= m.target;
    case "market": return ctx.marketIndex >= m.target;
  }
}
