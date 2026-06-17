import type { Company } from "../types/game";

export const initialCompanies: Company[] = [
  {
    id: "bank",
    name: "Celestia Bank",
    sector: "銀行",
    price: 980,
    previousPrice: 980,
    bias: { inflation: 0.5, trust: 0.8, gdp: 0.3 },
  },
  {
    id: "ai",
    name: "NovaTech",
    sector: "AI企業",
    price: 1280,
    previousPrice: 1280,
    bias: { technology: 1.4, gdp: 0.7, budget: -0.1 },
  },
  {
    id: "energy",
    name: "Mediterranean Energy",
    sector: "エネルギー",
    price: 840,
    previousPrice: 840,
    bias: { gdp: 0.5, environment: -0.8, trust: 0.3 },
  },
  {
    id: "auto",
    name: "Atlas Motors",
    sector: "自動車",
    price: 760,
    previousPrice: 760,
    bias: { gdp: 0.8, unemployment: -0.9, environment: -0.5 },
  },
  {
    id: "logistics",
    name: "BluePort Logistics",
    sector: "物流",
    price: 690,
    previousPrice: 690,
    bias: { gdp: 1, trust: 0.5, budget: 0.2 },
  },
];
