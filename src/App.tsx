import { useEffect, useMemo, useState } from "react";
import { EventModal } from "./components/EventModal";
import { PolicyConfirmModal } from "./components/PolicyConfirmModal";
import { ResultOverlay } from "./components/ResultOverlay";
import { RoomBanner } from "./components/RoomBanner";
import { ModeTabs } from "./components/ModeTabs";
import { NationHeader } from "./components/NationHeader";
import { RightRail } from "./components/RightRail";
import { StatusSidebar } from "./components/StatusSidebar";
import { newlyUnlocked, currentTitle } from "./data/achievements";
import type { Achievement } from "./data/achievements";
import { levelInfo, XP } from "./data/levels";
import { generateMissions, isMissionDone } from "./data/missions";
import type { Mission } from "./data/missions";
import { characters } from "./data/characters";
import { initialCompanies } from "./data/companies";
import { diplomacyActions } from "./data/diplomacy";
import { choiceEvents } from "./data/events";
import {
  pickDailyEvent,
  diplomacyChance,
  rollDiplomacy,
  countryPersonalityMod,
  type DiploTier,
} from "./data/dayEngine";
import { eraForYear, isUnlocked } from "./data/eras";
import { legacyScore, rankFor, rankTitle } from "./utils/score";
import { getProfession } from "./data/professions";
import { statLabels, statEasy } from "./data/stats";
import { realCountries, deriveRelation } from "./data/realCountries";
import type { RealCountry } from "./data/realCountries";
import { policies } from "./data/policies";
import { rooms } from "./data/rooms";
import { TUTORIAL_STEPS, tutorialDone, markTutorialDone } from "./data/tutorial";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { CountrySelectScreen } from "./screens/CountrySelectScreen";
import { PresidentRoom } from "./components/PresidentRoom";
import { IntroScreen } from "./screens/IntroScreen";
import { MapScreen } from "./screens/MapScreen";
import { MarketScreen } from "./screens/MarketScreen";
import { NewsScreen } from "./screens/NewsScreen";
import { PoliciesScreen } from "./screens/PoliciesScreen";
import { RankingScreen } from "./screens/RankingScreen";
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
  ScheduledEffect,
  StatDelta,
  StatKey,
} from "./types/game";
import { applyEffect, clamp, round1 } from "./utils/gameMath";
import { predictStockMoves } from "./utils/predict";
import { loadSave, writeSave, clearSave } from "./utils/save";

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

/** プレイヤー国以外の全ての国を外交対象にする（関係値はブロックから自動補完） */
function buildDiplomacyNations(playerCountry: RealCountry): Country[] {
  const others = realCountries.filter((c) => c.id !== playerCountry.id);
  // 関係値が極端な国（重要な相手）を前に並べる。全カ国を返す。
  const sorted = others
    .map((c) => ({ c, rel: deriveRelation(playerCountry, c) }))
    .sort((a, b) => Math.abs(b.rel - 50) - Math.abs(a.rel - 50));
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
  /** 端末に保存された進行データ（あれば続きから） */
  const initialSave = useMemo(() => loadSave(), []);
  const sv = initialSave as Record<string, any> | null;

  /** ゲーム開始フロー: 主人公プロフィール → 国選択 → プレイ */
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(
    () => (sv?.playerProfile as PlayerProfile) ?? null,
  );
  const [selectedRealCountry, setSelectedRealCountry] = useState<RealCountry | null>(
    () => (sv?.countryId ? realCountries.find((c) => c.id === sv.countryId) ?? null : null),
  );
  /** 政策確認モーダルで保留中の政策 */
  const [pendingPolicy, setPendingPolicy] = useState<Policy | null>(null);
  const [mode, setMode] = useState<GameMode>(() => (sv?.mode as GameMode) ?? "status");
  const [nation, setNation] = useState<PlayerNation>(
    () =>
      (sv?.nation as PlayerNation) ?? {
        name: "日本",
        doctrine: "技術立国",
        flagPrimary: "#ffffff",
        flagAccent: "#bc002d",
      },
  );
  const [month, setMonth] = useState<number>(() => sv?.month ?? 1);
  /** 開始は1850年。1ターン＝1年で近代史を追体験する */
  const [year, setYear] = useState<number>(() => sv?.year ?? 1850);
  /** day=日付（飾り）、dayCount=在任ターン数＝在任年数（1年目から） */
  const [day, setDay] = useState<number>(() => sv?.day ?? 1);
  const [dayCount, setDayCount] = useState<number>(() => sv?.dayCount ?? 1);
  /** 時間差で発生する後続効果のキュー（短期/中期/長期） */
  const [pendingEvents, setPendingEvents] = useState<ScheduledEffect[]>(
    () => (sv?.pendingEvents as ScheduledEffect[]) ?? [],
  );
  /** 直近の世界情勢（緊張度）。外交の成功率に影響し、毎日少しずつ収まる */
  const [worldTension, setWorldTension] = useState<number>(() => sv?.worldTension ?? 25);
  /** 平穏な日などの軽い通知 */
  const [dayToast, setDayToast] = useState<string | null>(null);
  /** 結末（退陣＝fail / 現代到達＝clear）。null ならプレイ中 */
  const [endState, setEndState] = useState<{ kind: "fail" | "clear"; title: string; body: string } | null>(null);
  const [stats, setStats] = useState<NationStats>(
    () =>
      (sv?.stats as NationStats) ?? {
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
      },
  );
  const [rate, setRate] = useState<number>(() => sv?.rate ?? 2.5);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>(["education"]);
  const [companies, setCompanies] = useState<Company[]>(
    () => (sv?.companies as Company[]) ?? initialCompanies,
  );
  const [nations, setNations] = useState<Country[]>(() => {
    if (sv?.nations) return sv.nations as Country[];
    const japan = realCountries.find((c) => c.id === "japan")!;
    return buildDiplomacyNations(japan);
  });
  const [selectedNationId, setSelectedNationId] = useState<string>(() => {
    if (sv?.selectedNationId) return sv.selectedNationId as string;
    const japan = realCountries.find((c) => c.id === "japan")!;
    return buildDiplomacyNations(japan)[0]?.id ?? "china";
  });
  const [speakerId, setSpeakerId] = useState<string>(() => sv?.speakerId ?? "finance");
  /** 実績・称号 */
  const [unlockedAchv, setUnlockedAchv] = useState<string[]>(() => sv?.unlockedAchv ?? []);
  const [achvToast, setAchvToast] = useState<Achievement | null>(null);
  const [policyCount, setPolicyCount] = useState<number>(() => sv?.policyCount ?? 0);
  const [diploCount, setDiploCount] = useState<number>(() => sv?.diploCount ?? 0);
  const [allianceCount, setAllianceCount] = useState<number>(() => sv?.allianceCount ?? 0);
  /** 経験値・レベル・ミッション（RPG要素） */
  const [xp, setXp] = useState<number>(() => sv?.xp ?? 0);
  const [missions, setMissions] = useState<Mission[]>(() => (sv?.missions as Mission[]) ?? []);
  const [levelUpToast, setLevelUpToast] = useState<number | null>(null);
  const [missionToast, setMissionToast] = useState<string | null>(null);
  /** チュートリアル：初回プレイ時のみ起動（-1=非表示） */
  const [tutorialStep, setTutorialStep] = useState<number>(-1);
  function advanceTutorial() {
    setTutorialStep((s) => {
      if (s >= TUTORIAL_STEPS.length - 1) {
        markTutorialDone();
        setMode("status");
        return -1;
      }
      const next = s + 1;
      setMode(TUTORIAL_STEPS[next].mode);
      return next;
    });
  }
  function skipTutorial() {
    markTutorialDone();
    setTutorialStep(-1);
    setMode("status");
  }
  /** XPを加算し、レベルアップしたら演出を出す */
  function gainXp(amount: number) {
    setXp((prev) => {
      const before = levelInfo(prev).level;
      const next = prev + amount;
      const after = levelInfo(next).level;
      if (after > before) {
        setLevelUpToast(after);
        setTimeout(() => setLevelUpToast(null), 3600);
      }
      return next;
    });
  }
  /** 現在表示中の選択型イベント */
  const [pendingEvent, setPendingEvent] = useState<GameEvent | null>(null);
  /** 実行結果オーバーレイ */
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  /** ターン処理中に積まれたパッシブ効果 (イベント選択後に合算) */
  /** 選択型イベント発生時、選択を待つ間に保持する「その日」の情報 */
  const [pendingTurnData, setPendingTurnData] = useState<{
    date: { year: number; month: number; day: number };
    dayCount: number;
    due: ScheduledEffect[];
    remaining: ScheduledEffect[];
  } | null>(null);
  const [latestResult, setLatestResult] = useState<ActionResult | undefined>(
    () =>
      (sv?.latestResult as ActionResult) ?? {
        title: "政権発足",
        body: "最初の国家運営が始まりました。政策、外交、市場の変化はニュースと大臣コメントに記録されます。",
        deltas: [],
        benefits: ["国民と市場に基本方針を示しました。"],
        drawbacks: ["まだ外交関係と産業政策は固まっていません。"],
        comments: [
          makeComment("finance", "予算と物価を同時に見ながら、無理のない成長軌道を作りましょう。"),
        ],
      },
  );
  const [news, setNews] = useState<NewsItem[]>(
    () =>
      (sv?.news as NewsItem[]) ?? [
        {
          title: "新政権が発足",
          body: "アジアの国家として、最初の国家方針が世界市場に注目されています。",
          category: "政治",
          reason: "国家の基本制度と初期予算が公開されたため。",
          comments: [
            makeComment("press", "読者が知りたいのは、数字が動いた理由です。すべて記録していきます。"),
          ],
        },
      ],
  );

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
    // 日付・後続イベント・世界情勢を初期化（1850年・就任1年目から）
    setYear(1850);
    setMonth(1);
    setDay(1);
    setDayCount(1);
    setPendingEvents([]);
    setWorldTension(25);
    setEndState(null);
    // RPG要素を初期化：経験値・回数リセット、本日の課題を生成
    setXp(0);
    setPolicyCount(0);
    setDiploCount(0);
    setAllianceCount(0);
    const mIndex = Math.round(initialCompanies.reduce((s, c) => s + c.price, 0) / initialCompanies.length);
    setMissions(generateMissions({ stats: startStats, policyCount: 0, diploCount: 0, marketIndex: mIndex }));
    // 初回プレイなら案内（チュートリアル）を開始
    if (!tutorialDone()) {
      setMode(TUTORIAL_STEPS[0].mode);
      setTutorialStep(0);
    }
  }

  const marketIndex = useMemo(
    () => Math.round(companies.reduce((sum, company) => sum + company.price, 0) / companies.length),
    [companies],
  );

  const crisisLevel =
    stats.budget < 0 || stats.approval < 30 || stats.inflation > 9
      ? "警戒"
      : "安定";

  // 在任月数
  const turnsElapsed = dayCount; // 在任年数（実績判定に使用）
  const era = eraForYear(year); // 現在の時代
  const playerTitle = currentTitle(unlockedAchv);
  const lvl = levelInfo(xp);

  // 実績の解除チェック（状態が変わるたびに評価）
  useEffect(() => {
    if (!selectedRealCountry) return;
    const ctx = { stats, turns: turnsElapsed, policies: policyCount, diplomacy: diploCount, alliances: allianceCount };
    const fresh = newlyUnlocked(ctx, unlockedAchv);
    if (fresh.length > 0) {
      setUnlockedAchv((prev) => [...prev, ...fresh.map((a) => a.id)]);
      setAchvToast(fresh[0]);
      setTimeout(() => setAchvToast(null), 3600);
    }
  }, [stats, turnsElapsed, policyCount, diploCount, allianceCount, selectedRealCountry, unlockedAchv]);

  // 本日の課題（ミッション）の達成チェック → 報酬XP＋演出
  useEffect(() => {
    if (!selectedRealCountry || missions.length === 0) return;
    const ctx = { stats, policyCount, diploCount, marketIndex };
    const justDone = missions.find((m) => !m.done && isMissionDone(m, ctx));
    if (justDone) {
      setMissions((prev) => prev.map((m) => (m.id === justDone.id ? { ...m, done: true } : m)));
      gainXp(XP.mission);
      setMissionToast(`ミッション達成！「${justDone.label}」 +${XP.mission}XP`);
      setTimeout(() => setMissionToast(null), 3200);
    }
  }, [stats, policyCount, diploCount, marketIndex, missions, selectedRealCountry]);

  // 結末の判定（退陣 / 現代到達）。一度きり。
  useEffect(() => {
    if (!selectedRealCountry || endState) return;
    if (stats.approval <= 2) {
      setEndState({ kind: "fail", title: "国民に見放された", body: "支持率が地に落ち、あなたは大統領の座を追われました。" });
    } else if (stats.budget <= -78) {
      setEndState({ kind: "fail", title: "財政が破綻した", body: "国庫が底をつき、政権は崩壊しました。あなたは責任を取り退陣します。" });
    } else if (year >= 2025) {
      setEndState({ kind: "clear", title: "歴史を駆け抜けた", body: "1850年から現代まで、あなたは国家を導き続けました。お疲れさまでした、大統領。" });
    }
  }, [stats.approval, stats.budget, year, selectedRealCountry, endState]);

  // 自動セーブ（この端末に保存。ゲーム開始後、状態が変わるたびに保存）
  useEffect(() => {
    if (!playerProfile || !selectedRealCountry) return;
    writeSave({
      v: 1,
      playerProfile,
      countryId: selectedRealCountry.id,
      mode,
      nation,
      month,
      year,
      day,
      dayCount,
      pendingEvents,
      worldTension,
      stats,
      rate,
      companies,
      nations,
      selectedNationId,
      speakerId,
      news,
      latestResult,
      unlockedAchv,
      policyCount,
      diploCount,
      allianceCount,
      xp,
      missions,
    });
  }, [
    playerProfile, selectedRealCountry, mode, nation, month, year, day, dayCount,
    pendingEvents, worldTension, stats, rate,
    companies, nations, selectedNationId, speakerId, news, latestResult,
    unlockedAchv, policyCount, diploCount, allianceCount, xp, missions,
  ]);

  function togglePolicy(id: string) {
    setSelectedPolicyIds((current) => {
      if (current.includes(id)) return current.filter((policyId) => policyId !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  }

  /** 政策の合計効果を前職ボーナス込みで計算 */
  /** 効果に前職ボーナス倍率をかける（プラス効果のみ強化、コストは据え置き） */
  function adjustEffect(effect: Partial<NationStats>, mult: number): Partial<NationStats> {
    if (mult === 1) return { ...effect };
    const out: Partial<NationStats> = {};
    for (const key of Object.keys(effect) as StatKey[]) {
      const v = effect[key] ?? 0;
      out[key] = v > 0 ? round1(v * mult) : v;
    }
    return out;
  }

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
    // 当日は「短期効果」だけ。長期効果は時間差で後から表れる。
    const effect = adjustEffect(policy.short, mult);
    const longEffect = adjustEffect(policy.long, mult);
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

    // 時間差の後続効果を予約：翌年に評価、数年後に長期効果
    const scheduled: ScheduledEffect[] = [];
    if (Object.keys(longEffect).length > 0) {
      scheduled.push({
        fireOnDay: dayCount + 1,
        title: `${policy.name}の効果が見え始める`,
        body: `${policy.name}から1年。現場での評価が少しずつ表れてきました。`,
        category: "政治",
        effect: { approval: 2, happiness: 1 },
      });
      scheduled.push({
        fireOnDay: dayCount + 3,
        title: `${policy.name}の長期効果が表れる`,
        body: `${policy.name}から数年。じっくり効いてくる効果が国の指標に表れました。`,
        category: "政治",
        effect: longEffect,
      });
    }
    if (scheduled.length > 0) setPendingEvents((prev) => [...prev, ...scheduled]);

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
    const longNote = Object.keys(longEffect).length > 0 ? "本格的な効果はこの先数年かけて表れる見込みです。" : "";
    const newsBody =
      `政府は「${policy.name}」を実行しました。${policy.summary} ` +
      (positives.length ? `これにより${positives.join("・")}が改善しました。` : "") +
      (negatives.length ? `一方で${negatives.join("・")}には負担がかかっています。` : "") +
      bonusNote + longNote;

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
    setPolicyCount((c) => c + 1);
    gainXp(XP.policy);
  }

  /** 友好度で段階解放された外交アクションを実行 (actionId は diplomacy.ts) */
  function handleDiplomacy(actionId: string) {
    const selectedNation = nations.find((item) => item.id === selectedNationId) ?? nations[0];
    const action = diplomacyActions.find((a) => a.id === actionId);
    if (!action) return;
    // 友好度が足りない（万一）なら何もしない
    if (selectedNation.relation < action.minRelation) return;

    // ===== 外交は必ず成功するわけではない。成功率を計算して結果ランクを決める =====
    const foreignSkill = 0.03 + Math.min(0.12, levelInfo(xp).level * 0.005); // 外務大臣＋大統領の練度
    const chance = diplomacyChance({
      relation: selectedNation.relation,
      trust: stats.trust,
      foreignSkill,
      worldTension,
      countryMod: countryPersonalityMod(selectedNation.id),
    });
    const tier: DiploTier = rollDiplomacy(chance);

    // ランクごとの結果（友好度の変化・効果倍率・追加効果・世界情勢）
    const base = action.relationDelta;
    let relChange: number;
    let effMult: number;
    let extra: Partial<NationStats> = {};
    let tensionDelta = 0;
    let toneNews: NewsItem | null = null;
    let stockShock = 0; // 大失敗で市場に走る動揺
    switch (tier) {
      case "大成功":
        relChange = Math.round(base * 1.7) + (base >= 0 ? 5 : 0);
        effMult = 1.6; extra = { trust: 3, approval: 2 }; tensionDelta = -6;
        break;
      case "成功":
        relChange = base; effMult = 1.0; tensionDelta = -2;
        break;
      case "普通":
        relChange = Math.round(base * 0.4); effMult = 0.4;
        break;
      case "失敗":
        relChange = base >= 0 ? -6 : base - 4; effMult = 0; extra = { approval: -3, trust: -2 }; tensionDelta = 4;
        toneNews = {
          title: `【速報】${selectedNation.name}との交渉が不調`,
          body: `${selectedNation.name}との${action.label}は思うように進まず、国内メディアが「成果が乏しい」と批判を強めています。`,
          category: "外交", affectedNation: selectedNation.name,
          reason: "外交交渉が不調に終わったため。",
        };
        break;
      case "大失敗":
      default:
        relChange = base >= 0 ? -12 : base - 8; effMult = 0; extra = { approval: -6, trust: -4, gdp: -4 }; tensionDelta = 9; stockShock = -24;
        toneNews = {
          title: `【速報】${selectedNation.name}との外交が問題化`,
          body: `${selectedNation.name}との${action.label}が決裂し、外交問題に発展。市場では株価が下落し、政権への風当たりが強まっています。`,
          category: "外交", affectedNation: selectedNation.name,
          reason: "外交の失敗が国内政治・市場に波及したため。",
        };
        break;
    }

    const scaledAction = adjustEffect(action.effect, effMult);
    const combined = mergeEffects([scaledAction, extra]);
    const prevRelation = Math.round(selectedNation.relation);
    const newRelation = Math.round(clamp(selectedNation.relation + relChange, 0, 100));
    const newStatus = newRelation >= 65 ? "協調" : newRelation >= 45 ? "実務関係" : "緊張";

    const deltas: StatDelta[] = (Object.entries(combined) as [StatKey, number][])
      .filter(([, v]) => Math.abs(v) >= 0.1)
      .map(([key, amount]) => ({
        key, amount: amount ?? 0,
        reason: `${selectedNation.name}との${action.label}（${tier}）の影響。`,
      }));

    const succeeded = tier === "大成功" || tier === "成功";
    const tierLine =
      tier === "大成功" ? "交渉は大成功。相手の信頼を大きく勝ち取りました。"
      : tier === "成功" ? "交渉は成功し、関係が前進しました。"
      : tier === "普通" ? "交渉はまずまず。可もなく不可もない結果です。"
      : tier === "失敗" ? "交渉は失敗。関係はかえってぎくしゃくしています。"
      : "交渉は大失敗。外交問題に発展してしまいました。";

    const result: ActionResult = {
      title: `${selectedNation.name}と「${action.label}」… ${tier}`,
      affectedNation: selectedNation.name,
      body:
        `${selectedNation.name}に対して${action.label}を行いました。${tierLine} ` +
        `（成功率の目安 ${Math.round(chance * 100)}%）両国の友好度は ${prevRelation} → ${newRelation} に変化しました。`,
      deltas,
      benefits: deltas.filter((d) => d.amount > 0).map((d) => `${statEasy[d.key]}が改善`),
      drawbacks: deltas.filter((d) => d.amount < 0).map((d) => `${statEasy[d.key]}に負担`),
      comments: [
        makeComment("foreign", succeeded
          ? `${selectedNation.name}との関係を前進させました。${action.reaction}`
          : `${selectedNation.name}との交渉は難しいものでした。仕切り直しが必要です。`),
        makeComment(tier === "大失敗" ? "press" : "business",
          tier === "大失敗"
            ? "外交の失敗は市場と世論を直撃します。早急な火消しが必要です。"
            : "外交は積み重ねです。世界情勢と相手国の出方を読みましょう。"),
      ],
    };

    setNations((current) =>
      current.map((item) =>
        item.id === selectedNationId ? { ...item, relation: newRelation, relationStatus: newStatus } : item,
      ),
    );
    setStats((current) => applyEffect(current, combined));
    setWorldTension((t) => clamp(t + tensionDelta, 0, 100));
    setLatestResult(result);
    setSpeakerId(result.comments[0]?.characterId ?? "foreign");

    // 株価への波及（成功時のみ貿易・技術が買われる。大失敗は動揺が走る）
    setCompanies((current) =>
      current.map((company) => {
        let move = 0;
        let reason = "";
        if (succeeded && action.id === "trade" && company.id === "logistics") {
          move = Math.round(34 * effMult); reason = `${selectedNation.name}との貿易協定で取扱貨物増を見込み、物流が買われた。`;
        } else if (succeeded && (action.id === "tech" || action.id === "alliance") && company.id === "ai") {
          move = Math.round(20 * effMult); reason = `${selectedNation.name}との${action.label}で技術連携期待が高まった。`;
        } else if (action.id === "sanction" && company.id === "logistics") {
          move = -26; reason = `${selectedNation.name}への制裁で貿易縮小が懸念され、物流が売られた。`;
        }
        if (stockShock !== 0) { move += stockShock; reason = reason || "外交問題化で投資家心理が冷え込んだ。"; }
        return move !== 0
          ? { ...company, previousPrice: company.price, price: Math.max(120, company.price + move), changeReason: reason }
          : { ...company, changeReason: undefined };
      }),
    );

    const news0: NewsItem = {
      title: `【速報】${selectedNation.name}と${action.label}（${tier}）`,
      body: result.body,
      category: "外交", affectedNation: selectedNation.name,
      deltas, reason: action.reason, comments: result.comments,
    };
    setNews((current) => [news0, ...(toneNews ? [toneNews] : []), ...current].slice(0, 14));
    setShowResultOverlay(true);
    setDiploCount((c) => c + 1);
    gainXp(XP.diplomacy);
    if (succeeded && action.id === "alliance") { setAllianceCount((c) => c + 1); gainXp(XP.alliance); }
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

  /** やさしい言葉で「影響：〇〇が上昇・△△が低下」を作る */
  function impactLine(effect: Partial<NationStats>): string {
    const parts = (Object.entries(effect) as [StatKey, number][])
      .filter(([, v]) => Math.abs(v) >= 0.1)
      .map(([k, v]) => `${statEasy[k]}が${v > 0 ? "上昇" : "低下"}`);
    return parts.length ? `影響：${parts.join("・")}` : "";
  }

  /** 1日ぶんの自然な変化（難易度：放置すると悪化する） */
  function dailyDrift(s: NationStats): Partial<NationStats> {
    const d: Partial<NationStats> = {};
    // 税収と固定支出（豊かさが高いほど黒字になりやすい＝予算制限は強め）
    d.budget = round1(s.gdp * 0.011 - 4.4);
    // 物価は「お金の借りやすさ」（金利が低い）ほどじわじわ上がる
    d.inflation = round1((2.3 - rate) * 0.05);
    let approval = 0;
    let happiness = 0;
    let trust = 0;
    if (s.budget < 0) { approval -= 1; happiness -= 0.8; trust -= 0.5; }
    else if (s.budget < 30) { approval -= 0.3; }
    if (s.approval < 35) { happiness -= 0.6; approval -= 0.4; } // 不満が不満を呼ぶ
    if (s.inflation > 6) { happiness -= 0.6; approval -= 0.3; }
    if (s.unemployment > 8) { approval -= 0.5; happiness -= 0.3; }
    if (approval) d.approval = round1(approval);
    if (happiness) d.happiness = round1(happiness);
    if (trust) d.trust = round1(trust);
    return d;
  }

  /** 1日を確定する：自然変化＋速報イベント＋後続効果＋（あれば）選択結果 */
  function commitDay(opts: {
    date: { year: number; month: number; day: number };
    nextDayCount: number;
    passive: GameEvent | null;
    due: ScheduledEffect[];
    remaining: ScheduledEffect[];
    choice?: { title: string; effect: Partial<NationStats>; explanation: string };
  }) {
    const { date, nextDayCount, passive, due, remaining, choice } = opts;
    const prevStats = stats;

    // 効果を順に合算
    const drift = dailyDrift(prevStats);
    const effects: Partial<NationStats>[] = [drift];
    for (const d of due) effects.push(d.effect);
    if (passive) effects.push(passive.effect);
    if (choice) effects.push(choice.effect);
    const finalStats = effects.reduce<NationStats>((acc, e) => applyEffect(acc, e), prevStats);

    const notable = !!passive || due.length > 0 || !!choice;

    // ===== ニュース（速報スタイル）=====
    const newsItems: NewsItem[] = [];
    if (choice) {
      const cd = (Object.entries(choice.effect) as [StatKey, number][])
        .filter(([, v]) => Math.abs(v) >= 0.1)
        .map(([key, amount]) => ({ key, amount: amount ?? 0, reason: choice.explanation }));
      newsItems.push({
        title: `【決定】${choice.title}`,
        body: `${choice.explanation} ${impactLine(choice.effect)}`,
        category: "政治", deltas: cd,
        reason: "あなたの決断が国を動かしました。",
      });
    }
    if (passive) {
      const pd = (Object.entries(passive.effect) as [StatKey, number][])
        .filter(([, v]) => Math.abs(v) >= 0.1)
        .map(([key, amount]) => ({ key, amount: amount ?? 0, reason: `${passive.title}の影響。` }));
      newsItems.push({
        title: `【速報】${passive.title}`,
        body: `${passive.body}${passive.citizen ? ` ${passive.citizen}` : ""} ${impactLine(passive.effect)}`,
        category: passive.category, deltas: pd,
        reason: "世の中の動きが国の指標に表れたため。",
      });
    }
    for (const d of due) {
      const dd = (Object.entries(d.effect) as [StatKey, number][])
        .filter(([, v]) => Math.abs(v) >= 0.1)
        .map(([key, amount]) => ({ key, amount: amount ?? 0, reason: d.title }));
      newsItems.push({
        title: d.title.startsWith("【") ? d.title : `【続報】${d.title}`,
        body: `${d.body} ${impactLine(d.effect)}`,
        category: d.category, deltas: dd,
        reason: "以前の出来事や政策の、時間差の効果です。",
      });
    }

    // ===== 株価への波及（その日の指標変化に反応。日次なので控えめ）=====
    setCompanies((current) =>
      current.map((company) => {
        const rateBias =
          company.id === "bank" ? (rate - 2.5) * 6
          : company.id === "ai" || company.id === "auto" ? (2.5 - rate) * 5
          : company.id === "logistics" ? (finalStats.trust - prevStats.trust) * 2
          : 0;
        const macro =
          (finalStats.gdp - prevStats.gdp) * (company.bias.gdp ?? 0) +
          (finalStats.technology - prevStats.technology) * (company.bias.technology ?? 0) -
          (finalStats.unemployment - prevStats.unemployment) * (company.bias.unemployment ?? 0) +
          rateBias;
        const nextPrice = Math.max(120, Math.round(company.price + macro * 4));
        const moved = nextPrice - company.price;
        let reason: string | undefined;
        if (Math.abs(moved) >= 3) {
          reason = moved >= 0 ? "その日の景気・ニュースを好感して買われた。" : "その日の悪材料を嫌気して売られた。";
        }
        return { ...company, previousPrice: company.price, price: nextPrice, changeReason: reason };
      }),
    );

    // 他国との関係は外交信用の変化でじわっと動く
    if (Math.abs(finalStats.trust - prevStats.trust) >= 0.1) {
      setNations((current) =>
        current.map((item) => ({
          ...item,
          relation: Math.round(clamp(item.relation + (finalStats.trust - prevStats.trust) * 0.1, 0, 100)),
        })),
      );
    }

    // ===== 世界情勢（緊張）は毎ターンすこし収まる。危機・対立で上がる =====
    let tension = Math.max(0, worldTension - 1);
    if (passive?.scope === "crisis") tension = clamp(tension + 5, 0, 100);
    if (passive?.scope === "diplo" && (passive.effect.trust ?? 0) < 0) tension = clamp(tension + 4, 0, 100);
    setWorldTension(tension);

    // ===== 後続効果のスケジュール（remaining ＋ 今回の速報の followups）=====
    // followups の afterDays は「日」単位で書かれているので、1ターン＝1年に合わせて
    // ターン数（年数）へ換算する（約30日＝1ターン）。最低1ターン後。
    const newScheduled: ScheduledEffect[] = [...remaining];
    if (passive?.followups) {
      for (const f of passive.followups) {
        const afterTurns = Math.max(1, Math.round(f.afterDays / 30));
        newScheduled.push({
          fireOnDay: nextDayCount + afterTurns,
          title: f.title, body: f.body, category: f.category, effect: f.effect,
        });
      }
    }
    setPendingEvents(newScheduled);

    // ===== 確定 =====
    setStats(finalStats);
    setYear(date.year);
    setMonth(date.month);
    setDay(date.day);
    setDayCount(nextDayCount);
    setPendingEvent(null);
    setPendingTurnData(null);

    if (notable) {
      const headline = choice ? `【決定】${choice.title}` : passive ? passive.title : due[0]?.title ?? "今年の動き";
      const allDeltas = newsItems.flatMap((n) => n.deltas ?? []);
      setLatestResult({
        title: `${date.year}年（${eraForYear(date.year).short}）の動き`,
        body: headline,
        deltas: allDeltas,
        benefits: allDeltas.filter((d) => d.amount > 0).map((d) => `${statEasy[d.key]}が改善`),
        drawbacks: allDeltas.filter((d) => d.amount < 0).map((d) => `${statEasy[d.key]}に負担`),
        comments: [
          makeComment(
            passive?.scope === "crisis" || choice ? "press" : "citizen",
            choice ? "あなたの決断を国民は注目しています。" : passive?.citizen ?? "世の中は少しずつ動いています。",
          ),
        ],
      });
      setSpeakerId("press");
      setNews((current) => [...newsItems, ...current].slice(0, 16));
      setShowResultOverlay(true);
    } else {
      // 平穏な年：大きな動きはなし。軽い通知だけ。
      setDayToast(`${date.year}年 — 平穏な一年。特に大きな動きはありません。`);
      setTimeout(() => setDayToast(null), 2600);
    }

    gainXp(XP.turn);

    // ミッションは常に3つを維持
    const mIndex = Math.round(companies.reduce((s, c) => s + c.price, 0) / companies.length);
    setMissions((prev) => {
      const kept = prev.filter((m) => !m.done);
      const fresh = generateMissions(
        { stats: finalStats, policyCount, diploCount, marketIndex: mIndex },
        Math.max(0, 3 - kept.length),
      );
      return [...kept, ...fresh].slice(0, 3);
    });
  }

  /** 「翌年へ進む」：1年進めて、その年の出来事を決める */
  function advanceTurn() {
    if (endState) return; // 退陣／完走後は進めない
    const nextYear = year + 1;
    const nextDate = { year: nextYear, month: 1, day: 1 };
    const nextDayCount = dayCount + 1;
    // 期日が来た後続効果を取り出す
    const due = pendingEvents.filter((e) => e.fireOnDay <= nextDayCount);
    const remaining = pendingEvents.filter((e) => e.fireOnDay > nextDayCount);

    // ときどき「決断を迫る」選択型イベントが起きる（序盤は出さない／時代に合うものだけ）
    const eligibleChoices = choiceEvents.filter((e) => isUnlocked(nextYear, e.since, e.until));
    const fireChoice = nextDayCount > 3 && Math.random() < 0.14 && eligibleChoices.length > 0;
    if (fireChoice) {
      const choiceEvent = eligibleChoices[Math.floor(Math.random() * eligibleChoices.length)];
      setPendingTurnData({ date: nextDate, dayCount: nextDayCount, due, remaining });
      setPendingEvent(choiceEvent);
      return; // 選択を待つ
    }

    const passive = pickDailyEvent(nextYear, nextDayCount);
    commitDay({ date: nextDate, nextDayCount, passive, due, remaining });
  }

  /** 選択型イベントで選択肢を選んだ後の処理 */
  function handleEventChoice(choice: EventChoice) {
    if (!pendingTurnData || !pendingEvent) return;
    const { date, dayCount: nextDayCount, due, remaining } = pendingTurnData;
    commitDay({
      date,
      nextDayCount,
      passive: null,
      due,
      remaining,
      choice: { title: pendingEvent.title, effect: choice.effect, explanation: choice.explanation },
    });
    gainXp(XP.eventChoice);
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

  const isHome = mode === "status";

  return (
    <main className={`game-shell ${isHome ? "home-active" : ""}`}>
      {/* 初回プレイの案内（チュートリアル） */}
      {tutorialStep >= 0 && (
        <TutorialOverlay step={tutorialStep} onNext={advanceTutorial} onSkip={skipTutorial} />
      )}
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
      {/* 実績解除トースト */}
      {achvToast && (
        <div className="achv-toast" onClick={() => setAchvToast(null)}>
          <span className="achv-toast-icon">{achvToast.icon}</span>
          <div className="achv-toast-text">
            <span className="achv-toast-label">実績解除！ 称号「{achvToast.title}」</span>
            <small>{achvToast.desc}</small>
          </div>
        </div>
      )}
      {/* レベルアップ演出 */}
      {levelUpToast !== null && (
        <div className="levelup-toast" onClick={() => setLevelUpToast(null)}>
          <span className="levelup-flash">LEVEL UP!</span>
          <strong>大統領レベル {levelUpToast}</strong>
          <small>{levelInfo(xp).title}</small>
        </div>
      )}
      {/* ミッション達成トースト */}
      {missionToast && (
        <div className="mission-toast" onClick={() => setMissionToast(null)}>
          ✔ {missionToast}
        </div>
      )}
      {/* 平穏な日などの軽い通知 */}
      {dayToast && (
        <div className="day-toast" onClick={() => setDayToast(null)}>
          {dayToast}
        </div>
      )}
      {/* 結末（退陣 / 現代到達）オーバーレイ */}
      {endState && (() => {
        const score = legacyScore(stats, dayCount);
        const rank = rankFor(score);
        return (
          <div className="end-overlay">
            <div className={`end-card ${endState.kind}`}>
              <span className="end-kicker">{endState.kind === "clear" ? "🏛 ENDING" : "⚑ GAME OVER"}</span>
              <h2 className="end-title">{endState.title}</h2>
              <p className="end-body">{endState.body}</p>
              <div className="end-rank">
                <span className={`end-rank-badge r-${rank}`}>{rank}</span>
                <div>
                  <strong>{rankTitle[rank]}</strong>
                  <small>歴史的評価スコア {score}</small>
                </div>
              </div>
              <div className="end-stats">
                <span>在任 <b>{dayCount}</b> 年（{year}年）</span>
                <span>支持 <b>{Math.round(stats.approval)}</b></span>
                <span>豊かさ <b>{Math.round(stats.gdp)}</b></span>
                <span>技術 <b>{Math.round(stats.technology)}</b></span>
                <span>外交 <b>{Math.round(stats.trust)}</b></span>
                <span>称号 <b>{lvl.title}</b></span>
              </div>
              <button type="button" className="end-restart" onClick={() => { clearSave(); location.reload(); }}>
                ▶ もう一度、歴史を動かす
              </button>
            </div>
          </div>
        );
      })()}
      {!isHome && (
        <NationHeader
          nation={nation}
          year={year}
          month={month}
          day={day}
          dayCount={dayCount}
          crisisLevel={crisisLevel}
          marketIndex={marketIndex}
          budget={stats.budget}
          stats={stats}
          onNationChange={setNation}
          onNextTurn={advanceTurn}
        />
      )}

      <div className="app-frame">
        {!isHome && <StatusSidebar stats={stats} />}
        <section className={`command-center room-${mode}`}>
          {!isHome && <RoomBanner room={rooms[mode]} />}
          {mode === "status" && (
            <PresidentRoom
              countryId={selectedRealCountry.id}
              nation={nation}
              stats={stats}
              policies={policies.filter((p) => isUnlocked(year, p.since, p.until))}
              year={year}
              eraName={era.name}
              eraShort={era.short}
              dayCount={dayCount}
              level={lvl.level}
              missions={missions}
              onRequestPolicy={setPendingPolicy}
              onNavigate={setMode}
              onNextTurn={advanceTurn}
            />
          )}
          {mode === "policies" && (
            <PoliciesScreen
              policies={policies.filter((p) => isUnlocked(year, p.since, p.until))}
              eraName={era.name}
              year={year}
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
        {!isHome && (
          <RightRail
            characters={characters}
            speakerId={speakerId}
            latestResult={latestResult}
            latestNews={news[0]}
            onSpeakerChange={setSpeakerId}
          />
        )}
      </div>
      <ModeTabs mode={mode} onChange={setMode} />
    </main>
  );
}
