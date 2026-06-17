import type { Country } from "../types/game";

/**
 * 架空世界の国家データ。
 * mapPosition は世界地図 (0-100%) 上の島の中心。
 * WorldMap はこの座標を中心に島を描くため、ピンは必ず陸地の上に乗る。
 * tradeRoutes は他国 id への貿易の流れ (volume が太さ)。
 */
export const countries: Country[] = [
  {
    id: "celestia",
    name: "セレスティア共和国",
    isPlayer: true,
    mapPosition: { x: 50, y: 56 },
    x: 50,
    y: 56,
    landShape: 1,
    capital: "セレスティア",
    population: 12,
    gdp: 420,
    resources: ["港湾", "金融", "人材"],
    resource: "港湾",
    military: 38,
    technology: 42,
    relation: 100,
    relationStatus: "自国",
    stance: "技術・貿易立国",
    description:
      "小国だが、優れた港湾・金融・人材を武器に技術と貿易で存在感を放つ海洋共和国。あなたが率いる国家。",
    exports: ["AI半導体", "金融サービス", "精密機器"],
    imports: ["エネルギー", "食料", "鉱物資源"],
    tradeRoutes: [
      { to: "iberia", goods: "金融・半導体", volume: 8 },
      { to: "adriatica", goods: "金融・物流", volume: 7 },
      { to: "levant", goods: "エネルギー輸入", volume: 5 },
      { to: "nordia", goods: "技術・教育交流", volume: 4 },
    ],
    recentNews: "新政権が技術立国と貿易拡大を国家方針に掲げ、各国が反応を見せている。",
  },
  {
    id: "iberia",
    name: "イベリア連邦",
    mapPosition: { x: 23, y: 42 },
    x: 23,
    y: 42,
    landShape: 2,
    capital: "ポルト・ルシア",
    population: 48,
    gdp: 1680,
    resources: ["農産物", "観光", "海運"],
    resource: "農産物",
    military: 58,
    technology: 63,
    relation: 62,
    relationStatus: "友好",
    stance: "通商重視",
    description:
      "豊かな農産物と観光資源、巨大な海運ネットワークを持つ大国。セレスティアにとって最重要の貿易相手。",
    exports: ["農産物", "ワイン", "海運サービス", "観光"],
    imports: ["AI半導体", "金融サービス", "医療機器"],
    tradeRoutes: [
      { to: "celestia", goods: "農産物・海運", volume: 8 },
      { to: "atlas", goods: "食料・肥料", volume: 5 },
    ],
    recentNews: "港湾労組が物流投資を条件に、新たな通商協定へ前向きな姿勢を示している。",
  },
  {
    id: "levant",
    name: "レヴァント共和国",
    mapPosition: { x: 78, y: 50 },
    x: 78,
    y: 50,
    landShape: 3,
    capital: "ミラージュ港",
    population: 25,
    gdp: 760,
    resources: ["エネルギー", "港湾"],
    resource: "エネルギー",
    military: 67,
    technology: 49,
    relation: 39,
    relationStatus: "緊張",
    stance: "資源・安全保障",
    description:
      "天然ガスと石油化学を握る中東・地中海方面の要衝。エネルギー輸送路の安全保障が常に焦点になる。",
    exports: ["天然ガス", "石油化学", "防衛装備"],
    imports: ["食料", "ソフトウェア", "精密機器"],
    tradeRoutes: [
      { to: "celestia", goods: "天然ガス輸出", volume: 5 },
      { to: "adriatica", goods: "エネルギー", volume: 4 },
    ],
    recentNews: "東部海域での哨戒活動が増加し、エネルギー輸送の安全保障が国際的な焦点に。",
  },
  {
    id: "atlas",
    name: "アトラス王国",
    mapPosition: { x: 38, y: 80 },
    x: 38,
    y: 80,
    landShape: 4,
    capital: "マラ・カスバ",
    population: 31,
    gdp: 540,
    resources: ["鉱物", "労働力"],
    resource: "鉱物",
    military: 44,
    technology: 35,
    relation: 47,
    relationStatus: "実務関係",
    stance: "資源外交",
    description:
      "豊富な鉱物資源と若く大きな労働力を抱える新興国。成長余地が大きく、投資先として注目される。",
    exports: ["リン鉱石", "希少金属", "繊維製品"],
    imports: ["港湾物流", "医療機器", "機械"],
    tradeRoutes: [
      { to: "celestia", goods: "鉱物・労働", volume: 4 },
      { to: "iberia", goods: "資源・食料", volume: 5 },
    ],
    recentNews: "鉱山開発の環境規制をめぐり、周辺国から透明性の説明を求められている。",
  },
  {
    id: "adriatica",
    name: "アドリア都市同盟",
    mapPosition: { x: 57, y: 26 },
    x: 57,
    y: 26,
    landShape: 5,
    capital: "サン・ヴェルデ",
    population: 18,
    gdp: 920,
    resources: ["金融", "技術", "物流"],
    resource: "金融",
    military: 33,
    technology: 71,
    relation: 70,
    relationStatus: "協調",
    stance: "中立金融",
    description:
      "金融・技術・物流に長けた裕福な都市同盟。豊かだが外交には慎重で、中立を好む。",
    exports: ["金融サービス", "造船技術", "保険", "物流"],
    imports: ["天然ガス", "農産物"],
    tradeRoutes: [
      { to: "celestia", goods: "金融・物流", volume: 7 },
      { to: "nordia", goods: "技術・保険", volume: 4 },
    ],
    recentNews: "都市同盟議会が、セレスティア国債の格付け見直しを慎重に議論している。",
  },
  {
    id: "nordia",
    name: "ノルディア連合",
    mapPosition: { x: 76, y: 80 },
    x: 76,
    y: 80,
    landShape: 6,
    capital: "ヴェスタフィヨルド",
    population: 22,
    gdp: 1100,
    resources: ["技術", "教育", "再生可能エネルギー"],
    resource: "再生可能エネルギー",
    military: 41,
    technology: 78,
    relation: 55,
    relationStatus: "実務関係",
    stance: "環境・先進",
    description:
      "高い技術力と教育水準、再生可能エネルギーを誇る環境先進国。環境政策に厳しく、基準を共有できる相手を重んじる。",
    exports: ["再生可能エネルギー技術", "教育サービス", "精密機器"],
    imports: ["金融サービス", "鉱物資源"],
    tradeRoutes: [
      { to: "celestia", goods: "技術・教育", volume: 4 },
      { to: "adriatica", goods: "技術・金融", volume: 4 },
    ],
    recentNews: "ノルディア議会が、環境基準を満たす国との優先的な技術協力枠組みを提案。",
  },
];

/** プレイヤー国を除いた周辺国 (外交対象) */
export const initialCountries: Country[] = countries.filter((country) => !country.isPlayer);

/** プレイヤー国を含む全ての国 (地図描画用) */
export const allCountries: Country[] = countries;

export const playerCountry: Country =
  countries.find((country) => country.isPlayer) ?? countries[0];
