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

export type GameMode = "status" | "policies" | "map" | "market" | "news";

export type Policy = {
  id: string;
  name: string;
  field: string;
  short: Partial<NationStats>;
  long: Partial<NationStats>;
  lesson: string;
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

/** ゲームイベント */
export type GameEvent = {
  id: string;
  title: string;
  body: string;
  category: NewsItem["category"];
  /** 選択肢がある場合: プレイヤーに判断を求める */
  choices?: EventChoice[];
  /** 選択肢がない場合: 自動適用 */
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
