import { CharacterDialogue } from "./CharacterDialogue";
import { statLabels } from "../data/stats";
import type { ActionResult, Character, NewsItem } from "../types/game";

type RightRailProps = {
  characters: Character[];
  speakerId: string;
  latestResult?: ActionResult;
  latestNews?: NewsItem;
  onSpeakerChange: (id: string) => void;
};

export function RightRail({
  characters,
  speakerId,
  latestResult,
  latestNews,
  onSpeakerChange,
}: RightRailProps) {
  return (
    <aside className="right-rail">
      <CharacterDialogue
        characters={characters}
        speakerId={speakerId}
        onSpeakerChange={onSpeakerChange}
      />
      {latestResult && (
        <section className="panel result-panel">
          <div className="section-title">
            <span>結果説明</span>
            <strong>{latestResult.affectedNation ?? "国内"}</strong>
          </div>
          <h2>{latestResult.title}</h2>
          <p>{latestResult.body}</p>
          <div className="delta-list">
            {latestResult.deltas.map((delta) => (
              <small
                className={delta.amount >= 0 ? "positive" : "negative"}
                key={`${delta.key}-${delta.reason}`}
              >
                {statLabels[delta.key]} {delta.amount >= 0 ? "+" : ""}
                {delta.amount}: {delta.reason}
              </small>
            ))}
          </div>
          <div className="pros-cons">
            <div>
              <b>メリット</b>
              {latestResult.benefits.map((benefit) => (
                <span key={benefit}>{benefit}</span>
              ))}
            </div>
            <div>
              <b>デメリット</b>
              {latestResult.drawbacks.map((drawback) => (
                <span key={drawback}>{drawback}</span>
              ))}
            </div>
          </div>
        </section>
      )}
      {latestNews && (
        <section className="panel mini-news">
          <div className="section-title">
            <span>最新ニュース</span>
            <strong>{latestNews.category}</strong>
          </div>
          <h2>{latestNews.title}</h2>
          <p>{latestNews.body}</p>
        </section>
      )}
    </aside>
  );
}
