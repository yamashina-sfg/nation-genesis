import type { NationStats, PlayerNation } from "../types/game";
import { createFlag, formatStat } from "../utils/gameMath";

type NationHeaderProps = {
  nation: PlayerNation;
  year: number;
  month: number;
  crisisLevel: string;
  marketIndex: number;
  budget: number;
  stats: NationStats;
  onNationChange: (nation: PlayerNation) => void;
  onNextTurn: () => void;
};

const resources: { key: import("../types/game").StatKey; label: string; icon: string }[] = [
  { key: "approval", label: "支持率", icon: "👑" },
  { key: "happiness", label: "幸福度", icon: "😊" },
  { key: "gdp", label: "GDP", icon: "💰" },
  { key: "budget", label: "予算", icon: "🏦" },
  { key: "military", label: "軍事力", icon: "⚔️" },
  { key: "technology", label: "技術力", icon: "🔬" },
  { key: "trust", label: "外交", icon: "🤝" },
  { key: "environment", label: "環境", icon: "🌿" },
  { key: "unemployment", label: "失業率", icon: "📉" },
  { key: "inflation", label: "インフレ", icon: "📊" },
];

export function NationHeader({
  nation,
  year,
  month,
  crisisLevel,
  stats,
  onNationChange,
  onNextTurn,
}: NationHeaderProps) {
  return (
    <header className="app-header">
      {/* 上段: タイトル・国旗・状態 */}
      <div className="header-top">
        <div className="header-title-area">
          <span className="header-eyebrow">大統領シミュレーター</span>
          <h1 className="header-title">国家創世記</h1>
        </div>

        <div className="header-nation">
          <div
            className="header-flag"
            style={{ background: createFlag(nation.flagPrimary, nation.flagAccent) }}
          />
          <div className="header-nation-info">
            <input
              className="header-nation-name"
              value={nation.name}
              onChange={(e) => onNationChange({ ...nation, name: e.target.value })}
            />
            <div className="header-nation-meta">
              <select
                value={nation.doctrine}
                onChange={(e) => onNationChange({ ...nation, doctrine: e.target.value })}
              >
                <option>均衡成長</option>
                <option>技術立国</option>
                <option>福祉国家</option>
                <option>安全保障重視</option>
              </select>
              <span className={`crisis-badge ${crisisLevel === "警戒" ? "danger" : "safe"}`}>
                {crisisLevel === "警戒" ? "⚠️ 警戒" : "✅ 安定"}
              </span>
            </div>
          </div>
        </div>

        <div className="header-date-turn">
          <div className="header-date">
            <span className="header-year">{year}</span>
            <span className="header-month">年{month}月</span>
          </div>
          <button type="button" className="next-turn-btn" onClick={onNextTurn}>
            ▶ 翌月へ
          </button>
          <div className="header-flag-btns">
            <button type="button" onClick={() => onNationChange({ ...nation, flagPrimary: "#263f8f", flagAccent: "#d39b2c" })}>旗A</button>
            <button type="button" onClick={() => onNationChange({ ...nation, flagPrimary: "#14705e", flagAccent: "#b94545" })}>旗B</button>
          </div>
        </div>
      </div>

      {/* 下段: リソースバー (現代2スタイル) */}
      <div className="resource-bar">
        {resources.map(({ key, label, icon }) => {
          const val = stats[key];
          const isHighBad = key === "unemployment" || key === "inflation";
          const warn = isHighBad ? val > 7 : val < 30;
          return (
            <div key={key} className={`resource-item ${warn ? "warn" : ""}`}>
              <span className="resource-icon">{icon}</span>
              <div className="resource-info">
                <span className="resource-label">{label}</span>
                <span className={`resource-value ${warn ? "warn-text" : ""}`}>
                  {formatStat(key, val)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}
