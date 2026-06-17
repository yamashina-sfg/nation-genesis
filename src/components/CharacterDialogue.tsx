import type { CSSProperties } from "react";
import { useState } from "react";
import type { Character } from "../types/game";
import CharacterTalk from "./CharacterTalk";

type CharacterDialogueProps = {
  characters: Character[];
  speakerId: string;
  onSpeakerChange: (id: string) => void;
};

export function CharacterDialogue({
  characters,
  speakerId,
  onSpeakerChange,
}: CharacterDialogueProps) {
  const speaker = characters.find((character) => character.id === speakerId) ?? characters[0];
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <aside className="character-dialogue panel">
      <div className="section-title">
        <span>閣僚会議</span>
        <strong>{speaker.title}</strong>
      </div>
      <div className="character-roster">
        {characters.map((character) => (
          <button
            className={speaker.id === character.id ? "active" : ""}
            key={character.id}
            style={
              {
                "--tone": character.color,
                "--fallback": character.fallbackColor,
              } as CSSProperties
            }
            type="button"
            onClick={() => onSpeakerChange(character.id)}
            title={`${character.title} ${character.name}`}
          >
            {failedImages[character.id] ? (
              <b>{character.name.slice(0, 1)}</b>
            ) : (
              <img
                src={character.image}
                alt={character.name}
                onError={() =>
                  setFailedImages((current) => ({ ...current, [character.id]: true }))
                }
              />
            )}
            <span>{character.title}</span>
          </button>
        ))}
      </div>
      <CharacterTalk character={speaker} text={speaker.defaultComment} />
    </aside>
  );
}
