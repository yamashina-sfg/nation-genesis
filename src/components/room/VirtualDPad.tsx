import type { Dir } from "../../data/roomLayout";

type Props = {
  onPress: (dir: Dir) => void;
  onRelease: (dir: Dir) => void;
  onAction: () => void;
};

/** スマホ用の仮想十字キー＋決定ボタン */
export function VirtualDPad({ onPress, onRelease, onAction }: Props) {
  const dirBtn = (dir: Dir, glyph: string) => (
    <button
      type="button"
      className={`vpad-btn ${dir}`}
      onPointerDown={(e) => { e.preventDefault(); onPress(dir); }}
      onPointerUp={(e) => { e.preventDefault(); onRelease(dir); }}
      onPointerLeave={() => onRelease(dir)}
      onPointerCancel={() => onRelease(dir)}
      aria-label={dir}
    >
      {glyph}
    </button>
  );

  return (
    <>
      <div className="vpad left">
        <div className="vpad-cross">
          {dirBtn("up", "▲")}
          {dirBtn("left", "◀")}
          <div className="vpad-btn mid" />
          {dirBtn("right", "▶")}
          {dirBtn("down", "▼")}
        </div>
      </div>
      <div className="vpad right">
        <button
          type="button"
          className="vpad-a"
          onPointerDown={(e) => { e.preventDefault(); onAction(); }}
          aria-label="決定"
        >
          はなす
        </button>
      </div>
    </>
  );
}
