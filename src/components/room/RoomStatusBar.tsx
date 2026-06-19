import type { NationStats } from "../../types/game";

type Props = {
  year: number;
  eraShort: string;
  dayCount: number;
  level: number;
  stats: NationStats;
};

/** ゲーム画面に馴染む上部ステータスバー */
export function RoomStatusBar({ year, eraShort, dayCount, level, stats }: Props) {
  const item = (label: string, value: number, opts?: { warn?: boolean; good?: boolean; suffix?: string }) => (
    <span className={`room-stat ${opts?.warn ? "warn" : ""} ${opts?.good ? "good" : ""}`}>
      {label} <b>{Math.round(value)}{opts?.suffix ?? ""}</b>
    </span>
  );

  return (
    <div className="room-statusbar">
      <span className="room-era-chip">
        <b>{year}年</b>
        <small>{eraShort}・在任{dayCount}年</small>
      </span>
      <span className="room-stat good">Lv <b>{level}</b></span>
      {item("支持", stats.approval, { warn: stats.approval < 35, good: stats.approval >= 65 })}
      {item("幸福", stats.happiness, { warn: stats.happiness < 40 })}
      {item("財政", stats.budget, { warn: stats.budget < 20 })}
      {item("豊かさ", stats.gdp)}
      {item("外交", stats.trust, { warn: stats.trust < 35 })}
      {item("軍事", stats.military)}
    </div>
  );
}
