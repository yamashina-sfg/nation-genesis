/**
 * 1ターン＝1日のための簡易カレンダー。
 * うるう年や月末を JS の Date に任せて正しく日付を進める。
 */
export type GameDate = { year: number; month: number; day: number };

export function addDays(date: GameDate, n: number): GameDate {
  const d = new Date(date.year, date.month - 1, date.day);
  d.setDate(d.getDate() + n);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function weekday(date: GameDate): string {
  const d = new Date(date.year, date.month - 1, date.day);
  return WEEKDAYS[d.getDay()];
}

export function formatDate(date: GameDate): string {
  return `${date.year}年${date.month}月${date.day}日`;
}
