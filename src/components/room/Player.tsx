import { cellStyle, type Dir } from "../../data/roomLayout";

type Props = { x: number; y: number; dir: Dir };

/** プレイヤー（大統領）。後からスプライト画像に差し替え可能。 */
export function Player({ x, y, dir }: Props) {
  return (
    <div className={`room-player dir-${dir}`} style={cellStyle(x, y)}>
      <span className="room-player-emoji" aria-label="大統領">🤵</span>
    </div>
  );
}
