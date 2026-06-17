import type { Company } from "../types/game";

type MarketScreenProps = {
  companies: Company[];
  marketIndex: number;
};

export function MarketScreen({ companies, marketIndex }: MarketScreenProps) {
  // 速報テロップ用に値動きを文字列化
  const ticker = companies.map((c) => {
    const ch = c.price - c.previousPrice;
    const pct = c.previousPrice > 0 ? (ch / c.previousPrice) * 100 : 0;
    return `${c.name} ${ch >= 0 ? "▲" : "▼"}${Math.abs(ch)}(${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%)`;
  });

  return (
    <section className="screen-layout">
      <div className="panel wide-panel">
        {/* 取引所の大型ボード */}
        <div className="exchange-board">
          <div className="exchange-index">
            <span>国内株価指数</span>
            <strong>{marketIndex.toLocaleString()}</strong>
          </div>
          <div className="exchange-ticker">
            <div className="exchange-ticker-track">
              {[...ticker, ...ticker].map((t, i) => (
                <span key={i} className="exchange-ticker-item">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="section-title">
          <span>証券取引所 / 個別銘柄</span>
          <strong>市場指数 {marketIndex}</strong>
        </div>
        <div className="stock-board">
          {companies.map((company) => {
            const change = company.price - company.previousPrice;
            const pct =
              company.previousPrice > 0
                ? (change / company.previousPrice) * 100
                : 0;
            const dir = change >= 0 ? "up" : "down";
            return (
              <article className={`stock-card ${dir}`} key={company.id}>
                <div className="stock-head">
                  <div>
                    <span>{company.sector}</span>
                    <strong>{company.name}</strong>
                  </div>
                  <div className="stock-price">
                    <em>{company.price.toLocaleString()} cr</em>
                    <small className={dir}>
                      {change >= 0 ? "▲ +" : "▼ "}
                      {change} ({pct >= 0 ? "+" : ""}
                      {pct.toFixed(1)}%)
                    </small>
                  </div>
                </div>
                {company.changeReason && (
                  <p className="stock-reason">{company.changeReason}</p>
                )}
              </article>
            );
          })}
        </div>
      </div>
      <aside className="panel market-explain">
        <div className="section-title">
          <span>市場メモ</span>
          <strong>値動きの読み方</strong>
        </div>
        <ul className="market-notes">
          <li><b>Celestia Bank</b>：金利上昇で利ざやが改善し上がりやすい。</li>
          <li><b>NovaTech</b>：金利上昇で逆風、技術投資で追い風。</li>
          <li><b>Mediterranean Energy</b>：外交不安・制裁で動きやすい。</li>
          <li><b>Atlas Motors</b>：景気と貿易に敏感。</li>
          <li><b>BluePort Logistics</b>：貿易協定で上がりやすい。</li>
        </ul>
        <p className="market-foot">
          株価が動いた理由は各銘柄カードとニュースに記録されます。
        </p>
      </aside>
    </section>
  );
}
