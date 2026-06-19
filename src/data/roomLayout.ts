import type { SpriteRole } from "../components/room/PixelSprite";
import type { GameMode } from "../types/game";

/**
 * 大統領府 1F の見下ろし型マップ。
 * 6つの部屋（執務室/閣議室/応接室/市場分析室/広報室/資料室）＋中央の廊下・休憩スペース。
 * 壁(#)で部屋を仕切り、各部屋は廊下へ1マスの出入口でつながる。
 */
export const COLS = 18;
export const ROWS = 14;

export type Dir = "up" | "down" | "left" | "right";

/** '#'=壁, '.'=床。出入口は床。 */
export const WALL_MAP: string[] = [
  "##################",
  "#.....#.....#....#",
  "#.....#.....#....#",
  "#.....#.....#....#",
  "#.....#.....#....#",
  "###.#####.####.###",
  "#................#",
  "#................#",
  "#................#",
  "###.#####.####.###",
  "#.....#.....#....#",
  "#.....#.....#....#",
  "#.....#.....#....#",
  "##################",
];

export function isWall(x: number, y: number): boolean {
  if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return true;
  return WALL_MAP[y][x] === "#";
}

/** 部屋ゾーン（床色・部屋名・現在地表示に使う） */
export type RoomZone = { id: string; name: string; x: number; y: number; w: number; h: number; floor: string };

export const roomZones: RoomZone[] = [
  { id: "office", name: "大統領執務室", x: 1, y: 1, w: 5, h: 4, floor: "#a87f4a" },
  { id: "cabinet", name: "閣議室", x: 7, y: 1, w: 5, h: 4, floor: "#5f6f86" },
  { id: "reception", name: "外交応接室", x: 13, y: 1, w: 4, h: 4, floor: "#9c4f3f" },
  { id: "market", name: "市場分析室", x: 1, y: 10, w: 5, h: 3, floor: "#566576" },
  { id: "press", name: "ニュース広報室", x: 7, y: 10, w: 5, h: 3, floor: "#41635c" },
  { id: "archive", name: "資料室", x: 13, y: 10, w: 4, h: 3, floor: "#9a7e46" },
];

const CORRIDOR: RoomZone = { id: "hall", name: "廊下・休憩スペース", x: 1, y: 6, w: 16, h: 3, floor: "#bcae8b" };

export function roomAt(x: number, y: number): RoomZone {
  for (const z of roomZones) {
    if (x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) return z;
  }
  return CORRIDOR;
}

/** 家具・装飾 */
export type FurnKind =
  | "deskBig" | "desk" | "flag" | "table" | "chair" | "sofa" | "rug"
  | "bookshelf" | "cabinet" | "plant" | "pc" | "tv" | "podium"
  | "phone" | "vending" | "water" | "camera" | "papers";

export type Furniture = {
  kind: FurnKind;
  x: number; y: number; w?: number; h?: number;
  label?: string;
  solid?: boolean; // 既定 true
  flag?: boolean; // 国旗（国の色で描く）
  /** 近づいて決定すると画面遷移する操作対象 */
  interact?: { mode: GameMode; prompt: string };
};

export const furniture: Furniture[] = [
  // ===== 大統領執務室（x1..5, y1..4）=====
  { kind: "bookshelf", x: 1, y: 1, label: "資料" },
  { kind: "flag", x: 4, y: 1, flag: true, label: "国旗" },
  { kind: "cabinet", x: 5, y: 1 },
  { kind: "deskBig", x: 1, y: 2, w: 2, label: "大統領の机" },
  { kind: "phone", x: 5, y: 2, label: "電話", interact: { mode: "map", prompt: "外交を行う" } },
  { kind: "papers", x: 4, y: 2 },
  { kind: "plant", x: 5, y: 4 },

  // ===== 閣議室（x7..11, y1..4）=====
  { kind: "cabinet", x: 7, y: 1 },
  { kind: "plant", x: 11, y: 1 },
  { kind: "table", x: 7, y: 2, w: 2, h: 2, label: "会議卓" },
  { kind: "table", x: 10, y: 2, w: 2, h: 2 },
  { kind: "chair", x: 7, y: 4 },
  { kind: "chair", x: 11, y: 4 },

  // ===== 外交応接室（x13..16, y1..4）=====
  { kind: "flag", x: 13, y: 1, flag: true, label: "国旗" },
  { kind: "sofa", x: 15, y: 1, w: 2, label: "ソファ" },
  { kind: "rug", x: 14, y: 3, w: 2, solid: false },
  { kind: "plant", x: 16, y: 4 },

  // ===== 廊下・休憩スペース（x1..16, y6..8）=====
  { kind: "vending", x: 1, y: 6, label: "自販機" },
  { kind: "water", x: 16, y: 6, label: "給水器" },
  { kind: "sofa", x: 6, y: 7, w: 2, label: "休憩ソファ" },
  { kind: "rug", x: 6, y: 8, w: 2, solid: false },
  { kind: "plant", x: 2, y: 8 },
  { kind: "plant", x: 5, y: 6 },
  { kind: "plant", x: 11, y: 6 },
  { kind: "plant", x: 12, y: 8 },
  { kind: "plant", x: 15, y: 8 },

  // ===== 市場分析室（x1..5, y10..12）=====
  { kind: "pc", x: 1, y: 10, label: "市場端末", interact: { mode: "market", prompt: "市場を見る" } },
  { kind: "pc", x: 2, y: 10, interact: { mode: "market", prompt: "市場を見る" } },
  { kind: "pc", x: 4, y: 10, interact: { mode: "market", prompt: "市場を見る" } },
  { kind: "pc", x: 5, y: 10, interact: { mode: "market", prompt: "市場を見る" } },
  { kind: "desk", x: 1, y: 11, w: 2 },
  { kind: "plant", x: 1, y: 12 },

  // ===== ニュース広報室（x7..11, y10..12）=====
  { kind: "camera", x: 7, y: 10, label: "カメラ" },
  { kind: "tv", x: 11, y: 10, label: "速報", interact: { mode: "news", prompt: "ニュースを見る" } },
  { kind: "podium", x: 8, y: 11, label: "演台", interact: { mode: "news", prompt: "ニュースを見る" } },
  { kind: "chair", x: 10, y: 12 },
  { kind: "plant", x: 7, y: 12 },

  // ===== 資料室（x13..16, y10..12）=====
  { kind: "bookshelf", x: 13, y: 10, h: 2, label: "本棚" },
  { kind: "bookshelf", x: 16, y: 10, h: 2 },
  { kind: "cabinet", x: 13, y: 12 },
  { kind: "desk", x: 15, y: 11, label: "資料", interact: { mode: "ranking", prompt: "国際比較を調べる" } },
  { kind: "plant", x: 16, y: 12 },
];

/** 会話できる大臣NPC（既存の ministers.ts に対応） */
export type NpcSpot = { ministerId: string; role: SpriteRole; x: number; y: number; dir: Dir };
export const npcSpots: NpcSpot[] = [
  { ministerId: "chief", role: "secretary", x: 2, y: 3, dir: "down" }, // 執務室（秘書官）
  { ministerId: "finance", role: "finance", x: 8, y: 1, dir: "down" }, // 閣議室
  { ministerId: "defense", role: "defense", x: 10, y: 1, dir: "down" }, // 閣議室
  { ministerId: "foreign", role: "foreign", x: 13, y: 2, dir: "right" }, // 応接室
  { ministerId: "welfare", role: "citizen", x: 11, y: 7, dir: "down" }, // 休憩（国民代表）
  { ministerId: "education", role: "business", x: 5, y: 12, dir: "up" }, // 市場分析室（経済界）
];

/** 雰囲気づくりの非操作NPC（歩き回るオフィスの賑わい用） */
export type AmbientSpot = { role: SpriteRole; x: number; y: number };
export const ambientSpots: AmbientSpot[] = [
  { role: "worker", x: 4, y: 7 }, // 廊下
  { role: "press", x: 10, y: 11 }, // 広報室の記者
  { role: "worker", x: 14, y: 7 }, // 廊下
  { role: "secretary", x: 13, y: 6 }, // 廊下の案内
  { role: "worker", x: 2, y: 11 }, // 市場分析室の職員
];

export const playerStart = { x: 8, y: 7 };

/** グリッド座標を % 配置のCSSに変換 */
export function cellStyle(x: number, y: number, w = 1, h = 1) {
  return {
    left: `${(x / COLS) * 100}%`,
    top: `${(y / ROWS) * 100}%`,
    width: `${(w / COLS) * 100}%`,
    height: `${(h / ROWS) * 100}%`,
  };
}

export const DIR_VEC: Record<Dir, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 }, down: { dx: 0, dy: 1 }, left: { dx: -1, dy: 0 }, right: { dx: 1, dy: 0 },
};
