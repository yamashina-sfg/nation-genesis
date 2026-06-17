import type { GameMode, NationStats, PlayerNation } from "../types/game";

type HomeScreenProps = {
  nation: PlayerNation;
  leaderName: string;
  stats: NationStats;
  crisisLevel: string;
  year: number;
  month: number;
  onNavigate: (mode: GameMode) => void;
};

type OfficeObject = {
  id: string;
  label: string;
  sub: string;
  icon: string;
  target: GameMode;
};

const objects: OfficeObject[] = [
  { id: "desk", label: "執務机", sub: "閣議・政策を決める", icon: "🗂️", target: "policies" },
  { id: "phone", label: "ホットライン", sub: "各国首脳と外交する", icon: "☎️", target: "map" },
  { id: "pc", label: "パソコン", sub: "証券取引所を見る", icon: "💻", target: "market" },
  { id: "tv", label: "テレビ", sub: "記者会見・ニュース", icon: "📺", target: "news" },
  { id: "globe", label: "地球儀", sub: "世界地図・国際情勢", icon: "🌐", target: "map" },
];

export function HomeScreen({
  nation,
  leaderName,
  stats,
  crisisLevel,
  year,
  month,
  onNavigate,
}: HomeScreenProps) {
  // 今日の報告書（やさしい言葉で要約）
  const fiscal = stats.budget > 80 ? "余力あり" : stats.budget > 0 ? "やりくり可能" : "赤字で危険";
  const topConcern =
    stats.inflation > 6 ? "物価高への対応" :
    stats.unemployment > 8 ? "雇用の立て直し" :
    stats.approval < 40 ? "支持率の回復" :
    stats.budget < 0 ? "財政の立て直し" :
    "成長への投資";
  const mood =
    stats.approval >= 60 ? "国民はあなたを信頼しています" :
    stats.approval >= 40 ? "国民はあなたを見極めています" :
    "国民の不満が高まっています";

  const secretaryLine =
    crisisLevel === "警戒"
      ? `大統領、おはようございます。${leaderName}大統領、今は難しい局面です。落ち着いて、優先順位をつけましょう。`
      : `大統領、おはようございます。本日の報告です。国内外、いくつか動きがあります。どこから手をつけますか？`;

  return (
    <div className="office">
      {/* 窓（都市の朝） */}
      <div className="office-window">
        <div className="office-skyline" />
        <div className="office-sun" />
      </div>

      {/* 国旗 */}
      <div className="office-flagstand">
        <div
          className="office-flag"
          style={{ background: `linear-gradient(135deg, ${nation.flagPrimary} 0 45%, #f4f1e8 45% 55%, ${nation.flagAccent} 55% 100%)` }}
        />
        <div className="office-flagpole" />
      </div>

      {/* 秘書の導入 */}
      <div className="office-secretary">
        <div className="office-secretary-avatar">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="17" r="9" />
            <path d="M6 44c0-10 8-16 18-16s18 6 18 16Z" />
          </svg>
        </div>
        <div className="office-secretary-bubble">
          <span className="office-secretary-name">秘書官 アヤ</span>
          <p>{secretaryLine}</p>
        </div>
      </div>

      {/* 今日の報告書 */}
      <div className="office-report">
        <div className="office-report-head">
          <span>本日の報告書</span>
          <strong>{year}年{month}月 ・ 情勢「{crisisLevel}」</strong>
        </div>
        <div className="office-report-grid">
          <div className="office-report-item">
            <span>支持率</span>
            <strong>{Math.round(stats.approval)}</strong>
            <small>{mood}</small>
          </div>
          <div className="office-report-item">
            <span>財政</span>
            <strong>{fiscal}</strong>
            <small>予算 {Math.round(stats.budget)}B</small>
          </div>
          <div className="office-report-item">
            <span>いま最優先の課題</span>
            <strong className="office-concern">{topConcern}</strong>
            <small>秘書官より</small>
          </div>
        </div>
      </div>

      {/* 執務室のオブジェクト */}
      <div className="office-objects">
        <p className="office-objects-hint">執務室のものをクリックして、大統領の仕事を始めましょう</p>
        <div className="office-objects-grid">
          {objects.map((obj) => (
            <button
              key={obj.id}
              type="button"
              className={`office-object obj-${obj.id}`}
              onClick={() => onNavigate(obj.target)}
            >
              <span className="office-object-icon">{obj.icon}</span>
              <strong>{obj.label}</strong>
              <small>{obj.sub}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
