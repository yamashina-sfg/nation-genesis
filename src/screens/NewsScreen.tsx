import type { NewsItem } from "../types/game";
import { statLabels } from "../data/stats";

type NewsScreenProps = {
  news: NewsItem[];
};

export function NewsScreen({ news }: NewsScreenProps) {
  return (
    <section className="screen-layout">
      <div className="panel wide-panel">
        {/* 記者会見の演台 */}
        <div className="press-stage">
          <div className="press-flashes" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </div>
          <div className="press-podium">
            <span className="press-podium-emblem">🎤</span>
            <div className="press-podium-text">
              <strong>大統領記者会見</strong>
              <small>本日の出来事を国民に説明します</small>
            </div>
          </div>
        </div>
        <div className="section-title">
          <span>記者会見室 / 速報</span>
          <strong>動いた理由つき</strong>
        </div>
        <ol className="news-list">
          {news.map((item, index) => (
            <li key={`${item.title}-${index}`}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              {item.affectedNation && <em>{item.affectedNation}</em>}
              <p>{item.body}</p>
              {item.reason && <p className="news-reason">理由: {item.reason}</p>}
              {item.deltas && item.deltas.length > 0 && (
                <div className="delta-list">
                  {item.deltas.map((delta) => (
                    <small className={delta.amount >= 0 ? "positive" : "negative"} key={`${delta.key}-${delta.reason}`}>
                      {statLabels[delta.key]} {delta.amount >= 0 ? "+" : ""}
                      {delta.amount}: {delta.reason}
                    </small>
                  ))}
                </div>
              )}
              {item.comments && item.comments.length > 0 && (
                <div className="comment-stack">
                  {item.comments.map((comment) => (
                    <blockquote key={`${comment.characterId}-${comment.text}`}>
                      <b>{comment.role}</b>
                      {comment.text}
                    </blockquote>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
      <aside className="panel news-stand">
        <div className="section-title">
          <span>通信社</span>
          <strong>Genesis Wire</strong>
        </div>
        <p>
          ニュースは数字の変化理由を説明する学習導線です。イベント、政策、
          外交、株価の動きをここに集約します。
        </p>
      </aside>
    </section>
  );
}
