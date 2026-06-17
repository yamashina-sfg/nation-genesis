import type { NationStats, PlayerNation, StatKey } from "../types/game";
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

// 絵文字の代わりにSVGアイコンを使う (Apple絵文字に依存しない)
function StatIcon({ statKey }: { statKey: StatKey }) {
  const size = 18;
  const color = "currentColor";

  switch (statKey) {
    case "approval":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    case "happiness":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "gdp":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "budget":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "military":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "technology":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07" />
        </svg>
      );
    case "trust":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "environment":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M17 8C8 10 5.9 16.17 3.82 19.82A12 12 0 0 0 12 22a9.9 9.9 0 0 0 7-2.82C21.4 17.15 23 12 17 8Z" />
          <path d="M3.82 19.82C5.19 12.59 10.93 9 17 8" />
        </svg>
      );
    case "unemployment":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
          <polyline points="16 17 22 17 22 11" />
        </svg>
      );
    case "inflation":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
  }
}

// ラベルはやさしい言葉。正式名称はホバー(title)で確認できる。
const resources: { key: StatKey; label: string; full: string }[] = [
  { key: "approval", label: "支持", full: "支持率" },
  { key: "happiness", label: "暮らし", full: "幸福度" },
  { key: "gdp", label: "豊かさ", full: "GDP（国内総生産）" },
  { key: "budget", label: "国の財布", full: "国家予算" },
  { key: "military", label: "守り", full: "軍事力" },
  { key: "technology", label: "技術", full: "技術力" },
  { key: "trust", label: "外交", full: "外交信用" },
  { key: "environment", label: "環境", full: "環境評価" },
  { key: "unemployment", label: "仕事", full: "失業率（低いほど良い）" },
  { key: "inflation", label: "物価", full: "インフレ率" },
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
                {crisisLevel === "警戒" ? "⚠ 警戒" : "✓ 安定"}
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

      {/* リソースバー — SVGアイコン */}
      <div className="resource-bar">
        {resources.map(({ key, label, full }) => {
          const val = stats[key];
          const isHighBad = key === "unemployment" || key === "inflation";
          const warn = isHighBad ? val > 7 : val < 30;
          return (
            <div key={key} className={`resource-item ${warn ? "warn" : ""}`} title={full}>
              <span className={`resource-icon-svg ${warn ? "warn-icon" : ""}`}>
                <StatIcon statKey={key} />
              </span>
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
