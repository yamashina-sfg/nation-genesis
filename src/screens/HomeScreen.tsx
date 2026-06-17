import type { CSSProperties } from "react";
import type { GameMode, NationStats, PlayerNation } from "../types/game";

/**
 * 大統領執務室の背景画像。
 * src/assets/president-office.(png|jpg|webp) を置くと自動で読み込まれる。
 * ファイルが無い場合は import.meta.glob が空を返すので、CSSのフォールバック背景になる（ビルドは壊れない）。
 */
const bgModules = import.meta.glob("../assets/president-office.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});
const officeBg = Object.values(bgModules)[0] as string | undefined;

type HomeScreenProps = {
  nation: PlayerNation;
  leaderName: string;
  professionLabel: string;
  stats: NationStats;
  crisisLevel: string;
  year: number;
  month: number;
  latestNewsTitle?: string;
  pendingCount: number;
  onNavigate: (mode: GameMode) => void;
  onNextTurn: () => void;
};

type Hotspot = {
  id: string;
  label: string;
  sub: string;
  icon: string;
  target: GameMode;
  /** 背景画像上の位置 (0-100%)。画像に合わせて微調整できる */
  x: number;
  y: number;
};

// 背景画像に合わせて x/y を調整してください
const hotspots: Hotspot[] = [
  { id: "desk", label: "執務机", sub: "政策・閣議", icon: "🗂️", target: "policies", x: 50, y: 74 },
  { id: "phone", label: "電話", sub: "外交", icon: "☎️", target: "map", x: 30, y: 66 },
  { id: "pc", label: "パソコン", sub: "市場", icon: "💻", target: "market", x: 64, y: 62 },
  { id: "tv", label: "テレビ", sub: "ニュース", icon: "📺", target: "news", x: 18, y: 34 },
  { id: "globe", label: "地球儀", sub: "世界地図", icon: "🌐", target: "map", x: 82, y: 60 },
];

export function HomeScreen({
  nation,
  leaderName,
  professionLabel,
  stats,
  crisisLevel,
  year,
  month,
  latestNewsTitle,
  pendingCount,
  onNavigate,
  onNextTurn,
}: HomeScreenProps) {
  return (
    <div
      className={`office-hub ${officeBg ? "has-bg" : "no-bg"}`}
      style={officeBg ? ({ backgroundImage: `url(${officeBg})` } as CSSProperties) : undefined}
    >
      {/* 上に乗せる薄い暗幕（文字を読みやすく） */}
      <div className="office-hub-scrim" />

      {/* 左上：大統領プロフィール */}
      <div className="hub-profile">
        <div
          className="hub-flag"
          style={{
            background: `linear-gradient(135deg, ${nation.flagPrimary} 0 45%, #f4f1e8 45% 55%, ${nation.flagAccent} 55% 100%)`,
          }}
        />
        <div className="hub-profile-text">
          <span className="hub-profile-role">{professionLabel}出身の大統領</span>
          <strong className="hub-profile-name">{leaderName}</strong>
          <div className="hub-profile-stats">
            <span className="hub-approval">
              支持率 <b>{Math.round(stats.approval)}</b>
            </span>
            <span className="hub-date">
              {year}年{month}月
            </span>
            <span className={`hub-crisis ${crisisLevel === "警戒" ? "danger" : "safe"}`}>
              {crisisLevel === "警戒" ? "⚠ 警戒" : "✓ 安定"}
            </span>
          </div>
        </div>
      </div>

      {/* 右上：緊急ニュース通知 + 未処理イベント */}
      <div className="hub-alerts">
        {pendingCount > 0 && (
          <button type="button" className="hub-alert pending" onClick={() => onNavigate("policies")}>
            <span className="hub-alert-badge">{pendingCount}</span>
            <div>
              <strong>未処理の案件</strong>
              <small>あなたの決断を待っています</small>
            </div>
          </button>
        )}
        <button type="button" className="hub-alert news" onClick={() => onNavigate("news")}>
          <span className="hub-alert-icon">📰</span>
          <div>
            <strong>緊急ニュース</strong>
            <small>{latestNewsTitle ?? "最新の動きはありません"}</small>
          </div>
        </button>
      </div>

      {/* 執務室のホットスポット */}
      {hotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          className={`hub-hotspot hotspot-${h.id}`}
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
          onClick={() => onNavigate(h.target)}
          aria-label={`${h.label}（${h.sub}）`}
        >
          <span className="hub-hotspot-ring" />
          <span className="hub-hotspot-chip">
            <span className="hub-hotspot-icon">{h.icon}</span>
            <span className="hub-hotspot-label">
              <b>{h.label}</b>
              <small>{h.sub}</small>
            </span>
          </span>
        </button>
      ))}

      {/* スマホ用：画像の上に重ねるアイコン操作バー */}
      <div className="hub-mobile-dock">
        {hotspots.map((h) => (
          <button key={h.id} type="button" className="hub-dock-btn" onClick={() => onNavigate(h.target)}>
            <span>{h.icon}</span>
            <small>{h.label}</small>
          </button>
        ))}
      </div>

      {/* 場所ラベル */}
      <div className="hub-location">🏛️ 大統領執務室 ・ 午前 8:00</div>

      {/* 翌月へ進めるフローティングボタン */}
      <button type="button" className="hub-next-turn" onClick={onNextTurn}>
        ▶ 翌月へ進める
      </button>
    </div>
  );
}
