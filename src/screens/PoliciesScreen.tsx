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
  return (
    <section className="screen-layout">
      <div className="panel wide-panel">
        <div className="section-title">
          <span>政策画面</span>
          <strong>選択 {selectedPolicyIds.length}/2</strong>
        </div>
        <p className="screen-hint">
          政策カードを最大2つ選び、「翌月へ進める」で実行します。効果はニュースと大臣コメントに記録されます。
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
        <div className="section-title">
          <span>中央銀行 / 金融政策</span>
          <strong>政策金利 {rate.toFixed(1)}%</strong>
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
        <p>
          {rate >= 4
            ? "利上げ局面: 物価を冷ますが、株価と雇用に逆風。"
            : rate <= 1.5
              ? "利下げ局面: 景気と株価を押し上げるが、インフレ圧力。"
              : "中立圏: 景気と物価のバランスを維持。"}
        </p>
        <div className="rate-actions">
          <button type="button" className="rate-btn hike" onClick={() => onRateAction("hike")}>
            金利を引き上げる
            <small>インフレ抑制 / 株価↓ 銀行株↑</small>
          </button>
          <button type="button" className="rate-btn cut" onClick={() => onRateAction("cut")}>
            金利を引き下げる
            <small>景気刺激 / 株価↑ インフレ↑</small>
          </button>
        </div>
        <button className="turn-button" type="button" onClick={onAdvanceTurn}>
          選択した政策で翌月へ進める ▶
        </button>
      </aside>
    </section>
  );
}
