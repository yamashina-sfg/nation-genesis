/**
 * CSS/SVGで描く簡易ドット絵キャラクター（Apple絵文字の置き換え）。
 * 役職ごとに服の色・髪・小物（眼鏡/軍帽/マイク/ネクタイ）で区別する。
 * 後からスプライト画像に差し替えやすいよう、role を受け取る単純な見た目に。
 */
export type SpriteRole =
  | "president" | "secretary" | "finance" | "foreign" | "defense"
  | "business" | "citizen" | "press" | "worker";

type Style = {
  skin: string; hair: string; body: string; pants: string;
  tie?: string; glasses?: boolean; cap?: string; mic?: boolean;
};

const ROLE: Record<SpriteRole, Style> = {
  president: { skin: "#e8c09a", hair: "#34281a", body: "#1f2f55", pants: "#16203a", tie: "#c0392b" },
  secretary: { skin: "#f0cda6", hair: "#5a3a1e", body: "#e0975a", pants: "#7a4a26" },
  finance: { skin: "#e8c09a", hair: "#262626", body: "#27406b", pants: "#1b2c4a", glasses: true },
  foreign: { skin: "#e8c09a", hair: "#3a3a3a", body: "#3a72ad", pants: "#28455f", tie: "#1f3f66" },
  defense: { skin: "#dcab7c", hair: "#2a3320", body: "#5d6b39", pants: "#3f4a26", cap: "#47532c" },
  business: { skin: "#ecc196", hair: "#6a4a2a", body: "#a06a26", pants: "#5a3f1a" },
  citizen: { skin: "#e8c09a", hair: "#4a3520", body: "#4f9a4a", pants: "#5a4a30" },
  press: { skin: "#f0cda6", hair: "#222222", body: "#2f7a86", pants: "#214a52", mic: true },
  worker: { skin: "#e8c09a", hair: "#3a2c1c", body: "#6f7c8c", pants: "#3a4350" },
};

export function PixelSprite({ role, size = 100 }: { role: SpriteRole; size?: number }) {
  const s = ROLE[role];
  return (
    <svg
      viewBox="0 0 12 16"
      width={`${size}%`}
      height={`${size}%`}
      style={{ imageRendering: "pixelated", display: "block" }}
      shapeRendering="crispEdges"
    >
      {/* 影 */}
      <ellipse cx="6" cy="15.4" rx="3.6" ry="0.7" fill="rgba(0,0,0,0.28)" />
      {/* 脚 */}
      <rect x="3" y="12" width="2" height="3" fill={s.pants} />
      <rect x="7" y="12" width="2" height="3" fill={s.pants} />
      {/* 胴体（服） */}
      <rect x="2" y="8" width="8" height="5" fill={s.body} />
      {/* 腕 */}
      <rect x="1" y="8" width="1" height="4" fill={s.body} />
      <rect x="10" y="8" width="1" height="4" fill={s.body} />
      {/* ネクタイ */}
      {s.tie && <rect x="5.5" y="8" width="1" height="3.5" fill={s.tie} />}
      {/* 首 */}
      <rect x="5" y="7" width="2" height="1.2" fill={s.skin} />
      {/* 顔 */}
      <rect x="3" y="3" width="6" height="4.2" fill={s.skin} />
      {/* 髪 */}
      {!s.cap && (
        <>
          <rect x="3" y="1.4" width="6" height="2.4" fill={s.hair} />
          <rect x="3" y="3" width="1" height="2" fill={s.hair} />
          <rect x="8" y="3" width="1" height="2" fill={s.hair} />
        </>
      )}
      {/* 目 */}
      <rect x="4.2" y="4.4" width="1" height="1" fill="#222" />
      <rect x="6.8" y="4.4" width="1" height="1" fill="#222" />
      {/* 眼鏡 */}
      {s.glasses && (
        <>
          <rect x="3.8" y="4.2" width="1.8" height="1.4" fill="none" stroke="#1a1a1a" strokeWidth="0.4" />
          <rect x="6.4" y="4.2" width="1.8" height="1.4" fill="none" stroke="#1a1a1a" strokeWidth="0.4" />
        </>
      )}
      {/* 軍帽 */}
      {s.cap && (
        <>
          <rect x="2.4" y="1" width="7.2" height="2" fill={s.cap} />
          <rect x="2" y="2.6" width="8" height="0.9" fill="#2f3720" />
        </>
      )}
      {/* マイク（記者） */}
      {s.mic && (
        <>
          <rect x="10" y="6" width="0.9" height="3.2" fill="#222" />
          <rect x="9.6" y="5.2" width="1.7" height="1.4" rx="0.6" fill="#555" />
        </>
      )}
    </svg>
  );
}
