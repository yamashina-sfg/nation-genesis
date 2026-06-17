import type { GameMode } from "../types/game";

/**
 * 画面ごとの「場所」設定。
 * 各 GameMode に部屋テーマを割り当て、背景・時刻・雰囲気を変える。
 * 後で本物の背景画像に差し替えるときは bgImage を足すだけでよい構造。
 */
export type Room = {
  mode: GameMode;
  /** 正式名称 */
  name: string;
  /** 短縮名（遷移演出用） */
  short: string;
  /** 時刻表示 */
  time: string;
  /** その場でやっていること */
  doing: string;
  /** アクセントカラー */
  accent: string;
  /** 場所アイコン(絵文字) */
  icon: string;
};

export const rooms: Record<GameMode, Room> = {
  status: {
    mode: "status",
    name: "大統領執務室",
    short: "執務室",
    time: "午前 8:00",
    doing: "一日の始まり。秘書から本日の報告を受けています。",
    accent: "#d4a843",
    icon: "🏛️",
  },
  policies: {
    mode: "policies",
    name: "閣議室",
    short: "閣議室",
    time: "午前 10:00",
    doing: "大臣たちと向き合い、国の政策を議論しています。",
    accent: "#c08a3e",
    icon: "🪑",
  },
  map: {
    mode: "map",
    name: "国際会議室",
    short: "会議室",
    time: "午後 2:00",
    doing: "各国首脳との会談。世界地図を前に外交を進めます。",
    accent: "#4a9fbd",
    icon: "🌐",
  },
  market: {
    mode: "market",
    name: "証券取引所",
    short: "取引所",
    time: "午前 9:00（場中）",
    doing: "経済の最前線。株価ボードが刻一刻と動いています。",
    accent: "#4caf7d",
    icon: "📈",
  },
  ranking: {
    mode: "ranking",
    name: "世界情勢分析室",
    short: "分析室",
    time: "午後 4:00",
    doing: "世界の中で自国がどの位置にいるかを確認しています。",
    accent: "#8a7bd8",
    icon: "🏆",
  },
  news: {
    mode: "news",
    name: "記者会見室",
    short: "会見室",
    time: "午後 5:00",
    doing: "記者団の前で、今日の出来事を国民に説明します。",
    accent: "#d6605f",
    icon: "🎤",
  },
};
