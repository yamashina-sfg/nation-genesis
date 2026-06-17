import { statLabels } from "../data/stats";
import { characters } from "../data/characters";
import type { NationStats, Policy, StatKey } from "../types/game";
import type { StockPrediction } from "../utils/predict";

type PolicyConfirmModalProps = {
  policy: Policy;
  predictedEffect: Partial<NationStats>;
  predictedStocks: StockPrediction[];
  onExecute: () => void;
  onCancel: () => void;
};

function charName(id: string) {
  const c = characters.find((x) => x.id === id);
  return { title: c?.title ?? "関係者", name: c?.name ?? "" };
}

function trend(amount: number): string {
  const a = Math.abs(amount);
  if (amount > 0) return a >= 8 ? "大きく上昇" : a >= 3 ? "上昇" : "やや上昇";
  return a >= 8 ? "大きく低下" : a >= 3 ? "低下" : "やや低下";
}

export function PolicyConfirmModal({
  policy,
  predictedEffect,
  predictedStocks,
  onExecute,
  onCancel,
}: PolicyConfirmModalProps) {
  const supporters = policy.voices.filter((v) => v.stance === "support");
  const opponents = policy.voices.filter((v) => v.stance === "oppose");
  const neutrals = policy.voices.filter((v) => v.stance === "neutral");

  const effectEntries = (Object.entries(predictedEffect) as [StatKey, number][]).filter(
    ([, v]) => Math.abs(v) >= 0.1,
  );
  const movingStocks = predictedStocks.filter((s) => s.dir !== "flat");

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-header">
          <span className="confirm-tag">政策の決断</span>
          <h2 className="confirm-title">{policy.name}</h2>
          <p className="confirm-summary">{policy.summary}</p>
        </div>

        {/* 関係者の声 */}
        <div className="confirm-section">
          <p className="confirm-section-label">閣僚・関係者の意見</p>
          <div className="voice-list">
            {[...supporters, ...neutrals, ...opponents].map((v) => {
              const c = charName(v.characterId);
              return (
                <div key={`${v.characterId}-${v.text}`} className={`voice-row ${v.stance}`}>
                  <div className="voice-stance">
                    {v.stance === "support" ? "賛成" : v.stance === "oppose" ? "反対" : "中立"}
                  </div>
                  <div className="voice-body">
                    <span className="voice-who">{c.title} {c.name}</span>
                    <p className="voice-text">「{v.text}」</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 予想される影響 */}
        <div className="confirm-section">
          <p className="confirm-section-label">予想される影響（国の指標）</p>
          <div className="predict-grid">
            {effectEntries.map(([key, amount]) => (
              <div key={key} className={`predict-item ${amount > 0 ? "pos" : "neg"}`}>
                <span className="predict-name">{statLabels[key]}</span>
                <span className="predict-trend">{trend(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 株価予想 */}
        {movingStocks.length > 0 && (
          <div className="confirm-section">
            <p className="confirm-section-label">予想される株価の動き</p>
            <div className="predict-grid">
              {movingStocks.map((s) => (
                <div key={s.id} className={`predict-item ${s.dir === "up" ? "pos" : "neg"}`}>
                  <span className="predict-name">{s.name}<small>（{s.sector}）</small></span>
                  <span className="predict-trend">{s.dir === "up" ? "上昇しそう" : "下落しそう"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 決断ボタン */}
        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" onClick={onCancel}>
            やめる
          </button>
          <button type="button" className="confirm-execute" onClick={onExecute}>
            この政策を実行する
          </button>
        </div>
      </div>
    </div>
  );
}
