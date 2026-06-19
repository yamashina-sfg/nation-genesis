import { COLS, ROWS, WALL_MAP, roomAt, cellStyle, furniture, type Furniture } from "../../data/roomLayout";

type Props = {
  wallColor: string;
  /** 操作対象の家具をクリック/タップしたとき */
  onInteract: (f: Furniture) => void;
};

/** 床・壁タイルと家具を描く背景レイヤー */
export function TileMap({ wallColor, onInteract }: Props) {
  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const wall = WALL_MAP[y][x] === "#";
      const floor = wall ? wallColor : roomAt(x, y).floor;
      const alt = (x + y) % 2 === 0;
      cells.push(
        <div
          key={`${x}-${y}`}
          className={`room-cell ${wall ? "wall" : "floor"} ${alt ? "alt" : ""}`}
          style={{ background: floor }}
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
        {furniture.map((f, i) => {
          const interactive = !!f.interact;
          return (
            <div
              key={`${f.kind}-${i}`}
              className={`furn furn-${f.kind}${f.flag ? " flag" : ""}${interactive ? " interactive" : ""}`}
              style={{
                ...cellStyle(f.x, f.y, f.w ?? 1, f.h ?? 1),
                pointerEvents: interactive ? "auto" : "none",
                cursor: interactive ? "pointer" : undefined,
              }}
              title={f.label ?? f.kind}
              onClick={interactive ? () => onInteract(f) : undefined}
            >
              {f.label && <span className="furn-label">{f.label}</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}
