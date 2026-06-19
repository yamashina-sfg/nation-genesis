/**
 * 国別の大統領室テーマ。
 * 後から画像タイル・スプライトに差し替えやすいよう、色と装飾データのみで定義。
 */
export type ThemeDecor = { label: string; emoji: string; x: number; y: number };

export type RoomTheme = {
  id: string;
  name: string;
  /** 壁の色 */
  wall: string;
  /** 床の色（市松の濃淡で2色使う） */
  floor: string;
  floorAlt: string;
  /** メインカラー（既定 #196c76） */
  accent: string;
  /** 家具の色味 */
  furniture: string;
  /** 国別の装飾（床や壁の飾り） */
  decor: ThemeDecor[];
};

const DEFAULT_ACCENT = "#196c76";

export const roomThemes: Record<string, RoomTheme> = {
  japan: {
    id: "japan", name: "和の執務室",
    wall: "#cdb892", floor: "#b98c52", floorAlt: "#ad8049",
    accent: DEFAULT_ACCENT, furniture: "#6f4a25",
    decor: [
      { label: "盆栽", emoji: "🪴", x: 2, y: 8 },
      { label: "掛け軸", emoji: "🎴", x: 10, y: 1 },
      { label: "茶器", emoji: "🍵", x: 1, y: 8 },
    ],
  },
  usa: {
    id: "usa", name: "ホワイトハウス風",
    wall: "#22386a", floor: "#5d3b27", floorAlt: "#523322",
    accent: "#b22234", furniture: "#3a2516",
    decor: [
      { label: "暖炉", emoji: "🔥", x: 2, y: 8 },
      { label: "肖像画", emoji: "🖼️", x: 10, y: 1 },
      { label: "鷲の像", emoji: "🦅", x: 1, y: 8 },
    ],
  },
  uk: {
    id: "uk", name: "クラシックな官邸",
    wall: "#3b2f2f", floor: "#7a2e2e", floorAlt: "#6c2828",
    accent: "#c8a24a", furniture: "#4a3320",
    decor: [
      { label: "紋章", emoji: "🛡️", x: 10, y: 1 },
      { label: "暖炉", emoji: "🔥", x: 2, y: 8 },
      { label: "ティーセット", emoji: "🫖", x: 1, y: 8 },
    ],
  },
  china: {
    id: "china", name: "紅の大会堂",
    wall: "#6e1414", floor: "#8a2a2a", floorAlt: "#7a2424",
    accent: "#ffcc33", furniture: "#4a1010",
    decor: [
      { label: "龍の装飾", emoji: "🐉", x: 10, y: 1 },
      { label: "提灯", emoji: "🏮", x: 2, y: 8 },
      { label: "書", emoji: "📜", x: 1, y: 8 },
    ],
  },
  russia: {
    id: "russia", name: "厳格な宮殿",
    wall: "#2a2f3a", floor: "#3a3f4a", floorAlt: "#333845",
    accent: "#8a1f2a", furniture: "#23272f",
    decor: [
      { label: "作戦地図", emoji: "🗺️", x: 10, y: 1 },
      { label: "重厚なカーテン", emoji: "🧵", x: 2, y: 8 },
      { label: "勲章棚", emoji: "🎖️", x: 1, y: 8 },
    ],
  },
};

/** その他の国は落ち着いた既定テーマ */
export const defaultTheme: RoomTheme = {
  id: "default", name: "大統領執務室",
  wall: "#33414f", floor: "#445363", floorAlt: "#3d4b59",
  accent: DEFAULT_ACCENT, furniture: "#2a3540",
  decor: [
    { label: "観葉植物", emoji: "🪴", x: 2, y: 8 },
    { label: "地球儀", emoji: "🌐", x: 10, y: 1 },
  ],
};

export function getTheme(countryId: string | undefined): RoomTheme {
  if (!countryId) return defaultTheme;
  return roomThemes[countryId] ?? defaultTheme;
}
