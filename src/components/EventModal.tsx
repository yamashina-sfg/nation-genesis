import type { EventChoice, GameEvent, NationStats, StatKey } from "../types/game";
import { statLabels } from "../data/stats";

type EventModalProps = {
  event: GameEvent;
  onChoice: (choice: EventChoice) => void;
};

const categoryIcon: Record<string, string> = {
  政治: "🏛️",
  経済: "📊",
  外交: "🤝",
  市場: "📈",
  災害: "⚠️",
  技術: "🔬",
};

function EffectTag({ statKey, value }: { statKey: StatKey; value: number }) {
  const pos = value > 0;
  return (
    <span className={`effect-tag ${pos ? "pos" : "neg"}`}>
      {pos ? "+" : ""}
      {value} {statLabels[statKey]}
    </span>
  );
}

export function EventModal({ event, onChoice }: EventModalProps) {
  const icon = categoryIcon[event.category] ?? "📌";
  const choiceColors = ["choice-a", "choice-b", "choice-c"];

  return (
    <div className="event-overlay" role="dialog" aria-modal="true" aria-label={event.title}>
      <div className="event-modal">
        {/* ヘッダー */}
        <div className="event-modal-header">
          <span className="event-category-badge">
            {icon} {event.category}
          </span>
          <h2 className="event-title">{event.title}</h2>
          <p className="event-body">{event.body}</p>
        </div>

        {/* 選択肢 */}
        <div className="event-choices">
          <p className="event-choices-label">どう対応しますか？</p>
          {event.choices?.map((choice, index) => (
            <button
              key={choice.id}
              type="button"
              className={`event-choice-btn ${choiceColors[index] ?? ""}`}
              onClick={() => onChoice(choice)}
            >
              <div className="event-choice-top">
                <span className="event-choice-label">{choice.label}</span>
                <span className="event-choice-desc">{choice.description}</span>
              </div>
              <div className="event-choice-effects">
                {(Object.entries(choice.effect) as [StatKey, number][])
                  .filter(([, v]) => v !== 0)
                  .map(([k, v]) => (
                    <EffectTag key={k} statKey={k} value={v} />
                  ))}
              </div>
              <p className="event-choice-explanation">{choice.explanation}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
