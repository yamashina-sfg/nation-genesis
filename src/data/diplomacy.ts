import type { NationStats } from "../types/game";

/** 外交アクション。友好度(minRelation)で解放される。 */
export type DiplomacyActionDef = {
  id: string;
  label: string;
  emoji: string;
  minRelation: number;
  hint: string;
  /** 相手国との友好度の変化 */
  relationDelta: number;
  /** 自国ステータスへの効果 */
  effect: Partial<NationStats>;
  /** 相手国の反応テンプレ */
  reaction: string;
  /** なぜ関係が変化したか */
  reason: string;
};

export const diplomacyActions: DiplomacyActionDef[] = [
  // 友好度 0〜29
  {
    id: "greeting",
    label: "挨拶外交",
    emoji: "🙋",
    minRelation: 0,
    hint: "まずは関係づくりの第一歩。低リスク。",
    relationDelta: 4,
    effect: { trust: 1 },
    reaction: "「対話の窓口が開かれたことを歓迎する」と慎重ながら前向きな反応。",
    reason: "公式の挨拶を交わし、最低限の信頼関係が生まれたため。",
  },
  {
    id: "intel",
    label: "情報交換",
    emoji: "📡",
    minRelation: 0,
    hint: "実務レベルの情報共有で信頼を少しずつ積む。",
    relationDelta: 5,
    effect: { trust: 2, technology: 1 },
    reaction: "「有益な情報共有だった」と実務担当者から好意的な評価。",
    reason: "実務レベルの情報共有が進み、相互理解が深まったため。",
  },
  // 友好度 30〜49
  {
    id: "culture",
    label: "文化交流",
    emoji: "🎭",
    minRelation: 30,
    hint: "市民レベルの親近感を高める。支持率にも好影響。",
    relationDelta: 7,
    effect: { trust: 2, happiness: 2, approval: 1 },
    reaction: "「両国民の距離が縮まった」と国民世論も好転。",
    reason: "文化・人的交流が進み、国民同士の親近感が高まったため。",
  },
  {
    id: "summit",
    label: "首脳会談",
    emoji: "🏛️",
    minRelation: 30,
    hint: "信頼を安く積める。将来の協定の土台に。",
    relationDelta: 8,
    effect: { trust: 4, approval: 1, budget: -2 },
    reaction: "「建設的な対話ができた」と共同声明を発表。",
    reason: "首脳同士が直接対話し、誤解が減り予測可能性が高まったため。",
  },
  // 友好度 50〜69
  {
    id: "trade",
    label: "貿易協定",
    emoji: "🤝",
    minRelation: 50,
    hint: "GDPと物流に追い風。輸入依存リスクも。",
    relationDelta: 10,
    effect: { gdp: 30, trust: 5, approval: -2 },
    reaction: "「双方に利益のある合意だ」と経済界が歓迎。",
    reason: "通商ルールを共有し、貿易と物流が拡大したため。",
  },
  // 友好度 70〜89
  {
    id: "tech",
    label: "技術協力",
    emoji: "🔬",
    minRelation: 70,
    hint: "技術力を相互に底上げ。先進国同士で効果大。",
    relationDelta: 8,
    effect: { technology: 6, gdp: 10, trust: 4 },
    reaction: "「未来を共につくるパートナーだ」と研究機関が連携を表明。",
    reason: "先端技術を共同開発し、産業の競争力が高まったため。",
  },
  {
    id: "security",
    label: "安全保障協力",
    emoji: "🛡️",
    minRelation: 70,
    hint: "抑止力が上昇。ただし非同盟国は警戒。",
    relationDelta: 7,
    effect: { military: 7, trust: 3, budget: -8 },
    reaction: "「地域の安定に資する協力だ」と国防当局が連携を強化。",
    reason: "共同訓練と情報共有により、両国の防衛能力が高まったため。",
  },
  // 友好度 90以上
  {
    id: "alliance",
    label: "同盟締結",
    emoji: "⚔️",
    minRelation: 90,
    hint: "最高位の信頼。強力な抑止力と経済連携。",
    relationDelta: 6,
    effect: { military: 10, trust: 8, gdp: 15, budget: -10 },
    reaction: "「歴史的な同盟だ」と両国民が祝福。世界が注目する。",
    reason: "正式な同盟を結び、安全保障と経済で運命を共にする関係になったため。",
  },
  // 制裁はいつでも可能（敵対的）
  {
    id: "sanction",
    label: "経済制裁",
    emoji: "🚫",
    minRelation: 0,
    hint: "圧力をかけるが、貿易と信用が痛む。強硬策。",
    relationDelta: -20,
    effect: { trust: -6, gdp: -18, approval: 2 },
    reaction: "「不当な圧力だ」と強く反発。関係は急速に冷え込む。",
    reason: "強硬な制裁措置により、相手国が態度を硬化させたため。",
  },
];

/** 友好度から解放されているアクションを返す（制裁は常時、それ以外は段階解放） */
export function availableActions(relation: number): DiplomacyActionDef[] {
  return diplomacyActions.filter((a) => relation >= a.minRelation);
}
