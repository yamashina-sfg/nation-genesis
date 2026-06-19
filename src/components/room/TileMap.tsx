import { COLS, ROWS, cellStyle, type RoomObject } from "../../data/roomLayout";
import type { ThemeDecor } from "../../data/roomThemes";

type Props = {
  objects: RoomObject[];
  /** 状態に応じた床の飾り（通り抜け可） */
  decor: ThemeDecor[];
};

/** 床・壁タイルと家具を描く（背景レイヤー） */
export function TileMap({ objects, decor }: Props) {
  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const isWall = x === 0 || x === COLS - 1 || y === 0 || y === ROWS - 1;
      const alt = (x + y) % 2 === 0;
      cells.push(
        <div
          key={`${x}-${y}`}
          className={`room-cell ${isWall ? "wall" : `floor${alt ? " alt" : ""}`}`}
        />,
      );
    }
  }

  return (
    <>
      <div
        className="room-tiles"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {cells}
      </div>
      <div className="room-layer">
        {objects.map((o, i) => (
          <div
            key={`${o.kind}-${i}`}
            className={`room-obj ${o.kind}${o.themedFlag ? " flag" : ""}`}
            style={cellStyle(o.x, o.y, o.w ?? 1, o.h ?? 1)}
            title={o.label}
          >
            {!o.themedFlag && <span aria-hidden>{o.emoji}</span>}
            <span className="room-obj-label">{o.label}</span>
          </div>
        ))}
        {decor.map((d, i) => (
          <div key={`decor-${i}`} className="room-decor" style={cellStyle(d.x, d.y)} title={d.label}>
            <span aria-hidden>{d.emoji}</span>
          </div>
        ))}
      </div>
    </>
  );
}
