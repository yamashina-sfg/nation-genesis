import type { Minister } from "../../data/ministers";
import type { Policy } from "../../types/game";
import { PixelSprite } from "./PixelSprite";

export type DialogExtra = { label: string; sub?: string; onClick: () => void; primary?: boolean };

type Props = {
  minister: Minister;
  line: string;
  policies: Policy[];
  extras?: DialogExtra[];
  onPickPolicy: (policy: Policy) => void;
  onClose: () => void;
};

/** ポケモン風の下部会話ウィンドウ＋政策ボタン */
export function DialogBox({ minister, line, policies, extras = [], onPickPolicy, onClose }: Props) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <span className="dialog-portrait" style={{ background: minister.color }} aria-hidden>
            <PixelSprite role={minister.role} size={90} />
          </span>
          <span className="dialog-name">
            {minister.name}
            <small>{minister.title}</small>
          </span>
        </div>
        <p className="dialog-line">「{line}」</p>

        <div className="dialog-actions">
          {extras.length > 0 && <p className="dialog-actions-label">できること</p>}
          {extras.map((ex, i) => (
            <button key={`ex-${i}`} type="button" className={`dialog-btn ${ex.primary ? "primary" : ""}`} onClick={ex.onClick}>
              <span>{ex.label}</span>
              {ex.sub && <span className="dialog-btn-sub">{ex.sub}</span>}
            </button>
          ))}

          {policies.length > 0 ? (
            <>
              <p className="dialog-actions-label">提案できる政策</p>
              {policies.map((p) => (
                <button key={p.id} type="button" className="dialog-btn" onClick={() => onPickPolicy(p)}>
                  <span>{p.name}</span>
                  <span className="dialog-btn-sub">{p.summary.slice(0, 18)}…</span>
                </button>
              ))}
            </>
          ) : (
            extras.length === 0 && <p className="dialog-empty">いまの時代に提案できる政策はありません。</p>
          )}

          <button type="button" className="dialog-btn close" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
