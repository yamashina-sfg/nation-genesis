import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { GameMode, NationStats, PlayerNation } from "../types/game";

/**
 * 大統領執務室の背景画像（PC版＆スマホ版）。
 * src/assets/president-office.png … PC・タブレット
 * src/assets/president-office.smartphone.png … スマホ
 * import.meta.glob で読み込み。無い場合は undefined になり、CSSフォールバック背景になる（ビルドは壊れない）。
 */
const bgModules = import.meta.glob("../assets/president-office*.png", {
  eager: true,
  query: "?url",
  import: "default",
});
const pcBg = Object.entries(bgModules).find(([k]) => !k.includes("smartphone"))?.[1] as
  | string
  | undefined;
const spBg = Object.entries(bgModules).find(([k]) => k.includes("smartphone"))?.[1] as
  | string
  | undefined;

// 画像の縦横比（ホットスポットの位置合わせに使う）
const PC_AR = 1536 / 1024; // 1.5（横長）
const SP_AR = 853 / 1844; // 0.46（縦長）

type HotspotTarget = GameMode | "next" | "dialogue" | "agenda";

type Hotspot = {
  id: string;
  label: string;
  sub: string;
  icon: string;
  target: HotspotTarget;
  /** マーカーの中心位置（%）。背景画像に合わせて微調整できます */
  x: number;
  y: number;
};

/* ===== PC版（横長画像）のホットスポット位置 ===== */
const desktopHotspots: Hotspot[] = [
  { id: "desk", label: "執務机", sub: "政策", icon: "🗂️", target: "policies", x: 49, y: 60 },
  { id: "phone", label: "電話", sub: "外交", icon: "☎️", target: "map", x: 60, y: 50 },
  { id: "tv", label: "ニュース", sub: "記者会見", icon: "📺", target: "news", x: 9, y: 30 },
  { id: "pc", label: "市場", sub: "証券取引所", icon: "📈", target: "market", x: 91, y: 30 },
  { id: "globe", label: "世界地図", sub: "国際情勢", icon: "🌐", target: "map", x: 87, y: 52 },
  { id: "sofa", label: "国民の声", sub: "国民との対話", icon: "🗣️", target: "dialogue", x: 16, y: 74 },
  { id: "docs", label: "本日の課題", sub: "今日やること", icon: "📋", target: "agenda", x: 12, y: 47 },
];

/* ===== スマホ版（縦長画像）のホットスポット位置 ===== */
const mobileHotspots: Hotspot[] = [
  { id: "desk", label: "政策", sub: "閣議室", icon: "🗂️", target: "policies", x: 50, y: 50 },
  { id: "phone", label: "外交", sub: "首脳会談", icon: "☎️", target: "map", x: 64, y: 44 },
  { id: "tv", label: "ニュース", sub: "記者会見", icon: "📺", target: "news", x: 11, y: 24 },
  { id: "pc", label: "市場", sub: "取引所", icon: "📈", target: "market", x: 88, y: 22 },
  { id: "globe", label: "地図", sub: "国際情勢", icon: "🌐", target: "map", x: 88, y: 33 },
  { id: "sofa", label: "国民の声", sub: "対話", icon: "🗣️", target: "dialogue", x: 22, y: 78 },
  { id: "docs", label: "本日の課題", sub: "やること", icon: "📋", target: "agenda", x: 16, y: 40 },
];

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

/** 画面幅でスマホ判定（リサイズ・回転に追従） */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia(`(max-width:${breakpoint}px)`).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint}px)`);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, [breakpoint]);
  return isMobile;
}

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
  const isMobile = useIsMobile();
  const [modal, setModal] = useState<null | "dialogue" | "agenda" | "settings">(null);
  const [toast, setToast] = useState<string | null>(null);

  const bg = isMobile ? spBg ?? pcBg : pcBg;
  const ar = isMobile && spBg ? SP_AR : PC_AR;
  const hotspots = isMobile ? mobileHotspots : desktopHotspots;

  function go(t: HotspotTarget) {
    if (t === "next") return onNextTurn();
    if (t === "dialogue") return setModal("dialogue");
    if (t === "agenda") return setModal("agenda");
    return onNavigate(t);
  }

  function handleSave() {
    try {
      localStorage.setItem(
        "kokka-save",
        JSON.stringify({ leaderName, nation: nation.name, year, month, stats, savedAt: Date.now() }),
      );
      setToast("進行状況を記録しました");
    } catch {
      setToast("保存できませんでした");
    }
    setTimeout(() => setToast(null), 2200);
  }

  // 国民の声（状態から生成）
  const citizenVoices = buildCitizenVoices(stats);
  // 本日の課題（状態から生成）
  const agenda = buildAgenda(stats);

  return (
    <div className="office-stage">
      <div
        className={`office-hub ${bg ? "has-bg" : "no-bg"}`}
        style={
          {
            backgroundImage: bg ? `url(${bg})` : undefined,
            "--office-ar": String(ar),
          } as CSSProperties
        }
      >
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
              <span className="hub-approval">支持率 <b>{Math.round(stats.approval)}</b></span>
              <span className="hub-date">{year}年{month}月</span>
              <span className={`hub-crisis ${crisisLevel === "警戒" ? "danger" : "safe"}`}>
                {crisisLevel === "警戒" ? "⚠ 警戒" : "✓ 安定"}
              </span>
            </div>
          </div>
        </div>

        {/* 右上：未処理イベント＋緊急ニュース */}
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

        {/* 家具の上の見えるボタン（マーカー） */}
        {hotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`room-marker marker-${h.id} ${isMobile ? "mobile" : ""}`}
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

        {/* 下部クイックメニュー */}
        <div className="hub-quickbar">
          <button type="button" onClick={() => onNavigate("ranking")}><span>🏆</span>ランキング</button>
          <button type="button" onClick={handleSave}><span>💾</span>セーブ</button>
          <button type="button" onClick={() => setModal("settings")}><span>⚙️</span>設定</button>
        </div>

        {toast && <div className="hub-toast">{toast}</div>}
      </div>

      {/* ===== モーダル群 ===== */}
      {modal === "dialogue" && (
        <HubModal title="国民との対話" subtitle="街に出て、国民の生の声を聞く" onClose={() => setModal(null)}>
          <div className="dialogue-list">
            {citizenVoices.map((v, i) => (
              <div key={i} className="dialogue-voice">
                <span className="dialogue-avatar">{v.face}</span>
                <div>
                  <span className="dialogue-who">{v.who}</span>
                  <p>「{v.text}」</p>
                </div>
              </div>
            ))}
          </div>
          <p className="hub-modal-note">国民の声は、政策やイベントの結果で変わっていきます。</p>
        </HubModal>
      )}

      {modal === "agenda" && (
        <HubModal title="本日の課題" subtitle="秘書官アヤがまとめた、今日の優先事項" onClose={() => setModal(null)}>
          <div className="agenda-list">
            {agenda.map((a, i) => (
              <div key={i} className={`agenda-item pri-${a.level}`}>
                <span className="agenda-rank">{i + 1}</span>
                <div>
                  <strong>{a.title}</strong>
                  <small>{a.hint}</small>
                </div>
              </div>
            ))}
          </div>
          <p className="hub-modal-note">「執務机」から政策を、「電話」から外交を進められます。</p>
        </HubModal>
      )}

      {modal === "settings" && (
        <HubModal title="設定" subtitle="ゲームの管理" onClose={() => setModal(null)}>
          <div className="settings-list">
            <div className="settings-row">
              <div><strong>現在のプレイ</strong><small>{nation.name} ・ {leaderName} ・ {year}年{month}月</small></div>
            </div>
            <button type="button" className="settings-btn" onClick={handleSave}>💾 セーブする</button>
            <button
              type="button"
              className="settings-btn danger"
              onClick={() => {
                if (confirm("最初からやり直しますか？（現在の進行は失われます）")) {
                  window.location.reload();
                }
              }}
            >
              ↺ タイトルに戻る（最初から）
            </button>
          </div>
        </HubModal>
      )}
    </div>
  );
}

/* ===== 補助コンポーネント ===== */
function HubModal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="hub-modal-overlay" onClick={onClose}>
      <div className="hub-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hub-modal-head">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <button type="button" className="hub-modal-close" onClick={onClose} aria-label="閉じる">✕</button>
        </div>
        <div className="hub-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ===== 状態からテキストを生成 ===== */
function buildCitizenVoices(stats: NationStats) {
  const voices: { who: string; face: string; text: string }[] = [];
  if (stats.inflation > 5) voices.push({ who: "主婦 ", face: "😟", text: "物価が高くて、毎日の買い物がつらいです。なんとかしてください。" });
  if (stats.unemployment > 7) voices.push({ who: "若者", face: "😔", text: "仕事が見つかりません。将来が不安です。" });
  if (stats.approval >= 60) voices.push({ who: "会社員", face: "😊", text: "今の政権、よくやってくれていると思います。応援しています。" });
  if (stats.happiness < 45) voices.push({ who: "高齢者", face: "😞", text: "暮らしが楽になった実感がありません。年金が心配です。" });
  if (stats.environment < 45) voices.push({ who: "学生", face: "😣", text: "環境のことも、もっと考えてほしいです。" });
  if (voices.length === 0)
    voices.push({ who: "市民", face: "🙂", text: "今のところ、暮らしは落ち着いています。この調子でお願いします。" });
  return voices.slice(0, 3);
}

function buildAgenda(stats: NationStats) {
  const items: { title: string; hint: string; level: "high" | "mid" }[] = [];
  if (stats.budget < 0) items.push({ title: "財政赤字の立て直し", hint: "増税や緊縮で予算を確保しましょう", level: "high" });
  if (stats.inflation > 6) items.push({ title: "物価高への対応", hint: "金利引き上げで物価を冷ましましょう", level: "high" });
  if (stats.unemployment > 7) items.push({ title: "雇用の立て直し", hint: "インフラ・教育投資で仕事を増やしましょう", level: "mid" });
  if (stats.approval < 40) items.push({ title: "支持率の回復", hint: "減税や福祉で国民の暮らしを支えましょう", level: "high" });
  if (stats.trust < 45) items.push({ title: "外交関係の改善", hint: "電話から首脳会談を始めましょう", level: "mid" });
  if (items.length === 0)
    items.push({ title: "成長への投資", hint: "研究開発や教育で国の将来を強くしましょう", level: "mid" });
  return items.slice(0, 4);
}
