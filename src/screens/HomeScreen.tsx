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
 * 画像内の「描かれたボタン」「家具」に重ねる透明ホットスポット。
 * president-office.png（1536×1024）のレイアウトに合わせた座標。
 */
const hotspots: Hotspot[] = [
  // 中央の執務机 → 政策（閣議室）
  { id: "desk", label: "執務机", sub: "政策・閣議室", target: "policies", x: 50, y: 50, w: 26, h: 22 },
  // 右メニューの「マップ」→ 外交・世界地図
  { id: "map", label: "マップ", sub: "外交・世界地図", target: "map", x: 91.5, y: 40, w: 13, h: 12 },
  // 右メニューの「スタッフ」→ 世界ランキング
  { id: "ranking", label: "ランキング", sub: "世界の順位", target: "ranking", x: 91.5, y: 53, w: 13, h: 12 },
  // 下バーの「経済」→ 証券取引所
  { id: "market", label: "経済", sub: "証券取引所", target: "market", x: 18, y: 92, w: 12, h: 11 },
  // 下バーの「ニュース」→ 記者会見室
  { id: "news", label: "ニュース", sub: "記者会見室", target: "news", x: 6.5, y: 92, w: 12, h: 11 },
  // 下バーの「国際関係」→ 外交
  { id: "intl", label: "国際関係", sub: "外交", target: "map", x: 44, y: 92, w: 13, h: 11 },
  // 右下の大きな「任務へ」→ 翌月へ進める
  { id: "next", label: "翌月へ", sub: "時間を進める", target: "next", x: 85, y: 92, w: 27, h: 11 },
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
