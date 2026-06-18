/**
 * 大統領レベル（RPG的な成長）。
 * 政策成功・外交・危機対応・ミッション達成で経験値(XP)を得てレベルアップ。
 */

export const MAX_LEVEL = 30;

// レベルごとの称号（minレベル以上で適用、上から探す）
const levelTitles = [
  { min: 30, title: "伝説の国家元首" },
  { min: 25, title: "不動の指導者" },
  { min: 20, title: "世界的指導者" },
  { min: 16, title: "改革の旗手" },
  { min: 12, title: "敏腕大統領" },
  { min: 9, title: "国民的人気リーダー" },
  { min: 6, title: "頼れる大統領" },
  { min: 3, title: "期待の新星" },
  { min: 1, title: "新人大統領" },
];

/** レベルLに到達するのに必要な累計XP */
function totalXpForLevel(level: number): number {
  let acc = 0;
  for (let i = 1; i < level; i++) acc += 80 + (i - 1) * 30;
  return acc;
}

export type LevelInfo = {
  level: number;
  title: string;
  /** このレベル内で稼いだXP */
  inLevel: number;
  /** このレベルの必要XP幅 */
  span: number;
  atMax: boolean;
};

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  while (level < MAX_LEVEL && xp >= totalXpForLevel(level + 1)) level++;
  const base = totalXpForLevel(level);
  const next = level < MAX_LEVEL ? totalXpForLevel(level + 1) : base;
  const title = levelTitles.find((t) => level >= t.min)?.title ?? "新人大統領";
  return {
    level,
    title,
    inLevel: xp - base,
    span: Math.max(1, next - base),
    atMax: level >= MAX_LEVEL,
  };
}

/** XP獲得量の目安 */
export const XP = {
  policy: 15,
  diplomacy: 12,
  alliance: 25,
  turn: 6,
  mission: 25,
  eventChoice: 10,
};
