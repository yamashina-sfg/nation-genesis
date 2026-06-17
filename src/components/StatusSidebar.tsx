import { statLabels } from "../data/stats";
import type { NationStats, StatKey } from "../types/game";
import { formatStat } from "../utils/gameMath";

const keys: StatKey[] = [
  "approval",
  "happiness",
  "gdp",
  "budget",
  "unemployment",
  "inflation",
  "trust",
  "military",
  "technology",
  "environment",
];

type StatusSidebarProps = {
  stats: NationStats;
};

export function StatusSidebar({ stats }: StatusSidebarProps) {
  return (
    <aside className="status-sidebar panel">
      <div className="section-title">
        <span>国家ステータス</span>
        <strong>月次指標</strong>
      </div>
      <div className="side-stat-list">
        {keys.map((key) => (
          <div key={key}>
            <span>{statLabels[key]}</span>
            <strong>{formatStat(key, stats[key])}</strong>
            <meter
              min={key === "budget" ? -80 : 0}
              max={key === "gdp" ? 1200 : key === "budget" ? 260 : 100}
              value={stats[key]}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
