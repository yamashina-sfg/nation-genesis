import type { Profession } from "../types/game";

/**
 * プレイヤーの前職。
 * policyBonus は policyId か field をキーに、効果倍率 (1.3 = +30%)。
 * statBonus は初期ステータスへの加算。
 */
export const professions: Profession[] = [
  {
    id: "teacher",
    label: "元教師",
    blurb: "教育と人づくりのプロ。教育・研究投資の効果が高い。",
    speech:
      "私は教室で未来をつくってきました。今度はこの国の未来を、教育の力で育てます。",
    policyBonus: { education: 1.4, research: 1.2 },
    statBonus: { technology: 4, happiness: 3 },
  },
  {
    id: "office",
    label: "元会社員",
    blurb: "現場を知る堅実派。財政・予算まわりに強く、バランス感覚に優れる。",
    speech:
      "私はずっと現場で働いてきました。庶民の暮らしを、まっとうに守る政治をします。",
    policyBonus: { "tax-cut": 1.2, welfare: 1.2 },
    statBonus: { budget: 8, approval: 2 },
  },
  {
    id: "student",
    label: "元学生",
    blurb: "若さと柔軟さが武器。新しい産業や技術への対応が早い。",
    speech:
      "私は何も持っていません。でも、固定観念もありません。新しい時代の国をつくります。",
    policyBonus: { research: 1.3, immigration: 1.2 },
    statBonus: { technology: 3, happiness: 4 },
  },
  {
    id: "coach",
    label: "元サッカーコーチ",
    blurb: "チームをまとめる天才。国民の団結と支持率に強い。",
    speech:
      "勝つチームには一体感があります。この国を、ひとつのチームにしてみせます。",
    policyBonus: { welfare: 1.25, infrastructure: 1.15 },
    statBonus: { approval: 6, happiness: 5 },
  },
  {
    id: "founder",
    label: "元起業家",
    blurb: "経済を回す実業家。企業支援と株式市場への影響が大きい。",
    speech:
      "私はゼロから事業を立ち上げてきました。この国を、世界で勝てる国に経営します。",
    policyBonus: { research: 1.3, infrastructure: 1.2, "tax-cut": 1.15 },
    statBonus: { gdp: 30, technology: 3 },
  },
];

export const defaultProfessionId = "office";

export function getProfession(id: string): Profession {
  return professions.find((p) => p.id === id) ?? professions[1];
}
