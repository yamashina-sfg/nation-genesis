import { useMemo, useState } from "react";
import { EventModal } from "./components/EventModal";
import { ModeTabs } from "./components/ModeTabs";
import { NationHeader } from "./components/NationHeader";
import { RightRail } from "./components/RightRail";
import { StatusSidebar } from "./components/StatusSidebar";
import { characters } from "./data/characters";
import { initialCompanies } from "./data/companies";
import { choiceEvents, passiveEvents } from "./data/events";
import { realCountries } from "./data/realCountries";
import type { RealCountry } from "./data/realCountries";
import { policies } from "./data/policies";
import { CountrySelectScreen } from "./screens/CountrySelectScreen";
import { MapScreen } from "./screens/MapScreen";
import { MarketScreen } from "./screens/MarketScreen";
import { NewsScreen } from "./screens/NewsScreen";
import { PoliciesScreen } from "./screens/PoliciesScreen";
import { StatusScreen } from "./screens/StatusScreen";
import type {
  ActionResult,
  Company,
  CharacterComment,
  Country,
  EventChoice,
  GameEvent,
  GameMode,
  NationStats,
  NewsItem,
  PlayerNation,
  StatDelta,
  StatKey,
} from "./types/game";
import { applyEffect, clamp, round1 } from "./utils/gameMath";

/** realCountries → Country 変換 (外交対象として使用) */
function realToCountry(rc: RealCountry, playerRelation: number): Country {
  return {
    id: rc.id,
    name: rc.name,
    isPlayer: false,
    mapPosition: { x: 50, y: 50 },
    x: 50,
    y: 50,
    landShape: 1,
    capital: rc.capital,
    population: rc.population,
    gdp: rc.initialStats.gdp,
    resources: rc.resources,
    resource: rc.resources[0] ?? "資源",
    military: rc.initialStats.military,
    technology: rc.initialStats.technology,
    relation: playerRelation,
    relationStatus: playerRelation >= 65 ? "協調" : playerRelation >= 45 ? "実務関係" : "緊張",
    stance: rc.ideology,
    description: rc.description,
    exports: rc.resources,
    imports: [],
    tradeRoutes: [],
    recentNews: `${rc.name}の最新情報はニュース画面を確認してください。`,
  };
}

/** プレイヤー国以外のアジア諸国 (最大6カ国) を外交対象として選ぶ */
function buildDiplomacyNations(playerCountry: RealCountry): Country[] {
  // 優先度: 関係値の絶対値が高い (重要な国) を選ぶ
  const others = realCountries.filter(c => c.id !== playerCountry.id);
  // 関係値を持つ国を優先、なければデフォルト50
  const sorted = others
    .map(c => ({ c, rel: playerCountry.relations[c.id] ?? 50 }))
    .sort((a, b) => {
      // 関係値が極端 (高い友好 or 低い敵対) な国を優先
      const scoreA = Math.abs(a.rel - 50);
      const scoreB = Math.abs(b.rel - 50);
      return scoreB - scoreA;
    })
    .slice(0, 6);
  return sorted.map(({ c, rel }) => realToCountry(c, rel));
}

function mergeEffects(effects: Partial<NationStats>[]) {
  return effects.reduce<Partial<NationStats>>((acc, effect) => {
    for (const key of Object.keys(effect) as StatKey[]) {
      acc[key] = round1((acc[key] ?? 0) + (effect[key] ?? 0));
    }
    return acc;
  }, {});
}

function getRateEffect(rate: number): Partial<NationStats> {
  if (rate >= 4) {
    return { inflation: -0.8, unemployment: 0.4, gdp: -5, approval: -1 };
  }
  if (rate <= 1.5) {
    return { inflation: 0.7, unemployment: -0.3, gdp: 6, approval: 1 };
  }
  return { inflation: -0.1, gdp: 1 };
}

function effectFromDeltas(deltas: ActionResult["deltas"]): Partial<NationStats> {
  return deltas.reduce<Partial<NationStats>>((effect, delta) => {
    effect[delta.key] = round1((effect[delta.key] ?? 0) + delta.amount);
    return effect;
  }, {});
}

function makeComment(characterId: string, text: string): CharacterComment {
  const character = characters.find((item) => item.id === characterId) ?? characters[0];
  return {
    characterId,
    name: character.name,
    role: character.title,
    text,
  };
}

export default function App() {
  const [selectedRealCountry, setSelectedRealCountry] = useState<RealCountry | null>(null);
  const [mode, setMode] = useState<GameMode>("status");
  const [nation, setNation] = useState<PlayerNation>({
    name: "日本",
    doctrine: "技術立国",
    flagPrimary: "#ffffff",
    flagAccent: "#bc002d",
  });
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2028);
  const [stats, setStats] = useState<NationStats>({
    approval: 52,
    happiness: 72,
    gdp: 620,
    budget: 180,
    unemployment: 2.6,
    inflation: 2.8,
    trust: 72,
    military: 65,
    technology: 85,
    environment: 65,
  });
  const [rate, setRate] = useState(2.5);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>(["education"]);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [nations, setNations] = useState<Country[]>(() => {
    // デフォルトは日本のネイバー国
    const japan = realCountries.find(c => c.id === "japan")!;
    return buildDiplomacyNations(japan);
  });
  const [selectedNationId, setSelectedNationId] = useState(() => {
    const japan = realCountries.find(c => c.id === "japan")!;
    return buildDiplomacyNations(japan)[0]?.id ?? "china";
  });
  const [speakerId, setSpeakerId] = useState("finance");
  /** 現在表示中の選択型イベント */
  const [pendingEvent, setPendingEvent] = useState<GameEvent | null>(null);
  /** ターン処理中に積まれたパッシブ効果 (イベント選択後に合算) */
  const [pendingTurnData, setPendingTurnData] = useState<{
    policyNames: string;
    passiveEvent: { title: string; body: string; category: NewsItem["category"]; deltas: StatDelta[] };
    baseStats: NationStats;
  } | null>(null);
  const [latestResult, setLatestResult] = useState<ActionResult | undefined>({
    title: "政権発足",
    body: "最初の国家運営が始まりました。政策、外交、市場の変化はニュースと大臣コメントに記録されます。",
    deltas: [],
    benefits: ["国民と市場に基本方針を示しました。"],
    drawbacks: ["まだ外交関係と産業政策は固まっていません。"],
    comments: [
      makeComment("finance", "予算と物価を同時に見ながら、無理のない成長軌道を作りましょう。"),
    ],
  });
  const [news, setNews] = useState<NewsItem[]>([
    {
      title: "新政権が発足",
      body: "アジアの国家として、最初の国家方針が世界市場に注目されています。",
      category: "政治",
      reason: "国家の基本制度と初期予算が公開されたため。",
      comments: [
        makeComment("press", "読者が知りたいのは、数字が動いた理由です。すべて記録していきます。"),
      ],
    },
  ]);

  /** 国選択画面でプレイヤーが国を選んだ際の処理 */
  function handleCountrySelect(country: RealCountry) {
    setSelectedRealCountry(country);
    setNation({
      name: country.name,
      doctrine: country.ideology,
      flagPrimary: country.flagPrimary,
      flagAccent: country.flagAccent,
    });
    setStats(country.initialStats);
    const diplomacyNations = buildDiplomacyNations(country);
    setNations(diplomacyNations);
    setSelectedNationId(diplomacyNations[0]?.id ?? "china");
    setMode("status");
    setLatestResult({
      title: `${country.name} 政権発足`,
      body: `${country.name}の指導者として国家運営を開始します。${country.description}`,
      deltas: [],
      benefits: country.specialTraits,
      drawbacks: ["外交関係の構築が急務です。"],
      comments: [
        makeComment("finance", `初期GDP: ${country.initialStats.gdp}、予算: ${country.initialStats.budget}。財政基盤を確認してください。`),
      ],
    });
    setNews([{
      title: `${country.name}に新政権発足`,
      body: `${country.name}の新たな指導者が就任しました。${country.description}`,
      category: "政治",
      reason: "国家選択により政権が発足したため。",
      comments: [
        makeComment("press", `${country.name}の新政権に世界が注目しています。`),
      ],
    }]);
  }

  const marketIndex = useMemo(
    () => Math.round(companies.reduce((sum, company) => sum + company.price, 0) / companies.length),
    [companies],
  );

  const crisisLevel =
    stats.budget < 0 || stats.approval < 30 || stats.inflation > 9
      ? "警戒"
      : "安定";

  function togglePolicy(id: string) {
    setSelectedPolicyIds((current) => {
      if (current.includes(id)) return current.filter((policyId) => policyId !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  }

  function handleDiplomacy(action: "trade" | "alliance" | "sanction" | "talks") {
    const selectedNation = nations.find((item) => item.id === selectedNationId) ?? nations[0];
    const relationDeltas = { trade: 10, alliance: 12, sanction: -18, talks: 6 };
    const labels = { trade: "貿易協定", alliance: "同盟交渉", sanction: "経済制裁", talks: "首脳会談" };
    const resultByAction: Record<typeof action, ActionResult> = {
      trade: {
        title: `${selectedNation.name}との貿易協定を締結`,
        affectedNation: selectedNation.name,
        body: `${selectedNation.resource}と${selectedNation.exports[0]}を活用した物流が拡大しました。輸出企業と港湾業は追い風を受けますが、${selectedNation.imports[0]}への依存が高まり、国内産業から不満も出ています。`,
        deltas: [
          { key: "gdp", amount: 35, reason: `${selectedNation.exports[0]}との取引が増え、物流と輸出が伸びたため。` },
          { key: "trust", amount: 5, reason: "通商ルールを共有し、周辺国から予測可能な相手と見られたため。" },
          { key: "approval", amount: -2, reason: "輸入競争で国内製造業が圧迫される懸念が出たため。" },
        ],
        benefits: ["輸出と港湾物流が拡大", "外交信用が上昇", "BluePort Logisticsに追い風"],
        drawbacks: ["輸入依存が上昇", "国内製造業の不満が増加"],
        comments: [
          makeComment("foreign", `${selectedNation.name}との関係は改善しました。ただし、輸入依存が高まりすぎると将来的な交渉力が下がります。`),
          makeComment("finance", "短期的にはGDPにプラスです。国内産業への補助金も検討すべきです。"),
        ],
      },
      talks: {
        title: `${selectedNation.name}と首脳会談を実施`,
        affectedNation: selectedNation.name,
        body: `首都${selectedNation.capital}との直接対話により、誤解が減り関係改善の余地が広がりました。大きな経済効果はまだありませんが、将来の協定の土台になります。`,
        deltas: [
          { key: "trust", amount: 4, reason: "共同声明により外交的な予測可能性が高まったため。" },
          { key: "approval", amount: 1, reason: "緊張緩和を評価する世論が増えたため。" },
          { key: "budget", amount: -2, reason: "代表団派遣と共同会議の費用が発生したため。" },
        ],
        benefits: ["緊張緩和", "次の貿易・安全保障交渉が進めやすい"],
        drawbacks: ["短期の経済効果は小さい", "外交費用が発生"],
        comments: [
          makeComment("foreign", "会談は地味ですが、危機の前に信頼を積むもっとも安い保険です。"),
          makeComment("press", "成果文書の中身が薄いと世論はすぐ冷めます。次の一手が重要です。"),
        ],
      },
      alliance: {
        title: `${selectedNation.name}と同盟交渉を開始`,
        affectedNation: selectedNation.name,
        body: `${selectedNation.name}との安全保障協力により抑止力が増しました。一方で、対立国からは陣営化と受け止められ、周辺外交には緊張も生まれています。`,
        deltas: [
          { key: "military", amount: 7, reason: "共同訓練と情報共有により防衛能力が上がったため。" },
          { key: "trust", amount: 2, reason: "同盟国からの信用が増えたため。" },
          { key: "budget", amount: -8, reason: "共同演習と装備標準化の費用が発生したため。" },
        ],
        benefits: ["抑止力が上昇", "安全保障協力が強化"],
        drawbacks: ["防衛費が増加", "非同盟国から警戒される"],
        comments: [
          makeComment("defense", "抑止力は上がりました。ただし軍事協力は、同時に周辺国へのメッセージにもなります。"),
          makeComment("foreign", "同盟の言葉は重いです。経済関係とのバランスを取る必要があります。"),
        ],
      },
      sanction: {
        title: `${selectedNation.name}へ経済制裁を発動`,
        affectedNation: selectedNation.name,
        body: `${selectedNation.name}への制裁で政治的な圧力をかけました。しかし貿易量が落ち、企業収益と外交信用にも痛みが出ています。`,
        deltas: [
          { key: "trust", amount: -6, reason: "強硬措置により中立国が距離を置いたため。" },
          { key: "gdp", amount: -18, reason: "対象国との貿易と物流が縮小したため。" },
          { key: "approval", amount: 2, reason: "強い姿勢を評価する支持層が反応したため。" },
        ],
        benefits: ["政治的圧力を明確化", "強硬姿勢を支持する層が反応"],
        drawbacks: ["貿易縮小", "外交信用低下", "市場心理の悪化"],
        comments: [
          makeComment("foreign", "制裁は交渉カードですが、長引けばこちらの信用も削ります。出口戦略が必要です。"),
          makeComment("business", "物流企業と輸出企業には逆風です。代替市場を早く探す必要があります。"),
        ],
      },
    };
    const result = resultByAction[action];

    setNations((current) =>
      current.map((item) =>
        item.id === selectedNationId
          ? {
              ...item,
              relation: clamp(item.relation + relationDeltas[action], 0, 100),
              relationStatus:
                clamp(item.relation + relationDeltas[action], 0, 100) >= 65
                  ? "協調"
                  : clamp(item.relation + relationDeltas[action], 0, 100) >= 45
                    ? "実務関係"
                    : "緊張",
            }
          : item,
      ),
    );
    setStats((current) => applyEffect(current, effectFromDeltas(result.deltas)));
    setLatestResult(result);
    setSpeakerId(result.comments[0]?.characterId ?? "foreign");
    setCompanies((current) =>
      current.map((company) => {
        let direct = 0;
        let reason = "";
        if (action === "trade" && company.id === "logistics") {
          direct = 38;
          reason = `${selectedNation.name}との貿易協定で取扱貨物の増加が見込まれ、物流に資金が向かった。`;
        } else if (action === "sanction" && company.id === "logistics") {
          direct = -32;
          reason = `${selectedNation.name}への制裁で貿易量の縮小が懸念され、物流株が売られた。`;
        } else if (action === "alliance" && company.id === "energy") {
          direct = 12;
          reason = "安全保障協力でエネルギー供給網の安定期待が高まった。";
        } else if (action === "trade" && company.id === "auto") {
          direct = -10;
          reason = "安価な輸入競合が増えるとの見方から自動車株は軟調。";
        } else if (action === "sanction" && company.id === "energy") {
          direct = 8;
          reason = "制裁で供給不安が意識され、エネルギー価格上昇期待から買われた。";
        }
        return {
          ...company,
          previousPrice: company.price,
          price: Math.max(120, company.price + direct),
          changeReason: reason || undefined,
        };
      }),
    );
    setNews((current) =>
      [
        {
          title: `${selectedNation.name}: ${labels[action]}`,
          body: result.body,
          category: "外交" as const,
          affectedNation: selectedNation.name,
          deltas: result.deltas,
          reason: "選択した相手国との外交行動が、貿易量・信用・安全保障コストを同時に動かしたため。",
          comments: result.comments,
        },
        ...current,
      ].slice(0, 9),
    );
  }

  function handleRateAction(direction: "hike" | "cut") {
    const step = 0.5;
    const newRate = clamp(direction === "hike" ? rate + step : rate - step, 0, 6);
    setRate(newRate);

    const effect: Partial<NationStats> =
      direction === "hike"
        ? { inflation: -2, gdp: -10, unemployment: 1 }
        : { inflation: 2, gdp: 20, unemployment: -1 };
    const deltas: StatDelta[] =
      direction === "hike"
        ? [
            { key: "inflation", amount: -2, reason: "利上げで需要と借入が抑制され、物価上昇が鈍化したため。" },
            { key: "gdp", amount: -10, reason: "借入コスト上昇で企業投資と消費が冷え込んだため。" },
            { key: "unemployment", amount: 1, reason: "投資抑制で企業の採用意欲が下がったため。" },
          ]
        : [
            { key: "inflation", amount: 2, reason: "利下げで需要が刺激され、物価が上がりやすくなったため。" },
            { key: "gdp", amount: 20, reason: "低金利で投資と消費が活発化したため。" },
            { key: "unemployment", amount: -1, reason: "景気刺激で企業の採用が増えたため。" },
          ];

    setStats((current) => applyEffect(current, effect));
    setCompanies((current) =>
      current.map((company) => {
        let move = 0;
        let reason = "";
        if (direction === "hike") {
          if (company.id === "bank") {
            move = 42;
            reason = "利上げで利ざや改善が期待され、銀行株が上昇。";
          } else {
            move = company.id === "ai" ? -70 : company.id === "auto" ? -45 : -25;
            reason = "金利上昇で借入コストが増し、株価全体が下落（特に成長株）。";
          }
        } else {
          if (company.id === "bank") {
            move = -18;
            reason = "利下げで利ざやが縮小し、銀行株は軟調。";
          } else {
            move = company.id === "ai" ? 60 : company.id === "auto" ? 40 : 25;
            reason = "金利低下で資金調達が容易になり、株価全体が上昇。";
          }
        }
        return {
          ...company,
          previousPrice: company.price,
          price: Math.max(120, company.price + move),
          changeReason: reason,
        };
      }),
    );

    const result: ActionResult = {
      title:
        direction === "hike"
          ? `政策金利を引き上げ (${newRate.toFixed(1)}%)`
          : `政策金利を引き下げ (${newRate.toFixed(1)}%)`,
      body:
        direction === "hike"
          ? "中央銀行が利上げに踏み切りました。借入コストが上がり景気と株価には逆風ですが、物価上昇は抑えられます。銀行株は利ざや改善で買われました。"
          : "中央銀行が利下げに踏み切りました。資金調達が容易になり景気と株価には追い風ですが、物価上昇のリスクが高まります。",
      deltas,
      benefits:
        direction === "hike"
          ? ["インフレ抑制", "銀行株に追い風"]
          : ["景気刺激", "成長株・自動車に追い風"],
      drawbacks:
        direction === "hike"
          ? ["GDP減速", "失業率の上昇", "成長株が下落"]
          : ["インフレ再燃のリスク"],
      comments: [
        makeComment(
          "finance",
          direction === "hike"
            ? "物価を最優先で抑えます。ただし利上げは景気と雇用に重い負担です。"
            : "景気を後押しします。物価が再加速しないか注視が必要です。",
        ),
        makeComment(
          "business",
          direction === "hike"
            ? "成長株や自動車には資金調達コストが重くなります。銀行には追い風です。"
            : "市場心理は改善します。資金が株式に戻ってくるでしょう。",
        ),
      ],
    };
    setLatestResult(result);
    setSpeakerId("finance");
    setNews((current) =>
      [
        {
          title: result.title,
          body: result.body,
          category: "経済" as const,
          deltas,
          reason: "金融政策の変更が、物価・景気・株式市場へ同時に波及したため。",
          comments: result.comments,
        },
        ...current,
      ].slice(0, 9),
    );
  }

  /** ターン共通: 統計・株価・ニュースを更新して画面を news へ */
  function commitTurn(
    finalStats: NationStats,
    policyNames: string,
    passiveEv: { title: string; body: string; category: NewsItem["category"]; deltas: StatDelta[] },
    choiceEventTitle?: string,
    choiceDeltas?: StatDelta[],
  ) {
    const turnDeltas = (Object.keys(finalStats) as StatKey[])
      .map((key) => ({
        key,
        amount: round1(finalStats[key] - stats[key]),
        reason:
          key === "inflation"
            ? "政策金利と需要の変化が物価に反映されたため。"
            : key === "unemployment"
              ? "政策投資と金利環境が企業の採用判断に影響したため。"
              : key === "gdp"
                ? "選択した政策・イベント対応・月次変動が生産・消費・投資を動かしたため。"
                : key === "budget"
                  ? "政策支出、税収、イベント対応費が予算に反映されたため。"
                  : key === "approval"
                    ? "生活実感と政策・イベント対応への評価が世論に反映されたため。"
                    : "月次政策とイベントの波及効果が反映されたため。",
      }))
      .filter((delta) => delta.amount !== 0);
    const rateComment =
      rate >= 4
        ? "利上げで銀行株には追い風ですが、成長企業や自動車には資金調達コストが重くなります。"
        : rate <= 1.5
          ? "利下げで成長株と自動車には追い風です。ただし物価再燃には注意が必要です。"
          : "中立金利圏では、企業業績は政策と外交ニュースにより強く反応します。";
    const turnResult: ActionResult = {
      title: `${year}年${month}月政策レビュー`,
      body: `${policyNames}を実行。${choiceEventTitle ? `「${choiceEventTitle}」への対応も加わり、` : ""}金利${rate.toFixed(1)}%のもと国家指標が変化しました。`,
      deltas: turnDeltas,
      benefits: [],
      drawbacks: [
        rate >= 4 ? "高金利で雇用と成長株に逆風" : rate <= 1.5 ? "低金利でインフレ再燃リスク" : "効果は緩やかで即効性は限定的",
      ],
      comments: [
        makeComment("finance", rateComment),
        makeComment("press", `${passiveEv.title}の影響もあり、今月の変化は政策だけでは説明できません。ニュース欄で因果を追えます。`),
      ],
    };
    setStats(finalStats);
    setCompanies((current) =>
      current.map((company) => {
        const rateBias =
          company.id === "bank"
            ? (rate - 2.5) * 24
            : company.id === "ai" || company.id === "auto"
              ? (2.5 - rate) * 22
              : company.id === "logistics"
                ? (finalStats.trust - stats.trust) * 4
                : 0;
        const macro =
          (finalStats.gdp - stats.gdp) * (company.bias.gdp ?? 0) +
          (finalStats.technology - stats.technology) * (company.bias.technology ?? 0) -
          (finalStats.unemployment - stats.unemployment) * (company.bias.unemployment ?? 0) -
          (company.bias.environment ?? 0) * (finalStats.environment - stats.environment) +
          rateBias;
        const nextPrice = Math.max(120, Math.round(company.price + macro * 5));
        const moved = nextPrice - company.price;
        let reason: string | undefined;
        if (Math.abs(moved) >= 3) {
          if (company.id === "bank" && rate >= 3) reason = `政策金利${rate.toFixed(1)}%の利上げ局面で、利ざや改善期待から買われた。`;
          else if ((company.id === "ai" || company.id === "auto") && rate >= 3) reason = "高金利で借入コストが上がり、成長期待銘柄に逆風。";
          else if ((company.id === "ai" || company.id === "auto") && rate <= 1.5) reason = "低金利で資金調達が容易になり、成長・自動車に追い風。";
          else if (finalStats.gdp - stats.gdp > 0 && (company.bias.gdp ?? 0) > 0) reason = "景気指標(GDP)の改善が業績期待を押し上げた。";
          else if (finalStats.gdp - stats.gdp < 0 && (company.bias.gdp ?? 0) > 0) reason = "景気減速で売上見通しが悪化した。";
          else reason = `政策・金利・イベント対応の波及で${moved >= 0 ? "買われた" : "売られた"}。`;
        }
        return { ...company, previousPrice: company.price, price: nextPrice, changeReason: reason };
      }),
    );
    setNations((current) =>
      current.map((item, index) => ({
        ...item,
        relation: clamp(item.relation + (finalStats.trust - stats.trust) * 0.15 + (index % 2 === 0 ? 1 : -1), 0, 100),
      })),
    );
    const newsItems: NewsItem[] = [
      {
        title: `${year}年${month}月政策レビュー`,
        body: turnResult.body,
        category: "政治" as const,
        deltas: turnDeltas,
        reason: "政策の短期効果、長期投資効果、政策金利、イベント対応を合算したため。",
        comments: turnResult.comments,
      },
      {
        title: passiveEv.title,
        body: passiveEv.body,
        category: passiveEv.category,
        deltas: passiveEv.deltas,
        reason: "世界情勢イベントが国内指標へ波及したため。",
      },
    ];
    if (choiceEventTitle && choiceDeltas) {
      newsItems.unshift({
        title: `イベント対応: ${choiceEventTitle}`,
        body: "あなたの選択が国家指標に影響を与えました。",
        category: "政治" as const,
        deltas: choiceDeltas,
        reason: "プレイヤーが選択したイベント対応の直接効果。",
      });
    }
    setNews((current) => [...newsItems, ...current].slice(0, 12));
    setLatestResult(turnResult);
    setSpeakerId(turnResult.comments[0]?.characterId ?? "finance");
    if (month === 12) { setYear((c) => c + 1); setMonth(1); } else { setMonth((c) => c + 1); }
    setMode("news");
    setPendingEvent(null);
    setPendingTurnData(null);
  }

  function advanceTurn() {
    const chosenPolicies = policies.filter((policy) => selectedPolicyIds.includes(policy.id));
    const shortEffect = mergeEffects(chosenPolicies.map((policy) => policy.short));
    const longEffect = mergeEffects(chosenPolicies.map((policy) => policy.long));
    const passiveIdx = (month + year) % passiveEvents.length;
    const passiveEvent = passiveEvents[passiveIdx];
    const baseStats = [shortEffect, longEffect, getRateEffect(rate), passiveEvent.effect].reduce<NationStats>(
      (next, effect) => applyEffect(next, effect),
      stats,
    );
    const policyNames = chosenPolicies.map((policy) => policy.name).join("・") || "大きな政策変更なし";
    const passiveDeltas = (Object.entries(passiveEvent.effect) as [StatKey, number][])
      .filter(([, v]) => v !== 0)
      .map(([key, amount]) => ({ key, amount: amount ?? 0, reason: "月次イベントの直接効果。" }));
    const passiveForTurn = { title: passiveEvent.title, body: passiveEvent.body, category: passiveEvent.category, deltas: passiveDeltas };

    // 3ターンに1回は選択型イベントを発動
    const shouldFireChoiceEvent = (month + year) % 3 === 0;
    if (shouldFireChoiceEvent && choiceEvents.length > 0) {
      const choiceEvent = choiceEvents[(month * year) % choiceEvents.length];
      setPendingTurnData({ policyNames, passiveEvent: passiveForTurn, baseStats });
      setPendingEvent(choiceEvent);
    } else {
      const finalStats = applyEffect(baseStats, baseStats.budget < 20 ? { approval: -2, trust: -2 } : {});
      commitTurn(finalStats, policyNames, passiveForTurn);
    }
  }

  /** イベント選択肢を選んだ後の処理 */
  function handleEventChoice(choice: EventChoice) {
    if (!pendingTurnData) return;
    const { policyNames, passiveEvent, baseStats } = pendingTurnData;
    const afterChoice = applyEffect(baseStats, choice.effect);
    const finalStats = applyEffect(afterChoice, afterChoice.budget < 20 ? { approval: -2, trust: -2 } : {});
    const choiceDeltas = (Object.entries(choice.effect) as [StatKey, number][])
      .filter(([, v]) => v !== 0)
      .map(([key, amount]) => ({ key, amount: amount ?? 0, reason: choice.explanation }));
    commitTurn(finalStats, policyNames, passiveEvent, pendingEvent?.title, choiceDeltas);
  }

  // 国未選択なら国選択画面を表示
  if (!selectedRealCountry) {
    return <CountrySelectScreen onSelect={handleCountrySelect} />;
  }

  return (
    <main className="game-shell">
      {/* 選択型イベントのポップアップ */}
      {pendingEvent && (
        <EventModal event={pendingEvent} onChoice={handleEventChoice} />
      )}
      <NationHeader
        nation={nation}
        year={year}
        month={month}
        crisisLevel={crisisLevel}
        marketIndex={marketIndex}
        budget={stats.budget}
        stats={stats}
        onNationChange={setNation}
        onNextTurn={advanceTurn}
      />

      <div className="app-frame">
        <StatusSidebar stats={stats} />
        <section className="command-center">
          {mode === "status" && (
            <StatusScreen nation={nation} stats={stats} year={year} month={month} />
          )}
          {mode === "policies" && (
            <PoliciesScreen
              policies={policies}
              rate={rate}
              selectedPolicyIds={selectedPolicyIds}
              onRateChange={setRate}
              onRateAction={handleRateAction}
              onTogglePolicy={togglePolicy}
              onAdvanceTurn={advanceTurn}
            />
          )}
          {mode === "map" && (
            <MapScreen
              playerNationName={nation.name}
              playerNationId={selectedRealCountry.id}
              nations={nations}
              selectedNationId={selectedNationId}
              latestResult={latestResult}
              onSelectNation={setSelectedNationId}
              onDiplomacy={handleDiplomacy}
            />
          )}
          {mode === "market" && (
            <MarketScreen companies={companies} marketIndex={marketIndex} />
          )}
          {mode === "news" && <NewsScreen news={news} />}
        </section>
        <RightRail
          characters={characters}
          speakerId={speakerId}
          latestResult={latestResult}
          latestNews={news[0]}
          onSpeakerChange={setSpeakerId}
        />
      </div>
      <ModeTabs mode={mode} onChange={setMode} />
    </main>
  );
}
