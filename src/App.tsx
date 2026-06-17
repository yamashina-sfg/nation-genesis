import { useMemo, useState } from "react";
import { EventModal } from "./components/EventModal";
import { PolicyConfirmModal } from "./components/PolicyConfirmModal";
import { ResultOverlay } from "./components/ResultOverlay";
import { ModeTabs } from "./components/ModeTabs";
import { NationHeader } from "./components/NationHeader";
import { RightRail } from "./components/RightRail";
import { StatusSidebar } from "./components/StatusSidebar";
import { characters } from "./data/characters";
import { initialCompanies } from "./data/companies";
import { diplomacyActions } from "./data/diplomacy";
import { choiceEvents, passiveEvents } from "./data/events";
import { getProfession } from "./data/professions";
import { statLabels } from "./data/stats";
import { realCountries } from "./data/realCountries";
import type { RealCountry } from "./data/realCountries";
import { policies } from "./data/policies";
import { CountrySelectScreen } from "./screens/CountrySelectScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { MapScreen } from "./screens/MapScreen";
import { MarketScreen } from "./screens/MarketScreen";
import { NewsScreen } from "./screens/NewsScreen";
import { PoliciesScreen } from "./screens/PoliciesScreen";
import { RankingScreen } from "./screens/RankingScreen";
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
  PlayerProfile,
  Policy,
  StatDelta,
  StatKey,
} from "./types/game";
import { applyEffect, clamp, round1 } from "./utils/gameMath";
import { predictStockMoves } from "./utils/predict";

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
  /** ゲーム開始フロー: 主人公プロフィール → 国選択 → プレイ */
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [selectedRealCountry, setSelectedRealCountry] = useState<RealCountry | null>(null);
  /** 政策確認モーダルで保留中の政策 */
  const [pendingPolicy, setPendingPolicy] = useState<Policy | null>(null);
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
  /** 実行結果オーバーレイ */
  const [showResultOverlay, setShowResultOverlay] = useState(false);
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
    const profession = playerProfile ? getProfession(playerProfile.professionId) : getProfession("office");
    const leaderName = playerProfile?.name ?? "新大統領";
    setSelectedRealCountry(country);
    setNation({
      name: country.name,
      doctrine: country.ideology,
      flagPrimary: country.flagPrimary,
      flagAccent: country.flagAccent,
    });
    // 初期ステータスに前職ボーナスを加算
    const startStats = applyEffect(country.initialStats, profession.statBonus);
    setStats(startStats);
    const diplomacyNations = buildDiplomacyNations(country);
    setNations(diplomacyNations);
    setSelectedNationId(diplomacyNations[0]?.id ?? "china");
    setMode("status");
    setLatestResult({
      title: `${country.name} 政権発足 — ${leaderName}大統領`,
      body: `${profession.label}のあなたが、${country.name}の大統領に就任しました。「${profession.speech}」 ${country.description}`,
      deltas: (Object.entries(profession.statBonus) as [StatKey, number][]).map(([key, amount]) => ({
        key, amount: amount ?? 0, reason: `${profession.label}としての経験が活きています。`,
      })),
      benefits: country.specialTraits,
      drawbacks: ["財政赤字・物価高・外交問題が山積みです。"],
      comments: [
        makeComment("finance", `初期GDP ${Math.round(startStats.gdp)}、予算 ${Math.round(startStats.budget)}。まずは財政基盤を確認しましょう。`),
        makeComment("citizen", `${leaderName}大統領、私たちの暮らしをよろしくお願いします。`),
      ],
    });
    setNews([{
      title: `${leaderName}氏が${country.name}大統領に就任`,
      body: `${profession.label}出身の${leaderName}氏が、混乱する${country.name}の新大統領に選ばれました。財政・物価・外交と課題は山積みですが、国民は新しいリーダーに期待を寄せています。`,
      category: "政治",
      reason: "一般市民だったプレイヤーが大統領に就任したため。",
      comments: [
        makeComment("press", `${leaderName}新政権に世界が注目しています。最初の一手は何になるのでしょうか。`),
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

  /** 政策の合計効果を前職ボーナス込みで計算 */
  function policyEffectWithProfession(policy: Policy): Partial<NationStats> {
    const profession = playerProfile ? getProfession(playerProfile.professionId) : getProfession("office");
    const mult = profession.policyBonus[policy.id] ?? profession.policyBonus[policy.field] ?? 1;
    const merged = mergeEffects([policy.short, policy.long]);
    if (mult === 1) return merged;
    const boosted: Partial<NationStats> = {};
    for (const key of Object.keys(merged) as StatKey[]) {
      const v = merged[key] ?? 0;
      // プラス効果だけを強める（マイナスのコストは据え置き）
      boosted[key] = v > 0 ? round1(v * mult) : v;
    }
    return boosted;
  }

  /** 政策を即時実行する（確認モーダルで「実行する」を押した後） */
  function executePolicy(policy: Policy) {
    const profession = playerProfile ? getProfession(playerProfile.professionId) : getProfession("office");
    const mult = profession.policyBonus[policy.id] ?? profession.policyBonus[policy.field] ?? 1;
    const effect = policyEffectWithProfession(policy);
    const deltas: StatDelta[] = (Object.entries(effect) as [StatKey, number][])
      .filter(([, v]) => Math.abs(v) >= 0.1)
      .map(([key, amount]) => ({
        key,
        amount: amount ?? 0,
        reason:
          key === "budget" && (amount ?? 0) < 0
            ? `${policy.name}の財源として予算を支出したため。`
            : key === "approval"
              ? `${policy.name}への国民の評価が支持率に表れたため。`
              : key === "gdp"
                ? `${policy.name}が消費・投資・生産を動かしたため。`
                : `${policy.name}の効果が${statLabels[key]}に反映されたため。`,
      }));

    setStats((current) => applyEffect(current, effect));

    // 株価を更新（前職ボーナスで起業家は株式への影響大）
    const stockMult = profession.id === "founder" ? 1.4 : 1;
    setCompanies((current) =>
      current.map((company) => {
        let score = 0;
        for (const key of Object.keys(effect) as StatKey[]) {
          score += (effect[key] ?? 0) * (company.bias[key] ?? 0);
        }
        const move = Math.round(score * 5 * stockMult);
        let reason: string | undefined;
        if (Math.abs(move) >= 3) {
          reason = move > 0
            ? `${policy.name}が追い風となり、${company.name}は買われた。`
            : `${policy.name}が逆風となり、${company.name}は売られた。`;
        }
        return {
          ...company,
          previousPrice: company.price,
          price: Math.max(120, company.price + move),
          changeReason: reason,
        };
      }),
    );

    // ニュース記事を生成
    const positives = deltas.filter((d) => d.amount > 0).map((d) => statLabels[d.key]);
    const negatives = deltas.filter((d) => d.amount < 0).map((d) => statLabels[d.key]);
    const bonusNote = mult > 1 ? `${profession.label}の手腕で効果が高まりました。` : "";
    const newsBody =
      `政府は「${policy.name}」を実行しました。${policy.summary} ` +
      (positives.length ? `これにより${positives.join("・")}が改善しました。` : "") +
      (negatives.length ? `一方で${negatives.join("・")}には負担がかかっています。` : "") +
      bonusNote;

    const result: ActionResult = {
      title: policy.newsHeadline,
      body: newsBody,
      deltas,
      benefits: deltas.filter((d) => d.amount > 0).map((d) => `${statLabels[d.key]}が改善`),
      drawbacks: deltas.filter((d) => d.amount < 0).map((d) => `${statLabels[d.key]}に負担`),
      comments: [
        makeComment(policy.voices[0]?.characterId ?? "finance", policy.voices[0]?.text ?? "政策を実行しました。"),
        makeComment("press", `${policy.newsHeadline}。市民の反応はニュース欄で追えます。`),
      ],
    };

    setLatestResult(result);
    setSpeakerId(policy.voices[0]?.characterId ?? "finance");
    setNews((current) => [
      {
        title: policy.newsHeadline,
        body: newsBody,
        category: "政治" as const,
        deltas,
        reason: `${policy.name}を実行した直接の結果。`,
        comments: result.comments,
      },
      ...current,
    ].slice(0, 12));

    setPendingPolicy(null);
    setShowResultOverlay(true);
  }

  /** 友好度で段階解放された外交アクションを実行 (actionId は diplomacy.ts) */
  function handleDiplomacy(actionId: string) {
    const selectedNation = nations.find((item) => item.id === selectedNationId) ?? nations[0];
    const action = diplomacyActions.find((a) => a.id === actionId);
    if (!action) return;
    // 友好度が足りない（万一）なら何もしない
    if (selectedNation.relation < action.minRelation) return;

    const newRelation = clamp(selectedNation.relation + action.relationDelta, 0, 100);
    const newStatus = newRelation >= 65 ? "協調" : newRelation >= 45 ? "実務関係" : "緊張";

    const deltas: StatDelta[] = (Object.entries(action.effect) as [StatKey, number][])
      .filter(([, v]) => Math.abs(v) >= 0.1)
      .map(([key, amount]) => ({
        key,
        amount: amount ?? 0,
        reason:
          key === "gdp" && (amount ?? 0) > 0 ? `${selectedNation.name}との取引拡大でGDPが伸びたため。`
          : key === "trust" ? action.reason
          : key === "military" ? `${selectedNation.name}との安全保障協力で防衛力が高まったため。`
          : key === "budget" ? "外交・協力にかかる費用が発生したため。"
          : key === "gdp" ? `${selectedNation.name}との関係悪化で貿易が縮小したため。`
          : `${action.label}の影響が${statLabels[key]}に反映されたため。`,
      }));

    const result: ActionResult = {
      title: `${selectedNation.name}と「${action.label}」を実施`,
      affectedNation: selectedNation.name,
      body:
        `${selectedNation.name}に対して${action.label}を行いました。${action.reason} ` +
        `相手国の反応：${action.reaction} ` +
        `両国の友好度は ${selectedNation.relation} → ${newRelation} に変化しました。`,
      deltas,
      benefits: deltas.filter((d) => d.amount > 0).map((d) => `${statLabels[d.key]}が改善`),
      drawbacks: deltas.filter((d) => d.amount < 0).map((d) => `${statLabels[d.key]}に負担`),
      comments: [
        makeComment("foreign", `${selectedNation.name}との関係を${action.relationDelta >= 0 ? "前進" : "見直し"}させました。${action.reaction}`),
        makeComment(
          action.effect.military ? "defense" : action.effect.gdp ? "business" : "press",
          action.effect.military
            ? "安全保障協力は周辺国へのメッセージにもなります。バランスが重要です。"
            : action.effect.gdp
              ? "経済への波及は市場が織り込みます。次の一手で勢いを保ちましょう。"
              : "外交は積み重ねです。今回の一歩が次の選択肢を開きます。",
        ),
      ],
    };

    setNations((current) =>
      current.map((item) =>
        item.id === selectedNationId
          ? { ...item, relation: newRelation, relationStatus: newStatus }
          : item,
      ),
    );
    setStats((current) => applyEffect(current, effectFromDeltas(deltas)));
    setLatestResult(result);
    setSpeakerId(result.comments[0]?.characterId ?? "foreign");

    // 株価への波及（貿易・制裁は物流とエネルギーに直撃）
    setCompanies((current) =>
      current.map((company) => {
        let move = 0;
        let reason = "";
        if (action.id === "trade" && company.id === "logistics") {
          move = 38; reason = `${selectedNation.name}との貿易協定で取扱貨物増を見込み、物流が買われた。`;
        } else if (action.id === "sanction" && company.id === "logistics") {
          move = -30; reason = `${selectedNation.name}への制裁で貿易縮小が懸念され、物流が売られた。`;
        } else if (action.id === "sanction" && company.id === "energy") {
          move = 10; reason = "制裁で供給不安が意識され、エネルギーが買われた。";
        } else if ((action.id === "tech" || action.id === "alliance") && company.id === "ai") {
          move = 22; reason = `${selectedNation.name}との${action.label}で技術連携期待が高まった。`;
        }
        return move !== 0
          ? { ...company, previousPrice: company.price, price: Math.max(120, company.price + move), changeReason: reason }
          : { ...company, changeReason: undefined };
      }),
    );

    setNews((current) =>
      [
        {
          title: `${selectedNation.name}と${action.label}`,
          body: result.body,
          category: "外交" as const,
          affectedNation: selectedNation.name,
          deltas,
          reason: action.reason,
          comments: result.comments,
        },
        ...current,
      ].slice(0, 12),
    );
    setShowResultOverlay(true);
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
    // 金利アクション結果オーバーレイを表示
    setShowResultOverlay(true);
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
    // 株価指数ニュース（景気と金利から市場の方向を判断）
    const gdpMove = finalStats.gdp - stats.gdp;
    if (Math.abs(gdpMove) >= 6 || Math.abs(rate - 2.5) >= 1.5) {
      const up = gdpMove >= 0 && rate < 4;
      newsItems.push(
        up
          ? {
              title: "国内株価指数が上昇、資産効果に期待",
              body: "景気の改善期待から国内株価指数が上昇しました。株を持つ家庭や年金の資産が増え、消費マインドの上向きが期待されています。",
              category: "市場" as const,
              reason: "景気指標の改善が投資家心理を強気にしたため。",
            }
          : {
              title: "国内株価指数が下落、投資家心理が悪化",
              body: "景気減速や金利上昇への警戒から国内株価指数が下落しました。企業の資金調達が難しくなり、消費マインドの冷え込みが懸念されています。",
              category: "市場" as const,
              reason: "景気の鈍化や高金利が投資家心理を弱気にしたため。",
            },
      );
    }
    setNews((current) => [...newsItems, ...current].slice(0, 14));
    setLatestResult(turnResult);
    setSpeakerId(turnResult.comments[0]?.characterId ?? "finance");
    if (month === 12) { setYear((c) => c + 1); setMonth(1); } else { setMonth((c) => c + 1); }
    setMode("news");
    setPendingEvent(null);
    setPendingTurnData(null);
    // 結果オーバーレイを表示
    setShowResultOverlay(true);
  }

  function advanceTurn() {
    // 政策は即時実行モデルになったので、ターン進行は「時間が経つ＝世界が動く」処理。
    // 毎ターン、世界イベント／市民イベントが一定確率で発生する。
    const roll = (month * 7 + year * 13) % passiveEvents.length;
    const passiveEvent = passiveEvents[roll];
    const baseStats = [getRateEffect(rate), passiveEvent.effect].reduce<NationStats>(
      (next, effect) => applyEffect(next, effect),
      stats,
    );
    const passiveDeltas = (Object.entries(passiveEvent.effect) as [StatKey, number][])
      .filter(([, v]) => v !== 0)
      .map(([key, amount]) => ({ key, amount: amount ?? 0, reason: `${passiveEvent.title}の直接の影響。` }));
    const passiveForTurn = { title: passiveEvent.title, body: passiveEvent.body, category: passiveEvent.category, deltas: passiveDeltas };

    // 3ターンに1回は選択型イベント（プレイヤーの決断を求める）を発動
    const shouldFireChoiceEvent = (month + year) % 3 === 0;
    if (shouldFireChoiceEvent && choiceEvents.length > 0) {
      const choiceEvent = choiceEvents[(month * year) % choiceEvents.length];
      setPendingTurnData({ policyNames: "今月の国政運営", passiveEvent: passiveForTurn, baseStats });
      setPendingEvent(choiceEvent);
    } else {
      const finalStats = applyEffect(baseStats, baseStats.budget < 20 ? { approval: -2, trust: -2 } : {});
      commitTurn(finalStats, "今月の国政運営", passiveForTurn);
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

  // ① 主人公プロフィール未設定 → 導入ストーリー画面
  if (!playerProfile) {
    return <IntroScreen onComplete={setPlayerProfile} />;
  }
  // ② 国未選択 → 国選択画面
  if (!selectedRealCountry) {
    return <CountrySelectScreen onSelect={handleCountrySelect} />;
  }

  const predictedPolicyEffect = pendingPolicy ? policyEffectWithProfession(pendingPolicy) : {};

  return (
    <main className="game-shell">
      {/* 政策確認モーダル（賛成/反対 → 実行/やめる） */}
      {pendingPolicy && (
        <PolicyConfirmModal
          policy={pendingPolicy}
          predictedEffect={predictedPolicyEffect}
          predictedStocks={predictStockMoves(predictedPolicyEffect, companies)}
          onExecute={() => executePolicy(pendingPolicy)}
          onCancel={() => setPendingPolicy(null)}
        />
      )}
      {/* 選択型イベントのポップアップ */}
      {pendingEvent && (
        <EventModal event={pendingEvent} onChoice={handleEventChoice} />
      )}
      {/* 実行結果オーバーレイ */}
      {showResultOverlay && latestResult && !pendingEvent && !pendingPolicy && (
        <ResultOverlay
          result={latestResult}
          year={year}
          month={month}
          onClose={() => setShowResultOverlay(false)}
        />
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
              onRateChange={setRate}
              onRateAction={handleRateAction}
              onRequestPolicy={setPendingPolicy}
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
          {mode === "ranking" && (
            <RankingScreen
              playerName={nation.name}
              playerStats={stats}
              marketIndex={marketIndex}
              playerCountryId={selectedRealCountry.id}
            />
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
