import { statLabels, statEasy } from "../data/stats";
import { deltaEvent } from "../utils/flavor";
import type { ActionResult, StatKey } from "../types/game";

type ResultOverlayProps = {
  result: ActionResult;
  year: number;
  month: number;
  onClose: () => void;
};

const STAT_ICONS: Partial<Record<StatKey, string>> = {
  approval: "★",
  happiness: "♥",
  gdp: "$",
  budget: "¥",
  military: "⚔",
  technology: "⚙",
  trust: "◆",
  environment: "♣",
  unemployment: "▼",
  inflation: "~",
};

export function ResultOverlay({ result, year, month, onClose }: ResultOverlayProps) {
  const positiveDeltas = result.deltas.filter((d) => d.amount > 0);
  const negativeDeltas = result.deltas.filter((d) => d.amount < 0);

  return (
    <div className="result-overlay" onClick={onClose}>
      <div className="result-overlay-card" onClick={(e) => e.stopPropagation()}>

        {/* ヘッダー */}
        <div className="ro-header">
          <div className="ro-header-meta">
            <span className="ro-tag">📋 実行結果</span>
            <span className="ro-date">{year}年{month}月</span>
          </div>
          <h2 className="ro-title">{result.title}</h2>
          <p className="ro-body">{result.body}</p>
        </div>

        {/* いま国で起きていること（出来事として体感） */}
        {result.deltas.length > 0 && (
          <div className="ro-section">
            <p className="ro-section-label">国でいま起きていること</p>
            <div className="ro-happenings">
              {result.deltas.map((delta) => {
                const pos = delta.amount > 0;
                return (
                  <div key={`ev-${delta.key}`} className={`ro-happening ${pos ? "pos" : "neg"}`}>
                    <span className="ro-happening-dot">{pos ? "▲" : "▼"}</span>
                    <span>{deltaEvent(delta.key, delta.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* くわしい数字（指標の変化）— 裏側の数値 */}
        {result.deltas.length > 0 && (
          <details className="ro-section ro-numbers">
            <summary className="ro-section-label">くわしい数字を見る（上級者向け）</summary>
            <div className="ro-deltas">
              {result.deltas.map((delta) => {
                const pos = delta.amount > 0;
                const icon = STAT_ICONS[delta.key] ?? "•";
                return (
                  <div key={`${delta.key}-${delta.reason}`} className={`ro-delta ${pos ? "pos" : "neg"}`}>
                    <div className="ro-delta-head">
                      <span className="ro-delta-icon">{icon}</span>
                      <span className="ro-delta-name">{statEasy[delta.key]}<small>（{statLabels[delta.key]}）</small></span>
                      <span className="ro-delta-amount">
                        {pos ? "+" : ""}{delta.amount}
                      </span>
                    </div>
                    <p className="ro-delta-reason">{delta.reason}</p>
                  </div>
                );
              })}
            </div>
          </details>
        )}

        {/* メリット・デメリット */}
        {(result.benefits.length > 0 || result.drawbacks.length > 0) && (
          <div className="ro-pros-cons">
            {result.benefits.length > 0 && (
              <div className="ro-pros">
                <p className="ro-section-label">✓ メリット</p>
                {result.benefits.map((b) => (
                  <div key={b} className="ro-pro-item">• {b}</div>
                ))}
              </div>
            )}
            {result.drawbacks.length > 0 && (
              <div className="ro-cons">
                <p className="ro-section-label">✗ デメリット</p>
                {result.drawbacks.map((d) => (
                  <div key={d} className="ro-con-item">• {d}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 大臣コメント */}
        {result.comments.length > 0 && (
          <div className="ro-section">
            <p className="ro-section-label">大臣コメント</p>
            <div className="ro-comments">
              {result.comments.map((c) => (
                <div key={`${c.characterId}-${c.text}`} className="ro-comment">
                  <div className="ro-comment-who">
                    <span className="ro-comment-role">{c.role}</span>
                    <strong className="ro-comment-name">{c.name}</strong>
                  </div>
                  <p className="ro-comment-text">「{c.text}」</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 閉じるボタン */}
        <button type="button" className="ro-close-btn" onClick={onClose}>
          確認しました　▶
        </button>

        <p className="ro-dismiss-hint">画面外をクリックしても閉じます</p>
      </div>
    </div>
  );
}
