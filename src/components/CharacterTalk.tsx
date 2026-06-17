import type { CSSProperties } from "react";
import { useState } from "react";
import type { Character } from "../types/game";

type CharacterTalkProps = {
  character: Character;
  text: string;
};

/** 画像が無い場合の高品質プレースホルダー (シルエット + 肩書き + 色) */
function CharacterAvatar({ character }: { character: Character }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="character-avatar placeholder"
        style={{ "--fallback": character.fallbackColor } as CSSProperties}
        aria-label={`${character.title} ${character.name}`}
      >
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="17" r="9" />
          <path d="M6 44c0-10 8-16 18-16s18 6 18 16Z" />
        </svg>
        <span className="avatar-initial">{character.name.slice(0, 1)}</span>
      </div>
    );
  }

  return (
    <div
      className="character-avatar"
      style={{ "--fallback": character.fallbackColor } as CSSProperties}
    >
      <img src={character.image} alt={character.name} onError={() => setFailed(true)} />
    </div>
  );
}

export default function CharacterTalk({ character, text }: CharacterTalkProps) {
  return (
    <div
      className="character-talk"
      style={{ "--tone": character.color } as CSSProperties}
    >
      <CharacterAvatar character={character} />
      <div className="character-talk-body">
        <p className="character-title">{character.title}</p>
        <h3>{character.name}</h3>
        <p className="character-role">{character.role}</p>
        <div className="speech-bubble">{text}</div>
      </div>
    </div>
  );
}
