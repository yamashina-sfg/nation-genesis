import { StatGrid } from "../components/StatGrid";
import type { NationStats, PlayerNation } from "../types/game";

type StatusScreenProps = {
  nation: PlayerNation;
  stats: NationStats;
  year: number;
  month: number;
};

export function StatusScreen({ nation, stats, year, month }: StatusScreenProps) {
  const fiscalHealth = stats.budget > 80 ? "余力あり" : stats.budget > 0 ? "管理可能" : "赤字警戒";

  return (
    <section className="screen-layout">
      <div className="panel wide-panel">
        <div className="section-title">
          <span>国家ステータス</span>
          <strong>
            {year}年{month}月
          </strong>
        </div>
        <StatGrid stats={stats} />
      </div>
      <aside className="panel strategy-panel">
        <div className="section-title">
          <span>国家方針</span>
          <strong>{nation.doctrine}</strong>
        </div>
        <dl className="brief-list">
          <div>
            <dt>国家名</dt>
            <dd>{nation.name}</dd>
          </div>
          <div>
            <dt>財政</dt>
            <dd>{fiscalHealth}</dd>
          </div>
          <div>
            <dt>主要課題</dt>
            <dd>
              {stats.inflation > 6
                ? "物価対策"
                : stats.unemployment > 8
                  ? "雇用対策"
                  : "成長投資"}
            </dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
