import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { clearSave } from "../utils/save";
import type { Mission } from "../data/missions";
import type { GameMode, NationStats, PlayerNation } from "../types/game";

/**
 * 大統領執務室の背景画像（PC版＆スマホ版）。
 * src/assets/president-office.png … PC・タブレット
 * src/assets/president-office.smartphone.png … スマホ
 * 無い場合は undefined になり、CSSフォールバック背景になる（ビルドは壊れない）。
 */
const bgModules = import.meta.glob("../assets/president-office*.png", {
  eager: true,
  query: "?url",
  import: "default",
});
const pcBg = Object.entries(bgModules).find(([k]) => !k.includes("smartphone"))?.[1] as string | undefined;
const spBg = Object.entries(bgModules).find(([k]) => k.includes("smartphone"))?.[1] as string | undefined;

const PC_AR = 1536 / 1024;
const SP_AR = 1054 / 1492;

type ActionTarget = GameMode | "dialogue" | "agenda";

type HubAction = {
  id: string;
  label: string;
  sub: string;
  target: ActionTarget;
};

/** 執務室メニュー。整列して表示する（順番＝並び順） */
const actions: HubAction[] = [
  { id: "policies", label: "政策", sub: "閣議室", target: "policies" },
  { id: "diplomacy", label: "外交", sub: "首脳会談", target: "map" },
  { id: "market", label: "市場", sub: "証券取引所", target: "market" },
  { id: "news", label: "ニュース", sub: "記者会見", target: "news" },
  { id: "worldmap", label: "世界地図", sub: "国際情勢", target: "map" },
  { id: "dialogue", label: "国民の声", sub: "対話する", target: "dialogue" },
  { id: "agenda", label: "本日の課題", sub: "やること", target: "agenda" },
];

/** 統一感のあるSVGアイコン（絵文字に依存しない） */
function HubIcon({ id }: { id: string }) {
  const c = "currentColor";
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "policies": // 書類フォルダ
      return (<svg {...common}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M3 11h18" /></svg>);
    case "diplomacy": // 握手
      return (<svg {...common}><path d="m11 17 2 2a1 1 0 0 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 0 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 0 1-1.41 0l-.7-.7" /><path d="M5 8 2 11" /><path d="m22 11-3-3" /><path d="M7 18a1 1 0 0 0 1.4 0l.6-.6" /></svg>);
    case "market": // 棒グラフ＋上昇
      return (<svg {...common}><path d="M3 3v18h18" /><path d="m7 14 3-3 3 3 5-5" /><path d="M18 9h3v3" /></svg>);
    case "news": // 放送/会見マイク
      return (<svg {...common}><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M12 17v4" /><path d="M8 21h8" /></svg>);
    case "worldmap": // 地球
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" /></svg>);
    case "dialogue": // 吹き出し
      return (<svg {...common}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" /></svg>);
    case "agenda": // チェックリスト
      return (<svg {...common}><path d="M9 5h11" /><path d="M9 12h11" /><path d="M9 19h11" /><path d="m4 5 1 1 2-2" /><path d="m4 12 1 1 2-2" /><path d="m4 19 1 1 2-2" /></svg>);
    case "ranking":
      return (<svg {...common}><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v5a5 5 0 0 1-10 0Z" /><path d="M17 5h3v2a3 3 0 0 1-3 3" /><path d="M7 5H4v2a3 3 0 0 0 3 3" /></svg>);
    case "save":
      return (<svg {...common}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></svg>);
    case "settings":
      return (<svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.81 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 14H4a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 8.6l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 4.6V4a2 2 0 0 1 4 0v.09c0 .68.4 1.3 1 1.51" /></svg>);
    case "turn":
      return (<svg {...common}><polygon points="6 4 20 12 6 20 6 4" /></svg>);
    default:
      return null;
  }
}

type HomeScreenProps = {
  nation: PlayerNation;
  leaderName: string;
  professionLabel: string;
  playerTitle: string;
  achievementCount: number;
  level: number;
  xpInLevel: number;
  xpSpan: number;
  atMaxLevel: boolean;
  missions: Mission[];
  stats: NationStats;
  crisisLevel: string;
  year: number;
  month: number;
  day: number;
  dayCount: number;
  latestNewsTitle?: string;
  pendingCount: number;
  onNavigate: (mode: GameMode) => void;
  onNextTurn: () => void;
};

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia(`(max-width:${breakpoint}px)`).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint}px)`);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, [breakpoint]);
  return isMobile;
}

export function HomeScreen({
  nation,
  leaderName,
  professionLabel,
  playerTitle,
  achievementCount,
  level,
  xpInLevel,
  xpSpan,
  atMaxLevel,
  missions,
  stats,
  crisisLevel,
  year,
  month,
  day,
  dayCount,
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

  function go(t: ActionTarget) {
    if (t === "dialogue") return setModal("dialogue");
    if (t === "agenda") return setModal("agenda");
    return onNavigate(t);
  }

  function handleSave() {
    // 進行は常に自動保存されている。ここでは確認の表示のみ。
    setToast("セーブしました（この端末に自動保存されています）");
    setTimeout(() => setToast(null), 2200);
  }

  const citizenVoices = buildCitizenVoices(stats);
  const agenda = buildAgenda(stats);

  return (
    <div className="office-stage">
      <div
        className={`office-hub ${bg ? "has-bg" : "no-bg"}`}
        style={{ backgroundImage: bg ? `url(${bg})` : undefined, "--office-ar": String(ar) } as CSSProperties}
      >
        {/* 上部HUD：左にプロフィール、右に通知 */}
        <div className="hub-topbar">
          <div className="hub-profile">
            <div
              className="hub-flag"
              style={{ background: `linear-gradient(135deg, ${nation.flagPrimary} 0 45%, #f4f1e8 45% 55%, ${nation.flagAccent} 55% 100%)` }}
            />
            <div className="hub-profile-text">
              <span className="hub-profile-role">
                <span className="hub-lv-badge">Lv.{level}</span>
                <span className="hub-title-badge">{playerTitle}</span>
                {achievementCount > 0 && <span className="hub-achv-count">🏅{achievementCount}</span>}
              </span>
              <strong className="hub-profile-name">{leaderName}</strong>
              {/* 経験値バー */}
              <div className="hub-xp">
                <div className="hub-xp-bar">
                  <span style={{ width: atMaxLevel ? "100%" : `${Math.round((xpInLevel / xpSpan) * 100)}%` }} />
                </div>
                <small>{atMaxLevel ? "MAX" : `次のLvまで ${Math.max(0, xpSpan - xpInLevel)} XP`}</small>
              </div>
              <div className="hub-profile-stats">
                <span className="hub-approval">支持率 <b>{Math.round(stats.approval)}</b></span>
                <span className="hub-date">{year}年{month}月{day}日 ・ {dayCount}日目</span>
                <span className={`hub-crisis ${crisisLevel === "警戒" ? "danger" : "safe"}`}>
                  {crisisLevel === "警戒" ? "警戒" : "安定"}
                </span>
              </div>
            </div>
          </div>

          <div className="hub-alerts">
            {pendingCount > 0 && (
              <button type="button" className="hub-alert pending" onClick={() => onNavigate("policies")}>
                <span className="hub-alert-badge">{pendingCount}</span>
                <div><strong>未処理の案件</strong><small>決断を待っています</small></div>
              </button>
            )}
            <button type="button" className="hub-alert news" onClick={() => onNavigate("news")}>
              <span className="hub-alert-icon"><HubIcon id="news" /></span>
              <div><strong>緊急ニュース</strong><small>{latestNewsTitle ?? "最新の動きはありません"}</small></div>
            </button>
          </div>
        </div>

        {/* 整列した執務メニュー（PC=右縦一列 / スマホ=下グリッド） */}
        <nav className="hub-menu" aria-label="執務メニュー">
          {actions.map((a) => {
            const openMissions = a.id === "agenda" ? missions.filter((m) => !m.done).length : 0;
            return (
              <button key={a.id} type="button" className="hub-menu-btn" onClick={() => go(a.target)}>
                <span className="hub-menu-icon"><HubIcon id={a.id} /></span>
                <span className="hub-menu-text">
                  <b>{a.label}</b>
                  <small>{a.sub}</small>
                </span>
                {openMissions > 0 && <span className="hub-menu-badge">{openMissions}</span>}
              </button>
            );
          })}
        </nav>

        {/* 下部バー：翌月へ ＋ クイックメニュー */}
        <div className="hub-bottombar">
          <button type="button" className="hub-next-turn" onClick={onNextTurn}>
            <HubIcon id="turn" />
            <span>翌日へ進む</span>
          </button>
          <div className="hub-quickbar">
            <button type="button" onClick={() => onNavigate("ranking")}><HubIcon id="ranking" /><span>順位</span></button>
            <button type="button" onClick={handleSave}><HubIcon id="save" /><span>セーブ</span></button>
            <button type="button" onClick={() => setModal("settings")}><HubIcon id="settings" /><span>設定</span></button>
          </div>
        </div>

        <div className="hub-location">大統領執務室 ・ 午前 8:00</div>
        {toast && <div className="hub-toast">{toast}</div>}
      </div>

      {/* ===== モーダル ===== */}
      {modal === "dialogue" && (
        <HubModal title="国民との対話" subtitle="街に出て、国民の生の声を聞く" onClose={() => setModal(null)}>
          <div className="dialogue-list">
            {citizenVoices.map((v, i) => (
              <div key={i} className="dialogue-voice">
                <span className="dialogue-avatar">{v.face}</span>
                <div><span className="dialogue-who">{v.who}</span><p>「{v.text}」</p></div>
              </div>
            ))}
          </div>
          <p className="hub-modal-note">国民の声は、政策やイベントの結果で変わっていきます。</p>
        </HubModal>
      )}

      {modal === "agenda" && (
        <HubModal title="本日の課題" subtitle="達成すると経験値がもらえます（各 +25 XP）" onClose={() => setModal(null)}>
          {missions.length > 0 && (
            <div className="mission-list">
              {missions.map((m) => (
                <div key={m.id} className={`mission-item ${m.done ? "done" : ""}`}>
                  <span className="mission-check">{m.done ? "✔" : "□"}</span>
                  <div>
                    <strong>{m.label}</strong>
                    {m.done ? <small>達成しました！</small> : <small>{m.hint}</small>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="agenda-list">
            {agenda.map((a, i) => (
              <div key={i} className={`agenda-item pri-${a.level}`}>
                <span className="agenda-rank">{i + 1}</span>
                <div><strong>{a.title}</strong><small>{a.hint}</small></div>
              </div>
            ))}
          </div>
          <p className="hub-modal-note">「政策」から閣議を、「外交」から首脳会談を進められます。</p>
        </HubModal>
      )}

      {modal === "settings" && (
        <HubModal title="設定" subtitle="ゲームの管理" onClose={() => setModal(null)}>
          <div className="settings-list">
            <div className="settings-row">
              <div><strong>現在のプレイ</strong><small>{nation.name} ・ {leaderName} ・ {year}年{month}月</small></div>
            </div>
            <button type="button" className="settings-btn" onClick={handleSave}>進行状況をセーブする</button>
            <button
              type="button"
              className="settings-btn danger"
              onClick={() => { if (confirm("最初からやり直しますか？（保存した進行は消えます）")) { clearSave(); window.location.reload(); } }}
            >
              タイトルに戻る（最初から）
            </button>
          </div>
        </HubModal>
      )}
    </div>
  );
}

function HubModal({
  title, subtitle, children, onClose,
}: { title: string; subtitle: string; children: React.ReactNode; onClose: () => void }) {
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

function buildCitizenVoices(stats: NationStats) {
  const voices: { who: string; face: string; text: string }[] = [];
  if (stats.inflation > 5) voices.push({ who: "主婦", face: "😟", text: "物価が高くて、毎日の買い物がつらいです。なんとかしてください。" });
  if (stats.unemployment > 7) voices.push({ who: "若者", face: "😔", text: "仕事が見つかりません。将来が不安です。" });
  if (stats.approval >= 60) voices.push({ who: "会社員", face: "😊", text: "今の政権、よくやってくれていると思います。応援しています。" });
  if (stats.happiness < 45) voices.push({ who: "高齢者", face: "😞", text: "暮らしが楽になった実感がありません。年金が心配です。" });
  if (stats.environment < 45) voices.push({ who: "学生", face: "😣", text: "環境のことも、もっと考えてほしいです。" });
  if (voices.length === 0) voices.push({ who: "市民", face: "🙂", text: "今のところ暮らしは落ち着いています。この調子でお願いします。" });
  return voices.slice(0, 3);
}

function buildAgenda(stats: NationStats) {
  const items: { title: string; hint: string; level: "high" | "mid" }[] = [];
  if (stats.budget < 0) items.push({ title: "財政赤字の立て直し", hint: "増税や緊縮で予算を確保しましょう", level: "high" });
  if (stats.inflation > 6) items.push({ title: "物価高への対応", hint: "金利引き上げで物価を冷ましましょう", level: "high" });
  if (stats.unemployment > 7) items.push({ title: "雇用の立て直し", hint: "インフラ・教育投資で仕事を増やしましょう", level: "mid" });
  if (stats.approval < 40) items.push({ title: "支持率の回復", hint: "減税や福祉で国民の暮らしを支えましょう", level: "high" });
  if (stats.trust < 45) items.push({ title: "外交関係の改善", hint: "外交から首脳会談を始めましょう", level: "mid" });
  if (items.length === 0) items.push({ title: "成長への投資", hint: "研究開発や教育で国の将来を強くしましょう", level: "mid" });
  return items.slice(0, 4);
}
