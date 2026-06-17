import type { Policy } from "../types/game";

/**
 * 政策一覧。
 * voices = 実行前に表示する関係者の賛成・反対コメント。
 * summary = 専門用語を噛み砕いたやさしい説明。
 */
export const policies: Policy[] = [
  {
    id: "tax-cut",
    name: "減税",
    field: "財政",
    summary: "税金を下げて、家計と企業の手元にお金を残す政策。",
    short: { approval: 5, happiness: 3, budget: -14, gdp: 9, inflation: 0.4 },
    long: { unemployment: -0.4, budget: -5 },
    lesson: "家計と企業を刺激する一方、国の収入（税収）は減る。",
    newsHeadline: "減税法案が可決、国民生活に一時的な安心感",
    voices: [
      { characterId: "citizen", stance: "support", text: "物価高で生活が苦しいです。減税してくれたら本当に助かります。" },
      { characterId: "business", stance: "support", text: "消費が増えれば企業活動も活発になります。歓迎します。" },
      { characterId: "finance", stance: "oppose", text: "ただし税収が減り、財政赤字が拡大します。将来の負担になりますよ。" },
    ],
  },
  {
    id: "tax-hike",
    name: "増税",
    field: "財政",
    summary: "税金を上げて、国の財布（予算）を立て直す政策。",
    short: { approval: -6, happiness: -3, budget: 18, inflation: -0.2 },
    long: { gdp: -4, trust: 2 },
    lesson: "財政は健全になるが、国民の生活には重くのしかかる。",
    newsHeadline: "増税法案が成立、財政再建へ国民に負担",
    voices: [
      { characterId: "finance", stance: "support", text: "財政の穴を埋めるには必要な決断です。将来世代のためにも。" },
      { characterId: "citizen", stance: "oppose", text: "ただでさえ苦しいのに、これ以上負担が増えるのは厳しいです。" },
      { characterId: "business", stance: "oppose", text: "消費が冷え込み、企業の売上にも響きます。タイミングが心配です。" },
    ],
  },
  {
    id: "education",
    name: "教育投資",
    field: "社会",
    summary: "学校や人材育成にお金を使い、未来の国の力を育てる政策。",
    short: { budget: -12, happiness: 2 },
    long: { technology: 6, gdp: 8, unemployment: -0.3 },
    lesson: "すぐには効かないが、何年もかけて生産性と雇用の土台になる。",
    newsHeadline: "教育予算を大幅拡充、未来への投資に期待の声",
    voices: [
      { characterId: "citizen", stance: "support", text: "子どもたちの未来に投資してくれるのは、親として嬉しいです。" },
      { characterId: "business", stance: "support", text: "優秀な人材が育てば、長期的に産業全体が強くなります。" },
      { characterId: "finance", stance: "neutral", text: "支出は増えますが、将来のリターンを考えれば妥当な投資です。" },
    ],
  },
  {
    id: "welfare",
    name: "福祉拡大",
    field: "社会",
    summary: "医療・年金・子育て支援などを手厚くして、生活の不安を減らす政策。",
    short: { budget: -16, happiness: 7, approval: 4 },
    long: { unemployment: -0.2, budget: -4 },
    lesson: "生活の不安は減るが、毎年お金がかかり続ける（継続財源が必要）。",
    newsHeadline: "社会保障を拡充、暮らしの安心に国民から歓迎の声",
    voices: [
      { characterId: "citizen", stance: "support", text: "老後や病気のときの不安が減ります。本当にありがたい政策です。" },
      { characterId: "finance", stance: "oppose", text: "一度始めると毎年お金がかかります。財源の見通しが心配です。" },
      { characterId: "business", stance: "neutral", text: "安心感が消費につながれば、経済にもプラスに働きます。" },
    ],
  },
  {
    id: "defense",
    name: "防衛費増額",
    field: "安全保障",
    summary: "軍事・防衛にお金を使い、国を守る力（抑止力）を高める政策。",
    short: { budget: -13, military: 8, trust: -1 },
    long: { technology: 2 },
    lesson: "国を守る力は高まるが、周辺国は警戒し、緊張が生まれることも。",
    newsHeadline: "防衛予算を増額、安全保障強化へ周辺国は警戒",
    voices: [
      { characterId: "defense", stance: "support", text: "国を守る備えは待ったなしです。抑止力は平和への投資です。" },
      { characterId: "citizen", stance: "oppose", text: "その分を暮らしに回してほしい、という声も多いですよ。" },
      { characterId: "foreign", stance: "neutral", text: "周辺国を刺激しすぎないよう、外交での説明も必要です。" },
    ],
  },
  {
    id: "immigration",
    name: "移民受け入れ",
    field: "人口",
    summary: "海外からの働き手を受け入れ、人手不足を補う政策。",
    short: { gdp: 7, unemployment: 0.3, approval: -2 },
    long: { technology: 2, happiness: -1 },
    lesson: "労働力は増えるが、社会に溶け込む支援がないと摩擦も起きる。",
    newsHeadline: "外国人材の受け入れ拡大、人手不足解消に期待と懸念",
    voices: [
      { characterId: "business", stance: "support", text: "人手不足は深刻です。働き手が増えるのは産業界の願いです。" },
      { characterId: "citizen", stance: "oppose", text: "受け入れは賛成ですが、地域に馴染めるよう支援も必要です。" },
      { characterId: "finance", stance: "neutral", text: "労働人口が増えれば、税収や成長にはプラスに働きます。" },
    ],
  },
  {
    id: "infrastructure",
    name: "インフラ整備",
    field: "投資",
    summary: "道路・鉄道・通信などを整備し、景気と暮らしを底上げする政策。",
    short: { budget: -20, gdp: 10, unemployment: -0.5 },
    long: { gdp: 12, happiness: 3, environment: -2 },
    lesson: "公共事業は景気と雇用を支えるが、環境への負荷も管理が必要。",
    newsHeadline: "大型インフラ計画を始動、景気と雇用に追い風",
    voices: [
      { characterId: "business", stance: "support", text: "建設需要が生まれ、雇用も増えます。地域経済が回ります。" },
      { characterId: "citizen", stance: "support", text: "便利になるのは助かります。地方にもお金が回ってほしい。" },
      { characterId: "finance", stance: "oppose", text: "巨額の支出です。無駄な事業にならないか、見極めが大事です。" },
    ],
  },
  {
    id: "research",
    name: "研究開発支援",
    field: "産業",
    summary: "新しい技術や産業に投資し、世界で勝てる力をつける政策。",
    short: { budget: -14, technology: 5 },
    long: { gdp: 10, technology: 6 },
    lesson: "イノベーション（技術革新）は企業価値と輸出競争力を押し上げる。",
    newsHeadline: "研究開発支援を強化、次世代産業に国家の期待",
    voices: [
      { characterId: "business", stance: "support", text: "技術こそ国の競争力です。未来の飯の種に投資すべきです。" },
      { characterId: "finance", stance: "neutral", text: "成果が出るまで時間はかかりますが、将来のリターンは大きい。" },
      { characterId: "citizen", stance: "neutral", text: "新しい産業で仕事が増えるなら、応援したいです。" },
    ],
  },
];
