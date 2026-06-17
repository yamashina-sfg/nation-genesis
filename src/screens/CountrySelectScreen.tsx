import { useEffect, useRef, useState } from "react";
import { realCountries, continents } from "../data/realCountries";
import type { RealCountry } from "../data/realCountries";

// ===== 世界地図の範囲 =====
const LON_MIN = -180, LON_MAX = 180;
const LAT_MIN = -56, LAT_MAX = 80;
const W = 1000, H = 378;

function project(lon: number, lat: number): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
  return [x, y];
}

interface GeoFeature {
  id: string;
  geometry: { type: string; coordinates: unknown };
}
interface GeoJSON { features: GeoFeature[] }

function inBounds(ring: number[][]): boolean {
  return ring.some(pt => pt[0] >= LON_MIN && pt[0] <= LON_MAX && pt[1] >= LAT_MIN && pt[1] <= LAT_MAX);
}

function coordsToPath(coords: number[][][]): string {
  return coords
    .filter(ring => inBounds(ring))
    .map(ring =>
      ring.map((pt, i) => {
        const [x, y] = project(pt[0], pt[1]);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ") + " Z"
    ).join(" ");
}

function featureToPath(feature: GeoFeature): string {
  const { type, coordinates } = feature.geometry;
  if (type === "Polygon") return coordsToPath(coordinates as number[][][]);
  if (type === "MultiPolygon") return (coordinates as number[][][][]).map(p => coordsToPath(p)).join(" ");
  return "";
}

// イデオロギーバッジの色
function ideologyColor(ideology: string): string {
  if (ideology.includes("民主")) return "#1e7fd4";
  if (ideology.includes("共産")) return "#c03030";
  if (ideology.includes("軍事")) return "#8b2222";
  if (ideology.includes("主体")) return "#8b2222";
  if (ideology.includes("君主")) return "#6a4e8c";
  return "#555";
}

// 関係値 → ラベル
function relLabel(v: number): string {
  if (v >= 70) return "友好";
  if (v >= 50) return "良好";
  if (v >= 35) return "普通";
  if (v >= 20) return "緊張";
  return "敵対";
}
function relColor(v: number): string {
  if (v >= 70) return "#4caf7d";
  if (v >= 50) return "#8bc34a";
  if (v >= 35) return "#e0b34e";
  if (v >= 20) return "#e07a3a";
  return "#e05c5c";
}

type Props = { onSelect: (country: RealCountry) => void };

export function CountrySelectScreen({ onSelect }: Props) {
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<RealCountry>(realCountries[0]);
  const [continent, setContinent] = useState<string>("asia");
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const activeContinent = continents.find((c) => c.id === continent) ?? continents[0];
  const visibleCountries = realCountries.filter((c) => activeContinent.regions.includes(c.region));

  function pickContinent(id: string) {
    setContinent(id);
    const first = realCountries.find((c) =>
      (continents.find((x) => x.id === id) ?? continents[0]).regions.includes(c.region),
    );
    if (first) setSelected(first);
  }

  useEffect(() => {
    fetch("/world-countries.json")
      .then(r => r.json())
      .then(setGeo)
      .catch(console.error);
  }, []);

  // ISO → RealCountry マップ
  const isoMap: Record<string, RealCountry> = Object.fromEntries(
    realCountries.map(c => [c.iso, c])
  );

  const selectedIso = selected.iso;
  const hoveredIso = hovered;

  // 上位5カ国の関係を取得
  const topRelations = Object.entries(selected.relations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, val]) => ({ id, val, name: realCountries.find(c => c.id === id)?.name ?? id }));

  return (
    <div className="country-select-screen">
      {/* ヘッダー */}
      <div className="cs-header">
        <h1 className="cs-title">国を選んでください</h1>
        <div className="cs-region-tabs">
          {continents.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`cs-tab ${continent === c.id ? "active" : ""}`}
              onClick={() => pickContinent(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cs-body">
        {/* 左: アジア地図 */}
        <div className="cs-map-col">
          <div className="cs-map-wrap">
            {!geo && <div className="map-loading">地図を読み込み中...</div>}
            {geo && (
              <svg
                ref={svgRef}
                className="cs-map-svg"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <radialGradient id="csOcean" cx="50%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#0e2540" />
                    <stop offset="100%" stopColor="#071524" />
                  </radialGradient>
                  <filter id="csGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#d4a843" floodOpacity="0.9" />
                  </filter>
                  <filter id="csHover">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* 海 */}
                <rect x="0" y="0" width={W} height={H} fill="url(#csOcean)" />

                {/* グリッド（経緯線） */}
                <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5">
                  {[-40, -20, 0, 20, 40, 60].map(lat => {
                    const [, y] = project(0, lat);
                    return <line key={lat} x1="0" y1={y} x2={W} y2={y} />;
                  })}
                  {[-150, -100, -50, 0, 50, 100, 150].map(lon => {
                    const [x] = project(lon, 0);
                    return <line key={lon} x1={x} y1="0" x2={x} y2={H} />;
                  })}
                </g>

                {/* 国境 */}
                {geo.features.map(feature => {
                  const iso = String(feature.id);
                  const country = isoMap[iso];
                  const isGame = !!country;
                  const isSelected = iso === selectedIso;
                  const isHovered = iso === hoveredIso;

                  const pathD = featureToPath(feature);
                  if (!pathD) return null;

                  let fill = "#142233";
                  if (isSelected) fill = "#d4a843";
                  else if (isHovered && isGame) fill = "#3a6090";
                  else if (isGame) fill = "#1e4a6e";

                  const stroke = isGame
                    ? isSelected ? "#f0ce84" : isHovered ? "#8ab8e0" : "rgba(100,160,210,0.5)"
                    : "rgba(255,255,255,0.06)";

                  return (
                    <path
                      key={iso}
                      d={pathD}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isGame ? (isSelected ? 1.5 : 0.8) : 0.2}
                      filter={isSelected ? "url(#csGlow)" : isHovered && isGame ? "url(#csHover)" : undefined}
                      opacity={isGame ? 1 : 0.6}
                      style={{ cursor: isGame ? "pointer" : "default" }}
                      onClick={() => { if (country) setSelected(country); }}
                      onMouseEnter={e => {
                        if (!isGame) return;
                        setHovered(iso);
                        const rect = svgRef.current?.getBoundingClientRect();
                        if (!rect) return;
                        setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, text: country.name });
                      }}
                      onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                    />
                  );
                })}

                {/* 首都マーカー */}
                {realCountries.map(c => {
                  const [cx, cy] = project(c.capitalCoords[0], c.capitalCoords[1]);
                  if (cx < 0 || cx > W || cy < 0 || cy > H) return null;
                  const isSel = c.id === selected.id;
                  return (
                    <g key={c.id} style={{ cursor: "pointer" }} onClick={() => setSelected(c)}>
                      <circle cx={cx} cy={cy} r={isSel ? 7 : 4.5}
                        fill={isSel ? "#d4a843" : "#5ea8d8"}
                        stroke={isSel ? "#fff8" : "#fff4"}
                        strokeWidth={isSel ? 2 : 1}
                      />
                      <text
                        x={cx} y={cy - (isSel ? 13 : 9)}
                        textAnchor="middle"
                        style={{
                          fontSize: isSel ? "10px" : "8px",
                          fill: isSel ? "#f0ce84" : "#a8d0f0",
                          fontWeight: isSel ? "700" : "400",
                          pointerEvents: "none",
                          textShadow: "0 1px 3px #000a",
                        }}
                      >
                        {c.name}
                      </text>
                    </g>
                  );
                })}

                {/* ツールチップ */}
                {tooltip && (
                  <foreignObject x={tooltip.x - 10} y={tooltip.y - 36} width="160" height="28">
                    <div className="map-tooltip">{tooltip.text}</div>
                  </foreignObject>
                )}
              </svg>
            )}
          </div>

          {/* クイック選択グリッド（選択中の大陸の国） */}
          <div className="cs-quick-grid">
            {visibleCountries.map(c => (
              <button
                key={c.id}
                type="button"
                className={`cs-quick-btn ${c.id === selected.id ? "active" : ""}`}
                style={{ "--flag-color": c.flagPrimary, "--flag-accent": c.flagAccent } as React.CSSProperties}
                onClick={() => setSelected(c)}
                title={c.name}
              >
                <span className="cs-quick-flag" style={{ background: c.flagPrimary, borderBottom: `4px solid ${c.flagAccent}` }} />
                <span className="cs-quick-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 右: 国情報カード */}
        <div className="cs-info-col">
          <div className="cs-country-card">
            {/* フラッグバナー */}
            <div className="cs-flag-banner" style={{ background: `linear-gradient(135deg, ${selected.flagPrimary} 60%, ${selected.flagAccent})` }}>
              <div className="cs-country-name-block">
                <h2 className="cs-country-name">{selected.name}</h2>
                <span className="cs-capital">{selected.capital}</span>
                <span
                  className="cs-ideology-badge"
                  style={{ background: ideologyColor(selected.ideology) }}
                >
                  {selected.ideology}
                </span>
              </div>
              <div className="cs-region-badge">{selected.region}</div>
            </div>

            {/* 主要指標 */}
            <div className="cs-stats-grid">
              <div className="cs-stat">
                <span className="cs-stat-label">GDP</span>
                <span className="cs-stat-value">${selected.gdpReal.toLocaleString()}B</span>
              </div>
              <div className="cs-stat">
                <span className="cs-stat-label">人口</span>
                <span className="cs-stat-value">{selected.population}M</span>
              </div>
              <div className="cs-stat">
                <span className="cs-stat-label">軍事力</span>
                <span className="cs-stat-value">{selected.initialStats.military}</span>
              </div>
              <div className="cs-stat">
                <span className="cs-stat-label">技術力</span>
                <span className="cs-stat-value">{selected.initialStats.technology}</span>
              </div>
              <div className="cs-stat">
                <span className="cs-stat-label">支持率</span>
                <span className="cs-stat-value">{selected.initialStats.approval}%</span>
              </div>
              <div className="cs-stat">
                <span className="cs-stat-label">外交信用</span>
                <span className="cs-stat-value">{selected.initialStats.trust}</span>
              </div>
            </div>

            {/* 説明文 */}
            <p className="cs-description">{selected.description}</p>

            {/* 特性 */}
            <div className="cs-section">
              <div className="cs-section-label">特性</div>
              <div className="cs-traits">
                {selected.specialTraits.map(t => (
                  <span key={t} className="cs-trait-chip">{t}</span>
                ))}
              </div>
            </div>

            {/* ブロック */}
            <div className="cs-section">
              <div className="cs-section-label">所属ブロック</div>
              <div className="cs-blocs">
                {selected.blocs.length > 0
                  ? selected.blocs.map(b => (
                    <span key={b} className="cs-bloc-chip">{b}</span>
                  ))
                  : <span className="cs-no-blocs">なし (孤立)</span>
                }
              </div>
            </div>

            {/* 外交関係 */}
            <div className="cs-section">
              <div className="cs-section-label">主要国との関係</div>
              <div className="cs-relations">
                {topRelations.map(({ id, val, name }) => (
                  <div key={id} className="cs-rel-row">
                    <span className="cs-rel-name">{name}</span>
                    <div className="cs-rel-bar-wrap">
                      <div className="cs-rel-bar" style={{ width: `${val}%`, background: relColor(val) }} />
                    </div>
                    <span className="cs-rel-label" style={{ color: relColor(val) }}>{relLabel(val)}</span>
                    <span className="cs-rel-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 開始ボタン */}
            <button
              type="button"
              className="cs-start-btn"
              onClick={() => onSelect(selected)}
            >
              {selected.name} でプレイ開始
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
