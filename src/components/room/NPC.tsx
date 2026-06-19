import { cellStyle } from "../../data/roomLayout";
import type { Minister } from "../../data/ministers";

type Props = {
  minister: Minister;
  x: number;
  y: number;
  /** プレイヤーが近くにいる（会話できる）か */
  near: boolean;
  onTalk: () => void;
};

/** 大臣NPC。タップでも会話できる。 */
export function NPC({ minister, x, y, near, onTalk }: Props) {
  return (
    <div
      className={`room-npc ${near ? "near" : ""}`}
      style={{ ...cellStyle(x, y), pointerEvents: "auto", cursor: "pointer" }}
      onClick={onTalk}
      title={`${minister.title} ${minister.name}`}
    >
      {near && <span className="room-talk-cue" aria-hidden>💬</span>}
      <span className="room-npc-emoji" aria-hidden>{minister.emoji}</span>
      <span className="room-npc-name">{minister.title}</span>
    </div>
  );
}
