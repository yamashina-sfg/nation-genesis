export type StatKey =
  | "approval"
  | "happiness"
  | "gdp"
  | "budget"
  | "unemployment"
  | "inflation"
  | "trust"
  | "military"
  | "technology"
  | "environment";

export type NationStats = Record<StatKey, number>;

export type GameMode = "status" | "policies" | "map" | "market" | "news" | "ranking";

/** 政策に対する関係者コメント (賛成/反対) */
export type StakeholderVoice = {
  characterId: string;
  stance: "support" | "oppose" | "neutral";
  text: string;
};

export type Policy = {
  id: string;
  name: string;
  field: string;
  /** この年から解放（時代制限）。未指定なら最初から使える */
  since?: number;
  /** この年まで（以降は使えなくなる。未指定なら以降も使える） */
  until?: number;
  /** やさしい一言説明 */
  summary: string;
  short: Partial<NationStats>;
  long: Partial<NationStats>;
  lesson: string;
  /** 政策実行前に表示する関係者の声 */
  voices: StakeholderVoice[];
  /** 実行後のニュース見出しテンプレ */
  newsHeadline: string;
};

/** プレイヤーの前職 */
export type Profession = {
  id: string;
  label: string;
  blurb: string;
  /** 前職フレーバー (大統領就任演説風) */
  speech: string;
  /** 政策効果倍率 (policyId または field をキーに) */
  policyBonus: Partial<Record<string, number>>;
  /** 初期ステータス補正 */
  statBonus: Partial<NationStats>;
};

/** プレイヤーのプロフィール */
export type PlayerProfile = {
  name: string;
  professionId: string;
};

/** ランキング軸 */
export type RankingAxis = {
  key: StatKey | "marketIndex";
  label: string;
  note: string;
};

/** ランキング1行 */
export type RankingEntry = {
  name: string;
  value: number;
  isPlayer: boolean;
};

export type Company = {
  id: string;
  name: string;
  sector: string;
  price: number;
  previousPrice: number;
  bias: Partial<Record<StatKey, number>>;
  changeReason?: string;
};

export type TradeRoute = {
  to: string;
  goods: string;
  volume: number;
};

export type Country = {
  id: string;
  name: string;
  isPlayer?: boolean;
  mapPosition: { x: number; y: number };
  x: number;
  y: number;
  landShape: number;
  capital: string;
  population: number;
  gdp: number;
  resources: string[];
  resource: string;
  military: number;
  technology: number;
  relation: number;
  relationStatus: string;
  stance: string;
  description: string;
  exports: string[];
  imports: string[];
  tradeRoutes: TradeRoute[];
  recentNews: string;
};

export type AINation = Country;

export type StatDelta = {
  key: StatKey;
  amount: number;
  reason: string;
};

export type CharacterComment = {
  characterId: string;
  role: string;
  name: string;
  text: string;
};

export type NewsItem = {
  title: string;
  body: string;
  category: "政治" | "経済" | "外交" | "市場" | "災害" | "技術";
  affectedNation?: string;
  deltas?: StatDelta[];
  reason?: string;
  comments?: CharacterComment[];
};

export type Character = {
  id: string;
  name: string;
  title: string;
  role: string;
  personality: string;
  color: string;
  fallbackColor: string;
  image: string;
  defaultComment: string;
  advice: string;
};

/** イベント選択肢 (大統領シミュレーター形式) */
export type EventChoice = {
  id: string;
  label: string;
  description: string;
  effect: Partial<NationStats>;
  explanation: string;
};

/** イベントの分類（1日ごとの抽選バケツ） */
export type EventScope =
  | "domestic" // 小さな国内ニュース
  | "world" // 世界ニュース
  | "market" // 市場変動
  | "diplo" // 外交イベント
  | "citizen" // 市民イベント
  | "crisis" // 緊急イベント
  | "positive"; // ポジティブイベント

/** 時間差で発生する後続効果（短期/中期/長期） */
export type FollowupEffect = {
  /** 何日後に発生するか */
  afterDays: number;
  title: string;
  body: string;
  category: NewsItem["category"];
  effect: Partial<NationStats>;
};

/** ゲームイベント */
export type GameEvent = {
  id: string;
  title: string;
  body: string;
  category: NewsItem["category"];
  /** この年から発生しうる（時代制限）。未指定なら全時代 */
  since?: number;
  /** この年まで発生（以降は出ない）。未指定なら以降も出る */
  until?: number;
  /** 1日ごとの抽選バケツ */
  scope?: EventScope;
  /** 市民の生の反応（速報の下に一言） */
  citizen?: string;
  /** 選択肢がある場合: プレイヤーに判断を求める */
  choices?: EventChoice[];
  /** 選択型イベントで割れる大臣・関係者の意見 */
  voices?: StakeholderVoice[];
  /** 時間差で出る後続効果 */
  followups?: FollowupEffect[];
  /** 選択肢がない場合: 自動適用 */
  effect: Partial<NationStats>;
};

/**
 * 保留中の後続効果（数日後・数週間後・数か月後に発生）。
 * シリアライズ可能＝セーブできる。
 */
export type ScheduledEffect = {
  /** この日（通算日数 dayCount）になったら発生 */
  fireOnDay: number;
  title: string;
  body: string;
  category: NewsItem["category"];
  effect: Partial<NationStats>;
};

export type PlayerNation = {
  name: string;
  doctrine: string;
  flagPrimary: string;
  flagAccent: string;
};

/** リアル国家型 (国家選択画面で使用) */
export type { RealCountry } from "../data/realCountries";

export type ActionResult = {
  title: string;
  body: string;
  affectedNation?: string;
  deltas: StatDelta[];
  benefits: string[];
  drawbacks: string[];
  comments: CharacterComment[];
};
