import { cellStyle } from "../../data/roomLayout";
import { PixelSprite, type SpriteRole } from "./PixelSprite";
import type { Minister } from "../../data/ministers";

type Props = {
  minister: Minister;
  role: SpriteRole;
  x: number;
  y: number;
  near: boolean;
  onTalk: () => void;
};

/** 大臣NPC（ドット絵スプライト）。タップでも会話できる。 */
export function NPC({ minister, role, x, y, near, onTalk }: Props) {
  return (
    <div
      className={`room-npc ${near ? "near" : ""}`}
      style={{ ...cellStyle(x, y), pointerEvents: "auto", cursor: "pointer" }}
      onClick={onTalk}
      title={`${minister.title} ${minister.name}`}
    >
      {near && <span className="room-talk-cue" aria-hidden>!</span>}
      <span className="room-npc-name">{minister.title}</span>
      <PixelSprite role={role} />
    </div>
  );
}
