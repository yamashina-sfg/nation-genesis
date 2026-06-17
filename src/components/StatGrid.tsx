import { statLabels } from "../data/stats";
import type { NationStats, StatKey } from "../types/game";
import { formatStat } from "../utils/gameMath";

const statKeys = Object.keys(statLabels) as StatKey[];

type StatGridProps = {
  stats: NationStats;
};

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="stat-grid">
      {statKeys.map((key) => (
        <div className="stat-card" key={key}>
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
  );
}
