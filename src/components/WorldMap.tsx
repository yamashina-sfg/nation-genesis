import { useEffect, useRef, useState } from "react";
import type { AINation } from "../types/game";
import { realCountries } from "../data/realCountries";

// ===== 実在国 ISO 3166-1 numeric マッピング =====
export const COUNTRY_ISO: Record<string, string> = Object.fromEntries(
  realCountries.map(c => [c.id, c.iso])
);

// 各国の首都座標 (実在国データから生成)
export const CAPITAL_COORDS: Record<string, [number, number]> = Object.fromEntries(
  realCountries.map(c => [c.id, c.capitalCoords])
);

// 友好度 → 色
function relationColor(relation: number): string {
  if (relation >= 65) return "#4caf7d";
  if (relation >= 45) return "#e0b34e";
  if (relation >= 25) return "#e07a3a";
  return "#e05c5c";
}

// GeoJSON Feature
interface GeoFeature {
  id: string;
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}

interface GeoJSON {
  features: GeoFeature[];
}

// アジア範囲にズーム
const LON_MIN = 60, LON_MAX = 152;
const LAT_MIN = -12, LAT_MAX = 57;
const W = 960;
const H = 500;

// 等距円筒図法
function project(lon: number, lat: number, w: number, h: number): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * w;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * h;
  return [x, y];
}

function inBounds(ring: number[][]): boolean {
  return ring.some(
    pt => pt[0] >= LON_MIN && pt[0] <= LON_MAX && pt[1] >= LAT_MIN && pt[1] <= LAT_MAX
  );
}

function coordsToPath(coords: number[][][], w: number, h: number): string {
  return coords
    .filter(ring => inBounds(ring))
    .map(ring =>
      ring.map((pt, i) => {
        const [x, y] = project(pt[0], pt[1], w, h);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(" ") + " Z"
    ).join(" ");
}

function featureToPath(feature: GeoFeature, w: number, h: number): string {
  const { type, coordinates } = feature.geometry;
  if (type === "Polygon") return coordsToPath(coordinates as unknown as number[][][], w, h);
  if (type === "MultiPolygon") return (coordinates as unknown as number[][][][]).map(p => coordsToPath(p, w, h)).join(" ");
  return "";
}

// ===== コンポーネント =====
type WorldMapProps = {
  playerNationName: string;
  playerNationId?: string; // realCountries の id
  nations: AINation[];
  selectedNationId: string;
  onSelectNation: (id: string) => void;
  mode?: "game" | "select";
};

export function WorldMap({
  playerNationName,
  playerNationId,
  nations,
  selectedNationId,
  onSelectNation,
  mode = "game",
}: WorldMapProps) {
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch("/world-countries.json")
      .then(r => r.json())
      .then(setGeo)
      .catch(console.error);
  }, []);

  // ISO → game info マップ
  const gameCountryById: Record<string, { id: string; nation?: AINation; isPlayer: boolean; relation: number }> = {};

  // プレイヤー国
  if (playerNationId) {
    const playerIso = COUNTRY_ISO[playerNationId];
    if (playerIso) gameCountryById[playerIso] = { id: playerNationId, isPlayer: true, relation: 100 };
  }

  // AI 国 (外交対象)
  nations.forEach(n => {
    const iso = COUNTRY_ISO[n.id];
    if (iso) gameCountryById[iso] = { id: n.id, nation: n, isPlayer: false, relation: n.relation };
  });

  const selectedIso = COUNTRY_ISO[selectedNationId];

  return (
    <div className="world-map">
      {!geo && (
        <div className="map-loading">
          <span>地図データを読み込み中...</span>
        </div>
      )}

      {geo && (
        <svg
          ref={svgRef}
          className="world-map-svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#0e2540" />
              <stop offset="100%" stopColor="#071524" />
            </radialGradient>
            <filter id="countryGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#d4a843" floodOpacity="0.8" />
            </filter>
            <filter id="selectGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 海 */}
          <rect x="0" y="0" width={W} height={H} fill="url(#oceanGrad)" />

          {/* グリッド */}
          <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5">
            {[0, 15, 30, 45].map(lat => {
              const [, y] = project(0, lat, W, H);
              return <line key={`lat${lat}`} x1="0" y1={y} x2={W} y2={y} />;
            })}
            {[70, 90, 110, 130, 150].map(lon => {
              const [x] = project(lon, 0, W, H);
              return <line key={`lon${lon}`} x1={x} y1="0" x2={x} y2={H} />;
            })}
          </g>

          {/* 全国境 */}
          {geo.features.map(feature => {
            const iso = String(feature.id);
            const gameInfo = gameCountryById[iso];
            const isGameCountry = !!gameInfo;
            const isSelected = iso === selectedIso;
            const isPlayer = gameInfo?.isPlayer;
            const relation = gameInfo?.relation ?? 50;

            const pathD = featureToPath(feature, W, H);
            if (!pathD) return null;

            let fill = "#142233";
            if (isGameCountry) {
              if (isPlayer) fill = isSelected ? "#e8c04a" : "#d4a843";
              else if (isSelected) fill = "#6ae0a8";
              else if (relation >= 65) fill = "#3d8f64";
              else if (relation >= 45) fill = "#8a7030";
              else if (relation >= 25) fill = "#7a4020";
              else fill = "#7a2f2f";
            }

            const stroke = isGameCountry
              ? isPlayer
                ? "#f0ce84"
                : isSelected ? "#ffffff" : "rgba(255,255,255,0.5)"
              : "rgba(255,255,255,0.08)";

            return (
              <path
                key={iso}
                d={pathD}
                fill={fill}
                stroke={stroke}
                strokeWidth={isGameCountry ? (isSelected ? 1.5 : 0.8) : 0.3}
                filter={isPlayer ? "url(#countryGlow)" : isSelected ? "url(#selectGlow)" : undefined}
                opacity={isGameCountry ? 1 : 0.65}
                style={{ cursor: isGameCountry && !isPlayer ? "pointer" : "default" }}
                onClick={() => { if (gameInfo && !isPlayer) onSelectNation(gameInfo.id); }}
                onMouseEnter={e => {
                  if (!isGameCountry) return;
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const label = isPlayer
                    ? `★ ${playerNationName}`
                    : `${gameInfo.nation?.name ?? iso} — 友好度 ${relation}`;
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, text: label });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}

          {/* 貿易ルート (game モードのみ) */}
          {mode === "game" && playerNationId && nations.map(nation => {
            const fromCoord = CAPITAL_COORDS[playerNationId];
            const toCoord = CAPITAL_COORDS[nation.id];
            if (!fromCoord || !toCoord) return null;
            const [x1, y1] = project(fromCoord[0], fromCoord[1], W, H);
            const [x2, y2] = project(toCoord[0], toCoord[1], W, H);
            const mx = (x1 + x2) / 2;
            const my = Math.min(y1, y2) - 30;
            const color = relationColor(nation.relation);
            const isSel = nation.id === selectedNationId;
            return (
              <path
                key={`route-${nation.id}`}
                d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                fill="none"
                stroke={color}
                strokeWidth={isSel ? 2.5 : 1}
                strokeOpacity={isSel ? 0.95 : 0.45}
                strokeDasharray={nation.relation < 35 ? "6 4" : undefined}
                strokeLinecap="round"
              />
            );
          })}

          {/* 首都マーカー */}
          {(() => {
            const entries: Array<[string, [number, number]]> = [];
            if (playerNationId && CAPITAL_COORDS[playerNationId]) {
              entries.push([playerNationId, CAPITAL_COORDS[playerNationId]]);
            }
            nations.forEach(n => {
              if (CAPITAL_COORDS[n.id]) entries.push([n.id, CAPITAL_COORDS[n.id]]);
            });
            return entries.map(([nationId, [lon, lat]]) => {
              const [cx, cy] = project(lon, lat, W, H);
              if (cx < -10 || cx > W + 10 || cy < -10 || cy > H + 10) return null;
              const nation = nations.find(n => n.id === nationId);
              const isPlayer = nationId === playerNationId;
              const isSel = nationId === selectedNationId;
              const color = isPlayer ? "#f0ce84" : relationColor(nation?.relation ?? 50);
              const name = isPlayer ? playerNationName : nation?.name ?? nationId;

              return (
                <g key={nationId} style={{ cursor: isPlayer ? "default" : "pointer" }}
                  onClick={() => { if (!isPlayer) onSelectNation(nationId); }}>
                  <circle cx={cx} cy={cy} r={isPlayer ? 8 : isSel ? 7 : 5}
                    fill="none" stroke={color} strokeWidth={isSel || isPlayer ? 2 : 1.5}
                    opacity={isSel || isPlayer ? 1 : 0.8} />
                  <circle cx={cx} cy={cy} r={isPlayer ? 4 : 2.5} fill={color} />
                  <text
                    x={cx} y={cy - (isPlayer ? 14 : 11)}
                    textAnchor="middle"
                    className={`map-label ${isPlayer ? "player" : ""}`}
                    style={{ fontSize: isPlayer ? "9px" : "7.5px" }}
                  >
                    {name}
                  </text>
                  {isPlayer && (
                    <text x={cx} y={cy - 5} textAnchor="middle" className="map-sublabel">
                      ★ 自国
                    </text>
                  )}
                </g>
              );
            });
          })()}

          {/* ツールチップ */}
          {tooltip && (
            <foreignObject x={tooltip.x - 10} y={tooltip.y - 36} width="220" height="30">
              <div className="map-tooltip">{tooltip.text}</div>
            </foreignObject>
          )}
        </svg>
      )}

      <div className="map-compass">
        <span className="map-compass-title">{playerNationName}</span>
        <span className="map-compass-sub">アジア地図 — 国をクリックして外交</span>
      </div>
    </div>
  );
}
