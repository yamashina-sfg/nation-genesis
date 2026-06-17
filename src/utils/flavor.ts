import type { StatKey } from "../types/game";

/**
 * 数値変化を「出来事」として体感できる一言に変換する。
 * 数字の代わりに、街や暮らしの様子で見せるための文言。
 */
export function deltaEvent(key: StatKey, amount: number): string {
  const big = Math.abs(amount) >= 8;
  const up = amount > 0;
  switch (key) {
    case "gdp":
      return up
        ? big ? "景気が一気に上向き、街に活気が戻っている" : "景気回復の兆し、企業の採用が増えている"
        : big ? "景気が冷え込み、街から元気が消えつつある" : "景気がやや鈍り、企業が様子見になっている";
    case "approval":
      return up
        ? big ? "国民の支持が一気に広がっている" : "支持の声が少しずつ増えている"
        : big ? "政権への不満が噴き出している" : "支持に陰りが見え始めた";
    case "happiness":
      return up
        ? "暮らしに余裕が出て、笑顔が増えている"
        : "生活への不安が広がっている";
    case "budget":
      return up
        ? "国の財布に余裕が生まれた"
        : big ? "国の財布が一気に苦しくなっている" : "国の財布がやや厳しくなってきた";
    case "unemployment":
      return up
        ? "仕事を失う人が増え、街に求職者が目立つ"
        : "仕事が見つかりやすくなり、求人が増えている";
    case "inflation":
      return up
        ? big ? "物価が急に上がり、買い物がつらくなっている" : "物価がじわじわ上がってきた"
        : "物価が落ち着き、家計に一息ついている";
    case "trust":
      return up
        ? "世界からの信頼が増している"
        : "国際的な信用が揺らいでいる";
    case "military":
      return up
        ? "国の守りが固くなり、安心感が広がる"
        : "防衛力への不安が残っている";
    case "technology":
      return up
        ? "新しい技術が育ち、未来への期待が高まる"
        : "技術競争で後れを取りつつある";
    case "environment":
      return up
        ? "環境への取り組みが評価されている"
        : "環境への負荷が増し、批判も出ている";
  }
}

/** 変化の向きを矢印つきの短い見出しに（出来事＋小さな数値補助） */
export function trendWord(amount: number): string {
  if (amount > 0) return "良くなった";
  if (amount < 0) return "悪くなった";
  return "横ばい";
}
