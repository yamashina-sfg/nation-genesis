import { characters } from "../data/characters";
import { TUTORIAL_STEPS } from "../data/tutorial";

type Props = {
  step: number;
  onNext: () => void;
  onSkip: () => void;
};

/**
 * 初回プレイの案内オーバーレイ。
 * 画面下部に案内役キャラクターの吹き出しを出し、「次へ」で進める。
 */
export function TutorialOverlay({ step, onNext, onSkip }: Props) {
  const data = TUTORIAL_STEPS[step];
  if (!data) return null;
  const speaker = characters.find((c) => c.id === data.speaker) ?? characters[0];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  return (
    <div className="tutorial-overlay" role="dialog" aria-label="チュートリアル">
      <button type="button" className="tutorial-skip" onClick={onSkip}>
        スキップ ▶▶
      </button>

      <div className="tutorial-box">
        <div className="tutorial-portrait" style={{ background: speaker.fallbackColor }}>
          <img src={speaker.image} alt={speaker.name} />
        </div>
        <div className="tutorial-text">
          <div className="tutorial-namebar">
            <span className="tutorial-name">{speaker.name}</span>
            <span className="tutorial-role">{speaker.title}</span>
          </div>
          <strong className="tutorial-title">{data.title}</strong>
          <p className="tutorial-line">{data.text}</p>
          {data.focus && <p className="tutorial-focus">👉 {data.focus}</p>}

          <div className="tutorial-foot">
            <span className="tutorial-progress">
              {TUTORIAL_STEPS.map((_, i) => (
                <i key={i} className={i <= step ? "on" : ""} />
              ))}
            </span>
            <button type="button" className="tutorial-next" onClick={onNext}>
              {isLast ? "はじめる ▶" : "次へ ▶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
