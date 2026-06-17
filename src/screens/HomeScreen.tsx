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
  /** どの画面へ。"next" はターン進行 */
  target: GameMode | "next";
  /** 背景画像上の矩形(中心x,y / 幅w / 高さh、すべて%)。画像に合わせて微調整可 */
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * 執務室の家具に重ねる透明ホットスポット。
 * president-office.png（1536×1024・UI無しのクリーンな執務室）のレイアウトに合わせた座標。
 * x,y は中心、w,h は大きさ（すべて%）。画像に合わせて微調整できます。
 */
const hotspots: Hotspot[] = [
  // 中央の執務机 → 政策（閣議室）
  { id: "desk", label: "執務机", sub: "政策・閣議室", target: "policies", x: 49, y: 55, w: 30, h: 15 },
  // 机の上の黒い電話 → 外交（首脳会談）
  { id: "phone", label: "電話", sub: "外交・首脳会談", target: "map", x: 57, y: 50, w: 8, h: 6 },
  // 左壁の額縁（絵画）→ ニュース（記者会見）
  { id: "tv", label: "絵画スクリーン", sub: "記者会見・ニュース", target: "news", x: 9, y: 29, w: 13, h: 17 },
  // 右上の本棚 → 市場（証券取引所）
  { id: "shelf", label: "本棚", sub: "証券取引所・市場", target: "market", x: 91, y: 29, w: 11, h: 18 },
  // 右の地球儀／キャビネット → 世界ランキング
  { id: "globe", label: "地球儀", sub: "世界の順位", target: "ranking", x: 86, y: 52, w: 12, h: 12 },
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

        {/* 画像のボタン・家具に重ねる透明ホットスポット */}
        {hotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`room-hotspot hotspot-${h.id}`}
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              width: `${h.w}%`,
              height: `${h.h}%`,
            }}
            onClick={() => go(h.target)}
            aria-label={`${h.label}（${h.sub}）`}
          >
            <span className="room-hotspot-label">
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
