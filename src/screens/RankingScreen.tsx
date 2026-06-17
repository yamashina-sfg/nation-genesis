import { realCountries } from "../data/realCountries";
import type { NationStats, RankingAxis, StatKey } from "../types/game";

type RankingScreenProps = {
  playerName: string;
  playerStats: NationStats;
  marketIndex: number;
  playerCountryId: string;
};

const axes: RankingAxis[] = [
  { key: "gdp", label: "経済力（GDP）", note: "国全体でどれだけ稼いでいるか" },
  { key: "happiness", label: "幸福度", note: "国民の暮らしの満足度" },
  { key: "approval", label: "支持率", note: "政権がどれだけ支持されているか" },
  { key: "trust", label: "外交信用", note: "世界からの信頼の厚さ" },
  { key: "military", label: "軍事力", note: "国を守る力・抑止力" },
  { key: "technology", label: "技術力", note: "産業や研究の先進度" },
  { key: "environment", label: "環境", note: "脱炭素や自然との両立度" },
];

export function RankingScreen({ playerName, playerStats, marketIndex, playerCountryId }: RankingScreenProps) {
  // 他国は initialStats を基準値として使う（プレイヤーだけ現在値）
  function buildRanking(key: StatKey) {
    const rows = realCountries
      .filter((c) => c.id !== playerCountryId)
      .map((c) => ({ name: c.name, value: c.initialStats[key], isPlayer: false }));
    rows.push({ name: `${playerName}（あなた）`, value: playerStats[key], isPlayer: true });
    rows.sort((a, b) => b.value - a.value);
    return rows;
  }

  return (
    <section className="screen-layout ranking-layout">
      <div className="panel wide-panel">
        <div className="section-title">
          <span>🏆 世界ランキング</span>
          <strong>アジア{realCountries.length}カ国で比較</strong>
        </div>
        <p className="screen-hint">
          あなたの国が世界の中でどの位置にいるかを示します。ゲームに終わりはありません。<br />
          政策と外交を重ねて、各分野で世界一を目指しましょう。
        </p>

        <div className="ranking-grid">
          {axes.map((axis) => {
            const rows = buildRanking(axis.key as StatKey);
            const playerRank = rows.findIndex((r) => r.isPlayer) + 1;
            const maxVal = Math.max(...rows.map((r) => r.value), 1);
            return (
              <div key={axis.key} className="ranking-card">
                <div className="ranking-card-head">
                  <div>
                    <strong>{axis.label}</strong>
                    <small>{axis.note}</small>
                  </div>
                  <span className="ranking-myrank">
                    あなた {playerRank}位 / {rows.length}カ国
                  </span>
                </div>
                <div className="ranking-rows">
                  {rows.slice(0, 5).map((r, i) => (
                    <div key={r.name} className={`ranking-row ${r.isPlayer ? "player" : ""}`}>
                      <span className="ranking-pos">{i + 1}</span>
                      <span className="ranking-name">{r.name}</span>
                      <div className="ranking-bar">
                        <span style={{ width: `${(r.value / maxVal) * 100}%` }} />
                      </div>
                      <span className="ranking-val">{Math.round(r.value)}</span>
                    </div>
                  ))}
                  {playerRank > 5 && (
                    <div className="ranking-row player out-of-top">
                      <span className="ranking-pos">{playerRank}</span>
                      <span className="ranking-name">{playerName}（あなた）</span>
                      <div className="ranking-bar">
                        <span style={{ width: `${(playerStats[axis.key as StatKey] / maxVal) * 100}%` }} />
                      </div>
                      <span className="ranking-val">{Math.round(playerStats[axis.key as StatKey])}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 株価指数の成長 */}
          <div className="ranking-card">
            <div className="ranking-card-head">
              <div>
                <strong>株価指数</strong>
                <small>国を代表する株式市場の元気さ</small>
              </div>
              <span className="ranking-myrank">現在 {marketIndex}</span>
            </div>
            <p className="ranking-index-note">
              株価指数が上がると国民の資産が増え、消費マインドも上向きます。
              市場画面で個別企業の動きも追えます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
