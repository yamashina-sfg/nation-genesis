import type { Company, NationStats, StatKey } from "../types/game";

export type StockPrediction = {
  id: string;
  name: string;
  sector: string;
  dir: "up" | "down" | "flat";
  note: string;
};

/**
 * 政策効果 (stat の変化) から、各企業の株価がどう動きそうかを予測する。
 * company.bias と効果の内積でスコアを出す。
 */
export function predictStockMoves(
  effect: Partial<NationStats>,
  companies: Company[],
): StockPrediction[] {
  return companies.map((company) => {
    let score = 0;
    for (const key of Object.keys(effect) as StatKey[]) {
      const amount = effect[key] ?? 0;
      const bias = company.bias[key] ?? 0;
      score += amount * bias;
    }
    const dir: StockPrediction["dir"] = score > 1.5 ? "up" : score < -1.5 ? "down" : "flat";
    const note =
      dir === "up"
        ? "業績期待で買われそう"
        : dir === "down"
          ? "逆風で売られそう"
          : "影響は限定的";
    return { id: company.id, name: company.name, sector: company.sector, dir, note };
  });
}

/** 効果が株価指数に与える方向を一言で */
export function predictIndexDir(predictions: StockPrediction[]): "up" | "down" | "flat" {
  const ups = predictions.filter((p) => p.dir === "up").length;
  const downs = predictions.filter((p) => p.dir === "down").length;
  if (ups > downs) return "up";
  if (downs > ups) return "down";
  return "flat";
}
