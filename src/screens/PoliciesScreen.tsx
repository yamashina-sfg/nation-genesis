import { statLabels } from "../data/stats";
import type { Policy, StatKey } from "../types/game";

type PoliciesScreenProps = {
  policies: Policy[];
  rate: number;
  selectedPolicyIds: string[];
  onRateChange: (rate: number) => void;
  onRateAction: (direction: "hike" | "cut") => void;
  onTogglePolicy: (id: string) => void;
  onAdvanceTurn: () => void;
};

export function PoliciesScreen({
  policies,
  rate,
  selectedPolicyIds,
  onRateChange,
  onRateAction,
  onTogglePolicy,
  onAdvanceTurn,
}: PoliciesScreenProps) {
  const selectedPolicies = policies.filter((p) => selectedPolicyIds.includes(p.id));

  return (
    <section className="screen-layout">
      <div className="panel wide-panel">
        <div className="section-title">
          <span>政策を選択する</span>
          <strong style={{ color: selectedPolicyIds.length > 0 ? "var(--gold)" : "var(--text-muted)" }}>
            {selectedPolicyIds.length === 0
              ? "未選択"
              : `${selectedPolicyIds.length}/2 選択中`}
          </strong>
        </div>
        <p className="screen-hint">
          実行したい政策を最大2つ選んでください。右側の「<b>この政策を実行する</b>」ボタンで翌月に適用されます。
        </p>
        <div className="policy-grid">
          {policies.map((policy) => {
            const selected = selectedPolicyIds.includes(policy.id);
            const effects = [
              ...Object.entries(policy.short).map(([key, value]) => ({ key, value, term: "即時" })),
              ...Object.entries(policy.long).map(([key, value]) => ({ key, value, term: "長期" })),
            ];
            return (
              <button
                className={selected ? "policy-card selected" : "policy-card"}
                key={policy.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onTogglePolicy(policy.id)}
              >
                {selected && <span className="policy-check">✓ 選択中</span>}
                <span className="policy-field">{policy.field}</span>
                <strong>{policy.name}</strong>
                <div className="policy-effects">
                  {effects.slice(0, 4).map((eff) => (
                    <em
                      key={`${eff.term}-${eff.key}`}
                      className={Number(eff.value) >= 0 ? "pos" : "neg"}
                    >
                      {statLabels[eff.key as StatKey] ?? eff.key}{" "}
                      {Number(eff.value) >= 0 ? "+" : ""}
                      {eff.value}
                    </em>
                  ))}
                </div>
                <small>{policy.lesson}</small>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="panel central-bank">
        {/* 実行ボタンエリア */}
        <div className="execute-area">
          <div className="execute-selected">
            <p className="execute-label">実行する政策</p>
            {selectedPolicies.length === 0 ? (
              <p className="execute-empty">← カードを選択してください</p>
            ) : (
              <div className="execute-policy-list">
                {selectedPolicies.map((p) => (
                  <div key={p.id} className="execute-policy-item">
                    <span>{p.field}</span>
                    <strong>{p.name}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className={`execute-btn ${selectedPolicies.length === 0 ? "disabled" : ""}`}
            type="button"
            onClick={onAdvanceTurn}
            disabled={false}
          >
            <span className="execute-btn-icon">▶</span>
            <span className="execute-btn-text">
              {selectedPolicies.length === 0
                ? "政策なしで翌月へ進む"
                : "この政策を実行して翌月へ"}
            </span>
            <span className="execute-btn-sub">
              {new Date().getFullYear()}年 → 結果はニュースに記録
            </span>
          </button>
        </div>

        <div className="policy-divider" />

        {/* 金融政策 */}
        <div className="section-title" style={{ marginBottom: 10 }}>
          <span>中央銀行 / 金融政策</span>
          <strong>金利 {rate.toFixed(1)}%</strong>
        </div>
        <input
          aria-label="政策金利"
          max="6"
          min="0"
          step="0.25"
          type="range"
          value={rate}
          onChange={(event) => onRateChange(Number(event.target.value))}
        />
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 10px" }}>
          {rate >= 4
            ? "利上げ: 物価を冷ますが成長と株価に逆風"
            : rate <= 1.5
              ? "利下げ: 景気・株価を押し上げるがインフレリスク"
              : "中立: 景気と物価のバランスを維持"}
        </p>
        <div className="rate-actions">
          <button type="button" className="rate-btn hike" onClick={() => onRateAction("hike")}>
            金利を上げる
            <small>インフレ抑制 / 銀行株↑</small>
          </button>
          <button type="button" className="rate-btn cut" onClick={() => onRateAction("cut")}>
            金利を下げる
            <small>景気刺激 / 成長株↑</small>
          </button>
        </div>
      </aside>
    </section>
  );
}
