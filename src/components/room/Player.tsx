import { cellStyle, type Dir } from "../../data/roomLayout";
import { PixelSprite } from "./PixelSprite";

type Props = { x: number; y: number; dir: Dir };

/** プレイヤー（大統領）。ドット絵スプライト。 */
export function Player({ x, y, dir }: Props) {
  return (
    <div
      className="room-player"
      style={{ ...cellStyle(x, y), transform: dir === "left" ? "scaleX(-1)" : undefined }}
    >
      <PixelSprite role="president" />
    </div>
  );
}
