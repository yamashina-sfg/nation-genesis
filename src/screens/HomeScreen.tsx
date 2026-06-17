import type { CSSProperties } from "react";
import type { GameMode, NationStats, PlayerNation } from "../types/game";

/**
 * 大統領執務室の背景画像。
 * src/assets/president-office.(png|jpg|webp) を置くと自動で読み込まれる。
 * 無い場合は import.meta.glob が空を返し、CSSフォールバック背景になる（ビルドは壊れない）。
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
  /** どの画面へ。"next" はターン進行 */
  target: GameMode | "next";
  /** 背景画像上のマーカー位置(中心x,y、%)。画像に合わせて微調整可 */
  x: number;
  y: number;
};

/**
 * 執務室の家具に置く「見えるボタン（マーカー）」。
 * president-office.png（1536×1024・UI無しのクリーンな執務室）に合わせた座標。
 * x,y はマーカーの中心位置（%）。画像に合わせて微調整できます。
 */
const hotspots: Hotspot[] = [
  // 中央の執務机 → 政策（閣議室）
  { id: "desk", label: "執務机", sub: "政策", icon: "🗂️", target: "policies", x: 49, y: 60 },
  // 机の上の黒い電話 → 外交（首脳会談）
  { id: "phone", label: "電話", sub: "外交", icon: "☎️", target: "map", x: 60, y: 50 },
  // 左壁の額縁（絵画）→ ニュース（記者会見）
  { id: "tv", label: "ニュース", sub: "記者会見", icon: "📺", target: "news", x: 9, y: 30 },
  // 右上の本棚 → 市場（証券取引所）
  { id: "shelf", label: "市場", sub: "証券取引所", icon: "📈", target: "market", x: 91, y: 30 },
  // 右の地球儀／キャビネット → 世界ランキング
  { id: "globe", label: "順位", sub: "世界ランキング", icon: "🌐", target: "ranking", x: 86, y: 53 },
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
  const go = (t: GameMode | "next") => (t === "next" ? onNextTurn() : onNavigate(t));

  return (
    <div className="office-stage">
      <div
        className={`office-hub ${officeBg ? "has-bg" : "no-bg"}`}
        style={officeBg ? ({ backgroundImage: `url(${officeBg})` } as CSSProperties) : undefined}
      >
        {/* 左上：大統領プロフィール（ライブ情報） */}
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
              <span className="hub-approval">支持率 <b>{Math.round(stats.approval)}</b></span>
              <span className="hub-date">{year}年{month}月</span>
              <span className={`hub-crisis ${crisisLevel === "警戒" ? "danger" : "safe"}`}>
                {crisisLevel === "警戒" ? "⚠ 警戒" : "✓ 安定"}
              </span>
            </div>
          </div>
        </div>

        {/* 右上：緊急ニュース／未処理イベント */}
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

        {/* 家具の上に置く見えるボタン（マーカー） */}
        {hotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`room-marker marker-${h.id}`}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => go(h.target)}
            aria-label={`${h.label}（${h.sub}）`}
          >
            <span className="room-marker-icon">{h.icon}</span>
            <span className="room-marker-text">
              <b>{h.label}</b>
              <small>{h.sub}</small>
            </span>
          </button>
        ))}

        {/* 場所ラベル */}
        <div className="hub-location">🏛️ 大統領執務室 ・ 午前 8:00</div>

        {/* 翌月へ進める */}
        <button type="button" className="hub-next-turn" onClick={onNextTurn}>
          ▶ 翌月へ進める
        </button>
      </div>

      {/* スマホ用：画像の上に重ねるアイコン操作ドック */}
      <div className="hub-mobile-dock">
        <button type="button" className="hub-dock-btn" onClick={() => onNavigate("policies")}><span>🗂️</span><small>政策</small></button>
        <button type="button" className="hub-dock-btn" onClick={() => onNavigate("map")}><span>🌐</span><small>外交</small></button>
        <button type="button" className="hub-dock-btn" onClick={() => onNavigate("market")}><span>📈</span><small>市場</small></button>
        <button type="button" className="hub-dock-btn" onClick={() => onNavigate("news")}><span>📺</span><small>ニュース</small></button>
        <button type="button" className="hub-dock-btn" onClick={() => onNavigate("ranking")}><span>🏆</span><small>順位</small></button>
        <button type="button" className="hub-dock-btn next" onClick={onNextTurn}><span>▶</span><small>翌月へ</small></button>
      </div>
    </div>
  );
}
