import { useState } from "react";
import { professions } from "../data/professions";
import type { PlayerProfile } from "../types/game";

type IntroScreenProps = {
  onComplete: (profile: PlayerProfile) => void;
};

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<"story" | "profile">("story");
  const [name, setName] = useState("");
  const [professionId, setProfessionId] = useState("office");

  const selectedProfession = professions.find((p) => p.id === professionId)!;

  if (phase === "story") {
    return (
      <div className="intro-screen">
        <div className="intro-story">
          <p className="intro-eyebrow">国家運営シミュレーション</p>
          <h1 className="intro-logo">国家創世記</h1>
          <p className="intro-catch">
            「一般人のあなたが、突然大統領になった。<br />
            ニュースで見る世界を、今度は<span>あなた</span>が動かす。」
          </p>
          <div className="intro-narrative">
            <p>ごく普通の毎日を送っていた、あなた。</p>
            <p>ある日、混乱する国家の<strong>大統領</strong>に、突然選ばれた。</p>
            <p>国は <em>財政赤字</em>、<em>物価高</em>、<em>失業</em>、そして <em>外交問題</em> を抱えている。</p>
            <p>国民の期待と不安を背負いながら、あなたは国家を運営していく――。</p>
          </div>
          <button type="button" className="intro-next-btn" onClick={() => setPhase("profile")}>
            物語を始める　▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="intro-screen">
      <div className="intro-profile">
        <p className="intro-eyebrow">あなたについて教えてください</p>
        <h2 className="intro-profile-title">大統領プロフィール</h2>

        <label className="intro-field">
          <span>あなたの名前</span>
          <input
            type="text"
            value={name}
            placeholder="例：山田 タロウ"
            maxLength={16}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="intro-field">
          <span>あなたの前職（特技が政策に影響します）</span>
          <div className="profession-grid">
            {professions.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`profession-card ${professionId === p.id ? "selected" : ""}`}
                onClick={() => setProfessionId(p.id)}
              >
                <strong>{p.label}</strong>
                <small>{p.blurb}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="intro-speech">
          <span className="intro-speech-label">就任演説プレビュー</span>
          <p>「{selectedProfession.speech}」</p>
        </div>

        <button
          type="button"
          className="intro-start-btn"
          onClick={() =>
            onComplete({
              name: name.trim() || "名もなき大統領",
              professionId,
            })
          }
        >
          次へ：運営する国を選ぶ　▶
        </button>
      </div>
    </div>
  );
}
