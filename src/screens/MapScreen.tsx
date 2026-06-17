import { CountryDetailCard } from "../components/CountryDetailCard";
import { WorldMap } from "../components/WorldMap";
import type { AINation, ActionResult } from "../types/game";

type DiplomacyAction = "trade" | "alliance" | "sanction" | "talks";

type MapScreenProps = {
  playerNationName: string;
  playerNationId?: string;
  nations: AINation[];
  selectedNationId: string;
  latestResult?: ActionResult;
  onSelectNation: (id: string) => void;
  onDiplomacy: (action: DiplomacyAction) => void;
};

const actionMeta: { id: DiplomacyAction; label: string; hint: string; emoji: string }[] = [
  { id: "trade", label: "貿易協定", hint: "GDP・物流に追い風 / 輸入依存リスク", emoji: "🤝" },
  { id: "talks", label: "首脳会談", hint: "信頼を安く積む / 即効性は低い", emoji: "🏛️" },
  { id: "alliance", label: "同盟交渉", hint: "抑止力が上昇 / 非同盟国が警戒", emoji: "⚔️" },
  { id: "sanction", label: "経済制裁", hint: "圧力をかける / 貿易と信用が痛む", emoji: "🚫" },
];

export function MapScreen({
  playerNationName,
  playerNationId,
  nations,
  selectedNationId,
  latestResult,
  onSelectNation,
  onDiplomacy,
}: MapScreenProps) {
  const selectedNation =
    nations.find((nation) => nation.id === selectedNationId) ?? nations[0];

  return (
    <div className="map-screen-layout">
      {/* 上段: 地図フルワイド */}
      <div className="panel wide-panel">
        <div className="section-title">
          <span>🌍 世界地図 / 外交</span>
          <strong>{selectedNation.name} を選択中</strong>
        </div>
        <WorldMap
          playerNationName={playerNationName}
          playerNationId={playerNationId}
          nations={nations}
          selectedNationId={selectedNationId}
          onSelectNation={onSelectNation}
          mode="game"
        />
        <div className="map-legend">
          <span><i className="legend-good" />友好 (協調)</span>
          <span><i className="legend-mid" />実務関係</span>
          <span><i className="legend-risk" />緊張</span>
          <span><i className="legend-player" />自国</span>
        </div>
        <div className="nation-switcher">
          {nations.map((nation) => (
            <button
              key={nation.id}
              type="button"
              className={nation.id === selectedNationId ? "active" : ""}
              onClick={() => onSelectNation(nation.id)}
            >
              {nation.name}
            </button>
          ))}
        </div>
      </div>

      {/* 下段: 国詳細 + 外交アクション */}
      <div className="map-bottom">
        {/* 選択中の国の情報 */}
        <div className="panel">
          <div className="section-title">
            <span>選択中の国</span>
            <strong>{selectedNation.relationStatus}</strong>
          </div>
          <CountryDetailCard country={selectedNation} />

          {latestResult && latestResult.affectedNation === selectedNation.name && (
            <div className="result-card" style={{ marginTop: 12 }}>
              <span>直近の外交結果</span>
              <strong>{latestResult.title}</strong>
              <p>{latestResult.body}</p>
              <div className="delta-list">
                {latestResult.deltas.map((delta) => (
                  <small
                    className={delta.amount >= 0 ? "positive" : "negative"}
                    key={`${delta.key}-${delta.reason}`}
                  >
                    {delta.amount >= 0 ? "+" : ""}
                    {delta.amount}: {delta.reason}
                  </small>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 外交アクション */}
        <div className="panel">
          <div className="section-title">
            <span>外交アクション</span>
            <strong>{selectedNation.name}</strong>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 14 }}>
            {selectedNation.name}に対して外交行動を実行します。結果はニュースと右パネルに記録されます。
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {actionMeta.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`diplo-action ${action.id}`}
                onClick={() => onDiplomacy(action.id)}
                title={action.hint}
              >
                <strong>
                  {action.emoji} {action.label}
                </strong>
                <small>{action.hint}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
