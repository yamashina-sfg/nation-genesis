import { statLabels } from "../data/stats";
import type { Policy, StatKey } from "../types/game";

type PoliciesScreenProps = {
  policies: Policy[];
  rate: number;
  onRateChange: (rate: number) => void;
  onRateAction: (direction: "hike" | "cut") => void;
  /** 政策カードを押すと確認モーダルを開く */
  onRequestPolicy: (policy: Policy) => void;
  onAdvanceTurn: () => void;
};

export function PoliciesScreen({
  policies,
  rate,
  onRateChange,
  onRateAction,
  onRequestPolicy,
}: PoliciesScreenProps) {
  return (
    <section className="screen-layout">
      <div className="panel wide-panel">
        <div className="section-title">
          <span>政策を決断する</span>
          <strong>大統領の決断</strong>
        </div>
        <p className="screen-hint">
          実行したい政策をクリックすると、<b>閣僚や国民の賛成・反対の声</b>と<b>予想される影響</b>が表示されます。
          内容を確認して「実行する」を押すと、政策が実行されニュースになります。
        </p>
        <div className="policy-grid">
          {policies.map((policy) => {
            const effects = [
              ...Object.entries(policy.short).map(([key, value]) => ({ key, value })),
              ...Object.entries(policy.long).map(([key, value]) => ({ key, value })),
            ];
            return (
              <button
                className="policy-card"
                key={policy.id}
                type="button"
                onClick={() => onRequestPolicy(policy)}
              >
                <span className="policy-field">{policy.field}</span>
                <strong>{policy.name}</strong>
                <p className="policy-summary">{policy.summary}</p>
                <div className="policy-effects">
                  {effects.slice(0, 4).map((eff) => (
                    <em
                      key={`${eff.key}-${eff.value}`}
                      className={Number(eff.value) >= 0 ? "pos" : "neg"}
                    >
                      {statLabels[eff.key as StatKey] ?? eff.key}{" "}
                      {Number(eff.value) >= 0 ? "+" : ""}
                      {eff.value}
                    </em>
                  ))}
                </div>
                <span className="policy-cta">クリックして内容を確認 ▶</span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="panel central-bank">
        <div className="section-title" style={{ marginBottom: 10 }}>
          <span>中央銀行 / お金の借りやすさ</span>
          <strong>金利 {rate.toFixed(1)}%</strong>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 8px" }}>
          「お金の借りやすさ」（金利）の調整です。上げると物価上昇が落ち着き、下げると景気が元気になります。
        </p>
        <input
          aria-label="お金の借りやすさ（政策金利）"
          max="6"
          min="0"
          step="0.25"
          type="range"
          value={rate}
          onChange={(event) => onRateChange(Number(event.target.value))}
        />
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 10px" }}>
          {rate >= 4
            ? "高金利：物価を冷ますが、成長と株価には逆風。"
            : rate <= 1.5
              ? "低金利：景気・株価を押し上げるが、物価が上がりやすい。"
              : "中立：景気と物価のバランスを保つ水準。"}
        </p>
        <div className="rate-actions">
          <button type="button" className="rate-btn hike" onClick={() => onRateAction("hike")}>
            金利を上げる
            <small>物価↓ 銀行株↑ 成長株↓</small>
          </button>
          <button type="button" className="rate-btn cut" onClick={() => onRateAction("cut")}>
            金利を下げる
            <small>景気↑ 成長株↑ 物価↑</small>
          </button>
        </div>

        <div className="policy-divider" />
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
          政策・外交・金利を実行したら、ヘッダーの<b>「翌日へ進む」</b>で時間を進めましょう。
          世界や国内では、あなたの政策とは関係なく毎日いろいろな出来事が起き続けます。
        </p>
      </aside>
    </section>
  );
}
