/**
 * 大統領室のタイルマップ配置（全国共通のレイアウト）。
 * 見た目（色・装飾・国旗）は roomThemes で国ごとに切り替える。
 * グリッドは COLS×ROWS。外周は壁。家具は通り抜け不可。
 */
export const COLS = 13;
export const ROWS = 10;

export type Dir = "up" | "down" | "left" | "right";

export type ObjKind =
  | "desk" | "flag" | "bookshelf" | "sofa" | "table"
  | "tv" | "worldmap" | "window" | "cabinet" | "door" | "decor";

export type RoomObject = {
  kind: ObjKind;
  label: string;
  emoji: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  /** 通り抜け不可か（既定 true） */
  solid?: boolean;
  /** 国旗など、テーマ色のグラデーションで描くか */
  themedFlag?: boolean;
};

/** 共通の家具配置 */
export const baseObjects: RoomObject[] = [
  { kind: "worldmap", label: "世界地図", emoji: "🗺️", x: 1, y: 1 },
  { kind: "window", label: "窓", emoji: "🪟", x: 4, y: 1, w: 2 },
  { kind: "tv", label: "テレビ", emoji: "📺", x: 10, y: 1 },
  { kind: "flag", label: "国旗", emoji: "🏳️", x: 6, y: 2, themedFlag: true },
  { kind: "desk", label: "大統領机", emoji: "🗒️", x: 5, y: 3, w: 3 },
  { kind: "bookshelf", label: "本棚", emoji: "📚", x: 11, y: 2, h: 2 },
  { kind: "cabinet", label: "書類棚", emoji: "🗄️", x: 11, y: 5 },
  { kind: "sofa", label: "ソファ", emoji: "🛋️", x: 1, y: 7, w: 2 },
  { kind: "table", label: "会議テーブル", emoji: "🪑", x: 5, y: 6, w: 3 },
  { kind: "door", label: "扉", emoji: "🚪", x: 6, y: 9, solid: false },
];

export type NpcSpot = { ministerId: string; x: number; y: number; dir: Dir };

/** 大臣NPCの立ち位置（家具やNPCに重ならない床タイル） */
export const npcSpots: NpcSpot[] = [
  { ministerId: "finance", x: 3, y: 3, dir: "down" },
  { ministerId: "chief", x: 9, y: 3, dir: "down" },
  { ministerId: "welfare", x: 2, y: 5, dir: "down" },
  { ministerId: "foreign", x: 3, y: 6, dir: "down" },
  { ministerId: "defense", x: 9, y: 6, dir: "down" },
  { ministerId: "education", x: 9, y: 8, dir: "up" },
];

export const playerStart = { x: 6, y: 8 };

/** 状態に応じた動的装飾を置く予約タイル（通り抜け可＝床の上の飾り） */
export const decorSlots: { x: number; y: number }[] = [
  { x: 4, y: 8 },
  { x: 8, y: 8 },
  { x: 2, y: 1 },
];

/** グリッド座標を % 配置のCSSに変換 */
export function cellStyle(
  x: number, y: number, w = 1, h = 1,
): { left: string; top: string; width: string; height: string } {
  return {
    left: `${(x / COLS) * 100}%`,
    top: `${(y / ROWS) * 100}%`,
    width: `${(w / COLS) * 100}%`,
    height: `${(h / ROWS) * 100}%`,
  };
}

export const DIR_VEC: Record<Dir, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};
