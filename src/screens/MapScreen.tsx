import { CountryDetailCard } from "../components/CountryDetailCard";
import { WorldMap } from "../components/WorldMap";
import { diplomacyActions } from "../data/diplomacy";
import type { AINation, ActionResult } from "../types/game";

type MapScreenProps = {
  playerNationName: string;
  playerNationId?: string;
  nations: AINation[];
  selectedNationId: string;
  latestResult?: ActionResult;
  onSelectNation: (id: string) => void;
  onDiplomacy: (actionId: string) => void;
};

/** 友好度の段階ラベル */
function relationTier(relation: number): string {
  if (relation >= 90) return "同盟級（90+）";
  if (relation >= 70) return "緊密（70-89）";
  if (relation >= 50) return "良好（50-69）";
  if (relation >= 30) return "実務（30-49）";
  return "希薄（0-29）";
}

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

        {/* 外交アクション（友好度で段階解放） */}
        <div className="panel">
          <div className="section-title">
            <span>外交アクション</span>
            <strong>友好度 {selectedNation.relation} ・ {relationTier(selectedNation.relation)}</strong>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 12 }}>
            {selectedNation.name}との関係が深まるほど、できる外交が増えます。
            関係を積み重ねて、最終的には同盟を目指しましょう。
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {diplomacyActions.map((action) => {
              const locked = selectedNation.relation < action.minRelation;
              return (
                <button
                  key={action.id}
                  type="button"
                  className={`diplo-action ${action.id} ${locked ? "locked" : ""}`}
                  onClick={() => !locked && onDiplomacy(action.id)}
                  disabled={locked}
                  title={locked ? `友好度 ${action.minRelation} で解放` : action.hint}
                >
                  <strong>
                    {action.emoji} {action.label}
                    {locked && <span className="diplo-lock">🔒 友好度{action.minRelation}〜</span>}
                  </strong>
                  <small>{action.hint}</small>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
