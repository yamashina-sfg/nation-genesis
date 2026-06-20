import type { Policy } from "../types/game";
import type { DiploTier } from "./dayEngine";

/**
 * 「その行動が実際に行われている場面」を描く文章を生成する。
 * 会談なら会談室の様子、増税・減税なら閣議・公開審議で決まる様子……といった
 * 行動ごとの演出を結果画面に添えるためのもの。数値ではなく"情景"を見せる。
 */

/* ===================== 外交：会談・調印・制裁の情景 ===================== */

/** 外交アクションごとの「場面の入り」 */
function diploOpening(actionId: string, nation: string): string {
  switch (actionId) {
    case "summit":
      return `${nation}の迎賓館。並んだ両国の旗の前で、あなたと${nation}の首脳が円卓に着いた。報道陣のカメラが一斉に向けられる。`;
    case "trade":
      return `${nation}との貿易交渉。担当者が分厚い協定案をテーブルに広げ、関税や数量をめぐる細かな駆け引きが始まった。`;
    case "tech":
      return `${nation}との技術協力協議。研究者たちが図面を囲み、共同開発の可能性を一つひとつ探っていく。`;
    case "security":
      return `${nation}との安全保障協議。大きな地図を広げ、共同の備えと役割分担について意見を交わす。`;
    case "alliance":
      return `${nation}との同盟調印式。式典の壇上、ペンを手にした両国の代表が並んで席に着いた。`;
    case "culture":
      return `${nation}との文化交流の式典。舞台では両国の芸術が披露され、客席からは温かい拍手が起こる。`;
    case "intel":
      return `${nation}との非公式の実務協議。表には出ない情報を、限られた関係者だけで静かにやり取りする。`;
    case "sanction":
      return `${nation}への経済制裁を通告。大使を呼び出し、厳しい表情で一枚の文書を手渡した。`;
    case "greeting":
    default:
      return `${nation}の代表との初めての顔合わせ。まずは型どおりの挨拶を交わし、互いの出方をうかがう。`;
  }
}

/** 協調的な行動の結果（ランク別） */
const COOP_CLOSER: Record<DiploTier, string> = {
  大成功: "予想を超える手応えだった。固い握手とともに、両国の距離は大きく縮まった。",
  成功: "話は穏やかにまとまり、関係は確かに一歩前進した。",
  普通: "当たり障りのないやり取りに終始し、可もなく不可もない結果となった。",
  失敗: "主張はすれ違い、空気は重いまま。最後の握手も、どこかぎこちなかった。",
  大失敗: "交渉は決裂。席を立つ相手の背に、各国メディアのフラッシュが容赦なく光った。",
};

/** 強圧的な行動（制裁）の結果（ランク別） */
const SANCTION_CLOSER: Record<DiploTier, string> = {
  大成功: "毅然とした通告は効いた。相手国はこちらの本気を悟り、態度を軟化させた。",
  成功: "厳しい姿勢が圧力となり、こちらの意思ははっきりと相手国に伝わった。",
  普通: "通告は淡々と受け取られ、効果のほどは見えないまま終わった。",
  失敗: "制裁は反発を招き、相手国は強硬な対抗姿勢を崩さなかった。",
  大失敗: "制裁は裏目に出た。相手国は猛反発し、報復の構えすら見せて関係は一気に冷え込んだ。",
};

export function diplomacyScene(actionId: string, nation: string, tier: DiploTier): string {
  const closer = actionId === "sanction" ? SANCTION_CLOSER[tier] : COOP_CLOSER[tier];
  return `${diploOpening(actionId, nation)} ${closer}`;
}

/* ===================== 政策：閣議・審議・採決の情景 ===================== */

/** 政策ジャンル（field）ごとの「決定の場」 */
const FIELD_SETTING: Record<string, string> = {
  財政: "閣議室に閣僚が顔をそろえた。財務大臣が分厚い資料を広げ、国の財布をめぐる激論が交わされる。",
  社会: "社会保障の審議会。現場の声と専門家の意見が飛び交い、暮らしの将来像が話し合われた。",
  安全保障: "国家安全保障会議。重い空気の中、防衛大臣が地図を前に状況を説明する。",
  投資: "閣議で大型の事業計画が諮られた。巨額の予算と将来の見返りを、誰もが慎重に見極めようとする。",
  産業: "産業政策をめぐる会議。経済界の代表が成長戦略を熱く語り、国の進む道が議論された。",
  政治: "議場。代表たちが居並ぶ中、この国の根幹に関わる議論が静かに、しかし熱く始まった。",
  外交: "外交方針をめぐる会議。外務大臣が刻々と動く国際情勢を読み解き、針路を示す。",
  環境: "環境政策の会議。脱炭素の理想と産業への影響が、慎重に天秤にかけられる。",
  人口: "人口政策をめぐる審議。賛成と反対の声が真っ向からぶつかり、国の未来像が問われた。",
};

/** 政策IDごとの個性的な締め（一部の象徴的な政策のみ） */
const POLICY_FLAVOR: Record<string, string> = {
  "tax-hike": "国民に新たな負担を求める重い決断に、議場は静まり返った。",
  "tax-cut": "国民の歓迎が予想される一方、財源を問う声も上がる。",
  conscription: "若者を兵として集めるという決断に、傍聴席からはすすり泣きも聞こえた。",
  welfare: "「これで老後が少し安心できる」——傍聴に来た市民の表情がやわらいだ。",
  immigration: "賛否の渦巻く中での決断に、会場の熱気はなかなか冷めなかった。",
  decarbon: "未来の世代のために——若い傍聴者たちが固唾をのんで見守った。",
};

export function policyScene(policy: Policy, professionLabel?: string, bonus = false): string {
  const setting = FIELD_SETTING[policy.field] ?? "閣議室に閣僚が集まり、政策の是非をめぐって意見が交わされた。";
  const voices = policy.voices ?? [];
  const sup = voices.filter((v) => v.stance === "support").length;
  const opp = voices.filter((v) => v.stance === "oppose").length;

  const verdict =
    opp > sup
      ? `反対の声も根強かったが、最後はあなたの決断で「${policy.name}」が決した。`
      : sup > opp
        ? `賛成多数のうしろ盾を得て、「${policy.name}」は可決された。`
        : `賛否が分かれる中、あなたは「${policy.name}」の実行を決断した。`;

  const flavor = POLICY_FLAVOR[policy.id] ? ` ${POLICY_FLAVOR[policy.id]}` : "";
  const skill = bonus && professionLabel ? ` ${professionLabel}としての手腕が、議論を力強くまとめ上げた。` : "";

  return `${setting} ${verdict}${flavor}${skill} 決定はただちに告示され、国を動かし始めた。`;
}

/* ===================== 金利：中央銀行の情景 ===================== */
export function rateScene(direction: "hike" | "cut", rate: number): string {
  if (direction === "hike") {
    return `中央銀行の会見場。総裁が「物価の安定を最優先する」と述べ、政策金利の引き上げ（${rate.toFixed(1)}%）を発表した。記者たちのペンが一斉に走る。`;
  }
  return `中央銀行の会見場。総裁が「景気を下支えする」と語り、政策金利の引き下げ（${rate.toFixed(1)}%）を発表した。市場関係者が固唾をのんで見守る。`;
}
