import type { Country } from "../types/game";

type CountryDetailCardProps = {
  country: Country;
};

function relationClass(relation: number) {
  if (relation >= 65) return "good";
  if (relation >= 45) return "mid";
  return "risk";
}

/** 地図で選択中の国の詳細カード */
export function CountryDetailCard({ country }: CountryDetailCardProps) {
  return (
    <div className={`country-detail tone-${relationClass(country.relation)}`}>
      <div className="country-detail-head">
        <div>
          <h2>{country.name}</h2>
          <p>首都 {country.capital} ・ 方針 {country.stance}</p>
        </div>
        <span className={`relation-badge tone-${relationClass(country.relation)}`}>
          {country.relationStatus}
        </span>
      </div>

      <p className="country-desc">{country.description}</p>

      <div className="relation-bar">
        <span style={{ width: `${country.relation}%` }} />
      </div>
      <p className="relation-copy">自国との友好度 {country.relation} / 100</p>

      <dl className="brief-list grid">
        <div>
          <dt>人口</dt>
          <dd>{country.population}M</dd>
        </div>
        <div>
          <dt>GDP</dt>
          <dd>{country.gdp}B</dd>
        </div>
        <div>
          <dt>軍事力</dt>
          <dd>{country.military}</dd>
        </div>
        <div>
          <dt>技術力</dt>
          <dd>{country.technology}</dd>
        </div>
      </dl>

      <div className="resource-tags">
        <strong>主な資源</strong>
        <div>
          {country.resources.map((res) => (
            <span key={res}>{res}</span>
          ))}
        </div>
      </div>

      <div className="trade-profile">
        <strong>主な輸出品</strong>
        <p>{country.exports.join(" / ")}</p>
        <strong>主な輸入品</strong>
        <p>{country.imports.join(" / ")}</p>
        <strong>最近のニュース</strong>
        <p>{country.recentNews}</p>
      </div>
    </div>
  );
}
