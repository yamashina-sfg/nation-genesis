import type { GameEvent } from "../types/game";
import { historyEvents1850 } from "./historyEvents1850";
import { historyEvents1900 } from "./historyEvents1900";
import { historyEvents1919 } from "./historyEvents1919";
import { historyEvents1939 } from "./historyEvents1939";
import { historyEvents1945 } from "./historyEvents1945";
import { historyEvents1973 } from "./historyEvents1973";
import { historyEvents1991 } from "./historyEvents1991";
import { historyEvents2008 } from "./historyEvents2008";

/**
 * ゲームイベント一覧。
 * choices がある場合 → プレイヤーが選択するポップアップ型
 * choices がない場合 → effect を自動適用するパッシブ型
 */
export const eventDeck: GameEvent[] = [
  /* ===== 選択型イベント ===== */
  {
    id: "epidemic",
    title: "感染症が国内で拡大中",
    body: "国内で新型ウイルスが広がり、病院が逼迫し始めました。対応を迫られています。",
    category: "災害",
    effect: {},
    voices: [
      { characterId: "citizen", stance: "support", text: "命が第一です。多少経済が止まっても規制を。" },
      { characterId: "business", stance: "oppose", text: "経済を止めれば倒産が相次ぎます。慎重に。" },
      { characterId: "finance", stance: "neutral", text: "給付には予算が要ります。財源とのバランスを。" },
    ],
    choices: [
      {
        id: "quarantine",
        label: "国境封鎖・行動制限",
        description: "感染を抑えるが経済が停止する",
        effect: { gdp: -20, budget: -18, happiness: -8, approval: 3 },
        explanation: "感染拡大は抑制されますが、経済活動が止まりGDPが下落します。財政支出も増えますが、対応の速さを国民は評価します。",
      },
      {
        id: "ignore",
        label: "経済優先・規制なし",
        description: "経済は維持されるが感染が拡大",
        effect: { gdp: 5, happiness: -18, approval: -12, trust: -4 },
        explanation: "経済へのダメージは最小ですが、感染が拡大し幸福度が急落します。無責任と見なされ支持率と国際信用が下がります。",
      },
      {
        id: "stimulus",
        label: "給付金＋部分的規制",
        description: "財政負担は大きいがバランス型",
        effect: { gdp: -8, budget: -25, happiness: -3, approval: 5 },
        explanation: "感染を抑えつつ給付金で生活を支援します。財政への負担は最大ですが、国民の評価が上がります。",
      },
    ],
  },
  {
    id: "protests",
    title: "大規模デモが首都で発生",
    body: "経済格差や政策への不満が噴出し、数万人が首都の広場に集結しました。",
    category: "政治",
    effect: {},
    voices: [
      { characterId: "citizen", stance: "support", text: "声に耳を傾けるべきです。対話を。" },
      { characterId: "defense", stance: "oppose", text: "秩序を守るのも政府の責任です。放置はできません。" },
      { characterId: "finance", stance: "neutral", text: "要求を全部のめば財政がもちません。" },
    ],
    choices: [
      {
        id: "dialogue",
        label: "対話・政策見直しを約束",
        description: "短期的に支持率が回復する",
        effect: { approval: 10, happiness: 5, trust: 2, budget: -5 },
        explanation: "誠実な対話姿勢が評価され、支持率が回復します。ただし約束した政策の実行が後で求められます。",
      },
      {
        id: "suppress",
        label: "治安部隊で鎮圧",
        description: "秩序は回復するが強権との批判",
        effect: { approval: -15, happiness: -10, trust: -8, military: 2 },
        explanation: "短期的に秩序は回復しますが、強権的と見なされ支持率・外交信用が大幅に下落します。",
      },
      {
        id: "concession",
        label: "一部要求を受け入れる",
        description: "財政負担と引き換えに安定化",
        effect: { approval: 6, happiness: 8, budget: -15, gdp: -3 },
        explanation: "デモ隊の要求の一部を受け入れることで事態を収拾します。財政支出は増えますが穏便な解決策です。",
      },
    ],
  },
  {
    id: "energy_crisis",
    since: 1900,
    title: "エネルギー価格が急騰",
    body: "国際情勢の悪化でエネルギー輸入コストが急上昇しています。家庭と企業が直撃を受けています。",
    category: "経済",
    effect: {},
    voices: [
      { characterId: "citizen", stance: "support", text: "補助金で家計を守ってほしいです。" },
      { characterId: "finance", stance: "oppose", text: "補助金は財政を圧迫します。出口戦略が必要です。" },
      { characterId: "business", stance: "neutral", text: "長期的には再エネ投資で自給率を上げるべきです。" },
    ],
    choices: [
      {
        id: "subsidy",
        label: "政府補助金で価格を抑える",
        description: "財政を使って国民負担を軽減",
        effect: { budget: -22, happiness: 3, approval: 7, inflation: -1 },
        explanation: "国民の生活を守れますが財政負担が大きくなります。物価上昇も一時的に抑えられます。",
      },
      {
        id: "market",
        label: "市場に任せる",
        description: "財政は守るが国民生活が苦しくなる",
        effect: { budget: 0, happiness: -12, approval: -8, inflation: 3 },
        explanation: "財政は守られますが物価が上昇し、国民の生活が苦しくなります。支持率が大きく下落します。",
      },
      {
        id: "renewable",
        label: "再生可能エネルギーへ転換投資",
        description: "長期投資で根本解決を狙う",
        effect: { budget: -30, environment: 8, technology: 4, happiness: -4 },
        explanation: "大きな財政出動が必要ですが、将来のエネルギー自給率が上がり技術力も向上します。",
      },
    ],
  },
  {
    id: "corruption_scandal",
    title: "政府高官の汚職疑惑が浮上",
    body: "メディアが政府幹部の資金不正流用を報道。国民の怒りが高まっています。",
    category: "政治",
    effect: {},
    choices: [
      {
        id: "investigate",
        label: "独立委員会で徹底調査",
        description: "透明性を示し信頼を回復",
        effect: { approval: 8, trust: 6, happiness: 2, budget: -8 },
        explanation: "公正な調査姿勢が評価され、長期的な信頼回復につながります。調査費用はかかります。",
      },
      {
        id: "coverup",
        label: "内部処理・表沙汰にしない",
        description: "リスクを隠すが発覚時に大ダメージ",
        effect: { approval: -4, trust: -10, happiness: -3 },
        explanation: "一時的にスキャンダルを抑え込めますが、外交信用が大きく下落します。後で発覚するリスクもあります。",
      },
      {
        id: "scapegoat",
        label: "担当者を更迭・責任を取らせる",
        description: "組織は守るがトップへの疑念残る",
        effect: { approval: 4, trust: 1, happiness: 1, budget: -3 },
        explanation: "スピード感のある対応として評価されますが、根本解決になっておらず疑念は残ります。",
      },
    ],
  },
  {
    id: "recession",
    title: "景気後退の兆候が現れる",
    body: "GDP成長率が鈍化し、企業の設備投資が減少しています。失業率が上昇傾向です。",
    category: "経済",
    effect: {},
    voices: [
      { characterId: "business", stance: "support", text: "今は大胆な財政出動で景気を支えるべきです。" },
      { characterId: "finance", stance: "oppose", text: "赤字を膨らませれば将来にツケが回ります。" },
      { characterId: "citizen", stance: "neutral", text: "仕事が減るのが一番こわいです。雇用を守って。" },
    ],
    choices: [
      {
        id: "stimulus_spend",
        label: "大規模公共投資で景気刺激",
        description: "GDPは回復するが財政は悪化",
        effect: { gdp: 25, budget: -35, unemployment: -1.2, approval: 5 },
        explanation: "インフラ投資や公共工事でGDPを押し上げ雇用を創出します。ただし財政赤字が拡大します。",
      },
      {
        id: "austerity",
        label: "緊縮財政で財政を守る",
        description: "財政健全化だが景気はさらに悪化",
        effect: { budget: 20, gdp: -15, unemployment: 1.5, approval: -10 },
        explanation: "財政を立て直す一方、政府支出の削減で景気をさらに冷やすリスクがあります。",
      },
      {
        id: "tax_cut_stim",
        label: "減税で消費を刺激",
        description: "企業・家計を刺激するが税収減",
        effect: { gdp: 15, budget: -18, unemployment: -0.5, happiness: 5 },
        explanation: "消費と投資を促進しますが税収が減ります。中間的な景気対策です。",
      },
    ],
  },

  /* ===== アジア特有の選択型イベント ===== */
  {
    id: "nkorea_icbm",
    since: 1990,
    title: "北朝鮮がICBMを発射",
    body: "北朝鮮が弾道ミサイルを日本海に向けて発射しました。地域の緊張が一気に高まっています。国際社会は対応を求めています。",
    category: "外交",
    effect: {},
    choices: [
      {
        id: "un_sanction",
        label: "国連制裁を提案",
        description: "国際協調で圧力をかける",
        effect: { trust: 8, military: 2, budget: -5, happiness: -3 },
        explanation: "国連安保理での制裁決議を主導し、国際信用が向上します。ただし実効性には限界があり、国民の不安は続きます。",
      },
      {
        id: "dialogue",
        label: "対話路線を維持",
        description: "外交チャネルを保つ",
        effect: { trust: -3, approval: -5, happiness: -5, military: 0 },
        explanation: "対話を続けることで緊張を管理しますが、弱腰と批判され支持率と外交信用が下落します。",
      },
      {
        id: "defense_boost",
        label: "防衛力を強化",
        description: "迎撃システムを整備",
        effect: { military: 10, budget: -20, trust: 2, happiness: -2 },
        explanation: "ミサイル防衛システムへの投資で抑止力が向上します。財政負担が増えますが、国民の安心感につながります。",
      },
    ],
  },
  {
    id: "southchinasea",
    since: 1990,
    title: "南シナ海で中国船が領海侵犯",
    body: "中国海警局の船舶が自国が主張する排他的経済水域に侵入し、漁船に接近しました。国際的な注目が集まっています。",
    category: "外交",
    effect: {},
    choices: [
      {
        id: "diplomatic_protest",
        label: "外交抗議を行う",
        description: "大使呼び出しで抗議",
        effect: { trust: 4, approval: 3, happiness: -2, military: 0 },
        explanation: "外交チャネルを通じた抗議は穏健な対応として評価されますが、抑止力への効果は限定的です。",
      },
      {
        id: "naval_patrol",
        label: "海軍パトロールを強化",
        description: "存在感を示す",
        effect: { military: 5, approval: 5, budget: -12, trust: -3 },
        explanation: "海上での存在感が増し国民支持が上がりますが、対中関係が悪化し防衛費も増加します。",
      },
      {
        id: "ignore",
        label: "黙認・エスカレーション回避",
        description: "対立を避け経済関係を守る",
        effect: { trust: -6, approval: -8, happiness: -4, gdp: 5 },
        explanation: "対立を避けることで短期的な経済的損失を防げますが、外交信用と支持率が大きく下落します。",
      },
    ],
  },
  {
    id: "taiwan_strait",
    since: 1990,
    title: "台湾海峡の緊張が高まる",
    body: "中国軍が台湾周辺で大規模軍事演習を実施しました。半導体サプライチェーンへの影響が懸念されています。",
    category: "外交",
    effect: {},
    choices: [
      {
        id: "us_drill",
        label: "米軍と合同演習を実施",
        description: "抑止力を示す",
        effect: { military: 8, trust: 5, budget: -15, happiness: -3 },
        explanation: "同盟国との連帯を示し抑止力が向上します。ただし中国との関係悪化と防衛費増加が避けられません。",
      },
      {
        id: "neutral",
        label: "中立を維持",
        description: "どちらにも肩入れしない",
        effect: { trust: -2, approval: -3, gdp: 5, happiness: 0 },
        explanation: "経済的損失を最小限に抑えますが、曖昧な立場として批判を受けます。",
      },
      {
        id: "china_support",
        label: "中国の立場を支持",
        description: "対中関係を優先",
        effect: { trust: -10, approval: -12, gdp: 15, military: -3 },
        explanation: "中国との経済関係は維持できますが、民主主義陣営から激しく批判され国際信用が急落します。",
      },
    ],
  },
  {
    id: "asia_currency_crisis",
    since: 1990,
    title: "アジア通貨危機の兆候",
    body: "新興アジア通貨が急落し、1997年のアジア通貨危機再来が懸念されています。外資が流出し始めました。",
    category: "経済",
    effect: {},
    choices: [
      {
        id: "fx_intervention",
        label: "為替介入を実施",
        description: "外貨準備を使い通貨を防衛",
        effect: { inflation: -1.5, budget: -25, trust: 5, gdp: -5 },
        explanation: "通貨価値の急落を防ぎ市場の信用を保ちますが、外貨準備の消耗と財政悪化が伴います。",
      },
      {
        id: "imf_coord",
        label: "IMFと協調",
        description: "国際的枠組みで対応",
        effect: { trust: 8, approval: -5, gdp: -10, budget: 10 },
        explanation: "IMFとの協調が外部信用を高めますが、緊縮条件が伴い国民の不満が増えます。",
      },
      {
        id: "protectionism",
        label: "保護主義的措置",
        description: "資本規制で流出を阻止",
        effect: { trust: -8, gdp: -8, inflation: 2, approval: 2 },
        explanation: "資本流出を一時的に食い止めますが、外交信用と経済効率が大きく損なわれます。",
      },
    ],
  },
  {
    id: "typhoon",
    title: "大型台風が直撃",
    body: "過去最大級の台風が上陸し、沿岸部を中心に甚大な被害が発生しました。数十万人が避難を余儀なくされています。",
    category: "災害",
    effect: {},
    choices: [
      {
        id: "emergency_budget",
        label: "緊急予算で対応",
        description: "財政を使い即座に復旧",
        effect: { budget: -30, happiness: 5, approval: 8, environment: -3 },
        explanation: "大規模な支出で迅速な復旧が可能になり、国民の評価が上がります。財政への負担は大きいです。",
      },
      {
        id: "intl_aid",
        label: "国際支援を要請",
        description: "外国からの援助を募る",
        effect: { trust: -3, approval: -2, budget: -8, happiness: -2 },
        explanation: "財政負担を軽減できますが、他国に依存する姿勢として批判を受け、国際信用も若干低下します。",
      },
      {
        id: "military_deploy",
        label: "軍を動員",
        description: "自衛隊・軍を救援に投入",
        effect: { military: -2, approval: 10, happiness: 3, budget: -15 },
        explanation: "軍の素早い展開で被災者支援を迅速に行い、高い支持を得ます。ただし軍の即応能力が一時低下します。",
      },
    ],
  },
  {
    id: "semiconductor_war",
    since: 2000,
    title: "テクノロジー覇権争い (半導体)",
    body: "米中の半導体輸出規制が激化し、サプライチェーンの再編が迫られています。国内産業への影響が深刻化しています。",
    category: "技術",
    effect: {},
    choices: [
      {
        id: "domestic_support",
        label: "国内生産を支援",
        description: "補助金で半導体産業を育成",
        effect: { technology: 8, budget: -28, gdp: 5, trust: 2 },
        explanation: "長期的な技術自給率が向上しますが、大規模な財政支出が必要です。",
      },
      {
        id: "ally_coord",
        label: "同盟国と協調",
        description: "友好国とサプライチェーン構築",
        effect: { trust: 10, technology: 4, gdp: 8, budget: -10 },
        explanation: "同盟国との分業で効率的なサプライチェーンが構築でき、外交信用も向上します。",
      },
      {
        id: "china_cooperate",
        label: "中国と協力",
        description: "コスト重視で中国と取引",
        effect: { trust: -8, gdp: 15, technology: -2, approval: -3 },
        explanation: "短期的なコスト優位を得られますが、西側諸国から批判され外交信用が大きく下落します。",
      },
    ],
  },
  {
    id: "asean_summit",
    since: 1970,
    title: "ASEAN首脳会議の主催権",
    body: "今年のASEAN首脳会議の議長国に選ばれる機会が訪れました。積極的に主催するか、役割を絞るかが問われています。",
    category: "外交",
    effect: {},
    choices: [
      {
        id: "host_active",
        label: "積極的に主催",
        description: "リーダーシップを発揮",
        effect: { trust: 12, approval: 5, budget: -20, gdp: 8 },
        explanation: "地域外交のリーダーとして認知され、国際信用と経済的プレゼンスが向上します。開催費用は大きいです。",
      },
      {
        id: "participate",
        label: "参加のみ",
        description: "主催を辞退し参加者として参加",
        effect: { trust: 2, budget: -3, approval: 0, gdp: 2 },
        explanation: "費用を抑えつつ外交関係を維持できますが、リーダーシップ機会を逃します。",
      },
      {
        id: "absent",
        label: "欠席",
        description: "国内問題を優先",
        effect: { trust: -8, approval: -4, budget: 0, gdp: -3 },
        explanation: "国内に集中できますが、地域連帯から離反したとみなされ外交信用が大きく下落します。",
      },
    ],
  },

  /* ===== 1850〜：近代国家づくりの決断 ===== */
  {
    id: "unequal_treaty",
    since: 1850,
    until: 1905,
    title: "強国から不利な条約を迫られている",
    body: "強大な国が、自国に不利な貿易条約を結ぶよう圧力をかけてきました。閣内は対応で割れています。",
    category: "外交",
    scope: "diplo",
    effect: {},
    voices: [
      { characterId: "foreign", stance: "support", text: "今は力が足りません。受け入れて時間を稼ぎ、力を蓄えるべきです。" },
      { characterId: "defense", stance: "oppose", text: "屈すれば国の誇りが地に落ちます。断固はねつけるべきです。" },
      { characterId: "business", stance: "neutral", text: "貿易が開けば商機もあります。条件次第かと。" },
    ],
    choices: [
      { id: "accept", label: "条約を受け入れる", description: "屈辱だが衝突は避けられる", effect: { trust: 4, gdp: 6, approval: -8, happiness: -4 }, explanation: "衝突を避け貿易は開けますが、不平等な扱いに国民の不満が高まります。" },
      { id: "negotiate", label: "粘り強く交渉する", description: "条件改善を狙うが時間がかかる", effect: { trust: 2, budget: -4, approval: 1 }, explanation: "少しでも有利な条件を引き出そうと交渉します。成果は不透明です。" },
      { id: "refuse", label: "断固拒否する", description: "誇りは守るが衝突の危険", effect: { approval: 6, military: 2, trust: -6, gdp: -5 }, explanation: "毅然とした姿勢は支持されますが、相手国との関係が悪化し緊張が高まります。" },
    ],
  },
  {
    id: "railway_debate",
    since: 1850,
    until: 1900,
    title: "国家予算をかけた鉄道計画",
    body: "国を一変させる大規模な鉄道計画。巨額の費用をどうするかで意見が割れています。",
    category: "経済",
    scope: "domestic",
    effect: {},
    voices: [
      { characterId: "business", stance: "support", text: "鉄道は国の血管です。借金してでも今すぐ敷くべきです。" },
      { characterId: "finance", stance: "oppose", text: "財政が破綻します。身の丈に合った範囲にすべきです。" },
      { characterId: "citizen", stance: "neutral", text: "便利になるのは嬉しいですが、増税は困ります。" },
    ],
    choices: [
      { id: "big", label: "国の威信をかけ全国に敷設", description: "成長は大きいが財政は火の車", effect: { gdp: 16, budget: -30, unemployment: -0.8, happiness: 2 }, explanation: "全国網で経済が大きく伸びますが、巨額の借金で財政は厳しくなります。" },
      { id: "partial", label: "主要路線だけ整備", description: "堅実なバランス型", effect: { gdp: 8, budget: -14, unemployment: -0.4 }, explanation: "必要な区間に絞り、成長と財政のバランスを取ります。" },
      { id: "foreign_loan", label: "外国資本を借りて建設", description: "早いが外国への依存が生まれる", effect: { gdp: 12, budget: -8, trust: -3, technology: 2 }, explanation: "外国の資金と技術で早く敷けますが、その国への依存と影響力を招きます。" },
    ],
  },

  /* ===== 大臣の意見が割れる選択型イベント ===== */
  {
    id: "immigration_policy",
    since: 1990,
    title: "人手不足、移民の受け入れを拡大すべきか",
    body: "深刻な人手不足を背景に、外国人労働者の受け入れ拡大が議論になっています。閣内でも意見が割れています。",
    category: "政治",
    scope: "domestic",
    effect: {},
    voices: [
      { characterId: "business", stance: "support", text: "人手不足を補えるため賛成です。経済を回すには必要です。" },
      { characterId: "citizen", stance: "oppose", text: "地域の受け入れ準備が足りず、暮らしへの不安があります。" },
      { characterId: "finance", stance: "neutral", text: "支援制度の予算を確保する必要があります。" },
    ],
    choices: [
      { id: "expand", label: "受け入れを大きく拡大", description: "人手不足は解消するが軋轢も", effect: { gdp: 12, unemployment: -0.8, happiness: -4, approval: -3 }, explanation: "労働力が増えて経済が回りますが、急な変化に地域の不満が高まります。" },
      { id: "gradual", label: "条件付きで段階的に", description: "バランス重視だが効果は緩やか", effect: { gdp: 5, budget: -8, unemployment: -0.3, approval: 1 }, explanation: "支援制度を整えながら少しずつ受け入れます。財政負担はありますが穏当です。" },
      { id: "reject", label: "受け入れは見送る", description: "国内優先だが人手不足は続く", effect: { gdp: -4, unemployment: 0.4, happiness: 2, approval: 2 }, explanation: "国内雇用を守る姿勢は一部に支持されますが、人手不足は深刻化します。" },
    ],
  },
  {
    id: "tax_hike_debate",
    title: "財政赤字、増税に踏み切るべきか",
    body: "膨らむ財政赤字を受け、増税の是非が問われています。痛みを伴う決断に閣内の意見も対立しています。",
    category: "経済",
    scope: "domestic",
    effect: {},
    voices: [
      { characterId: "finance", stance: "support", text: "財政の持続性のため、今こそ増税が必要です。" },
      { characterId: "business", stance: "oppose", text: "増税は消費と投資を冷やします。時期尚早です。" },
      { characterId: "citizen", stance: "oppose", text: "ただでさえ生活が苦しいのに、これ以上の負担は…。" },
    ],
    choices: [
      { id: "raise", label: "増税を断行", description: "財政は改善するが反発も大きい", effect: { budget: 30, gdp: -10, happiness: -6, approval: -10 }, explanation: "財政赤字は大きく改善しますが、国民と経済界の反発で支持率が落ちます。" },
      { id: "partial", label: "富裕層・大企業に限定増税", description: "反発を抑えつつ税収確保", effect: { budget: 16, gdp: -4, approval: -3, happiness: -1 }, explanation: "負担を一部に絞ることで反発を抑えつつ、ある程度の税収を確保します。" },
      { id: "delay", label: "増税を見送る", description: "今の生活は守るが赤字は続く", effect: { budget: -6, happiness: 3, approval: 4 }, explanation: "当面の不満は避けられますが、財政赤字は膨らみ続けます。" },
    ],
  },
  {
    id: "ai_regulation",
    since: 2015,
    title: "急成長するAI、規制すべきか",
    body: "AIの急速な普及で、雇用や安全への懸念が高まっています。規制と振興のどちらを優先すべきか議論されています。",
    category: "技術",
    scope: "domestic",
    effect: {},
    voices: [
      { characterId: "business", stance: "oppose", text: "強い規制は国際競争に負けます。振興を優先すべきです。" },
      { characterId: "citizen", stance: "support", text: "仕事が奪われないか不安です。一定のルールが必要です。" },
      { characterId: "defense", stance: "neutral", text: "安全保障の観点でも、無秩序な普及には注意が要ります。" },
    ],
    choices: [
      { id: "promote", label: "規制せず振興を優先", description: "技術は伸びるが社会不安も", effect: { technology: 10, gdp: 8, happiness: -4, unemployment: 0.5 }, explanation: "技術競争力は高まりますが、雇用不安や社会の戸惑いが広がります。" },
      { id: "balance", label: "ルールを整えつつ推進", description: "穏当だが調整に時間", effect: { technology: 4, gdp: 3, budget: -6, approval: 2 }, explanation: "安全と振興の両立を図ります。整備にコストはかかりますが安定的です。" },
      { id: "restrict", label: "厳しく規制", description: "不安は和らぐが成長は鈍化", effect: { technology: -3, happiness: 3, approval: 2, gdp: -4 }, explanation: "社会の不安は和らぎますが、技術の成長と国際競争力は犠牲になります。" },
    ],
  },

  /* ===== パッシブ型イベント (選択不要) ===== */
  {
    id: "port_strike",
    title: "港湾ストライキが発生",
    body: "物流が滞り、輸出企業の業績が下押しされた。",
    category: "経済",
    effect: { gdp: -8, unemployment: 0.4, approval: -3, inflation: 0.3 },
  },
  {
    id: "gas_discovery",
    title: "沖合で大型ガス田を発見",
    body: "資源探査への期待から市場がリスクオンに傾いた。",
    category: "市場",
    effect: { gdp: 10, budget: 8, trust: 3 },
  },
  {
    id: "neighbor_crisis",
    title: "隣国で政治危機が発生",
    body: "難民流入懸念が広がり、外交と軍事への注目が高まった。",
    category: "外交",
    effect: { trust: -3, unemployment: 0.3, military: 1 },
  },
  {
    id: "ai_breakthrough",
    title: "国内研究所が新型AI半導体を発表",
    body: "技術株が買われ、研究開発支援の重要性が注目された。",
    category: "技術",
    effect: { technology: 6, gdp: 8 },
  },
  {
    id: "heatwave",
    title: "記録的猛暑による電力逼迫",
    body: "電力需要が急増し、家計と産業への負担が増加した。",
    category: "災害",
    effect: { happiness: -4, inflation: 0.6, environment: -5 },
  },
  {
    id: "tech_export",
    title: "技術輸出が記録を更新",
    body: "AI・精密機器の輸出が好調で外貨収入が増加した。",
    category: "経済",
    effect: { gdp: 12, trust: 2, technology: 2 },
  },
  {
    id: "earthquake",
    title: "地震による被害が発生",
    body: "インフラが一部損傷し、復旧費用と支援が必要になった。",
    category: "災害",
    effect: { budget: -20, happiness: -6, approval: -2, gdp: -5 },
  },

  /* ===== 世界が動く：世界経済イベント ===== */
  {
    id: "global_boom",
    title: "世界的な好景気が広がる",
    body: "海外経済が上向き、輸出が伸びて街の工場がフル稼働している。",
    category: "経済",
    effect: { gdp: 14, unemployment: -0.5, approval: 2 },
  },
  {
    id: "global_recession",
    title: "世界同時不況の波が押し寄せる",
    body: "海外の景気後退で注文が減り、企業が様子見に入っている。",
    category: "経済",
    effect: { gdp: -14, unemployment: 0.6, approval: -3 },
  },
  {
    id: "oil_spike",
    title: "原油価格が高騰",
    body: "中東情勢の緊張でガソリンや電気代が上がり、家計を圧迫している。",
    category: "経済",
    effect: { inflation: 1.2, happiness: -4, budget: -6 },
  },
  {
    id: "fx_shock",
    title: "通貨が急落（為替ショック）",
    body: "自国通貨が売られ、輸入品が高くなる一方で輸出企業には追い風。",
    category: "市場",
    effect: { inflation: 1.0, gdp: 6, trust: -2 },
  },
  {
    id: "stock_bubble",
    title: "世界的な株高（バブルの兆し）",
    body: "投資マネーが株式に殺到し、資産を持つ人の気分が高揚している。",
    category: "市場",
    effect: { gdp: 8, happiness: 3, approval: 1 },
  },
  {
    id: "bubble_burst",
    title: "株式バブルが崩壊",
    body: "急騰していた株価が暴落し、投資家心理が一気に冷え込んだ。",
    category: "市場",
    effect: { gdp: -12, happiness: -4, approval: -2 },
  },
  {
    id: "mideast_conflict",
    title: "中東で武力衝突が発生",
    body: "地域の緊張が高まり、エネルギー供給と物流に不安が広がっている。",
    category: "外交",
    effect: { inflation: 0.8, trust: -2, military: 1 },
  },
  {
    id: "trade_friction",
    title: "大国間で貿易摩擦が激化",
    body: "関税の応酬が始まり、世界のサプライチェーンが揺れている。",
    category: "外交",
    effect: { gdp: -7, trust: -2 },
  },
  {
    id: "ai_revolution",
    title: "世界的なAI革命が加速",
    body: "新しいAIが次々と登場し、対応できる国とできない国の差が開いている。",
    category: "技術",
    effect: { technology: 7, gdp: 6, unemployment: 0.3 },
  },
  {
    id: "food_crisis",
    title: "世界的な食料価格高騰",
    body: "不作と輸出規制が重なり、食卓の負担が増している。",
    category: "経済",
    effect: { inflation: 1.1, happiness: -3, approval: -2 },
  },

  /* ===== 国内・市民イベント（プレイヤーと無関係に社会が動く） ===== */
  {
    id: "startup_boom",
    title: "若者発のスタートアップが急増",
    body: "学生や若手が次々と起業し、街に新しい活気が生まれている。",
    category: "経済",
    effect: { technology: 4, gdp: 5, happiness: 2 },
  },
  {
    id: "birthrate_up",
    title: "出生率回復の兆し",
    body: "子育て世代の明るい話題が増え、街に赤ちゃんの姿が目立つように。",
    category: "政治",
    effect: { happiness: 4, approval: 3 },
  },
  {
    id: "sns_criticism",
    title: "SNSで政府批判が拡散",
    body: "ある政策をめぐる投稿が一気に広まり、世論が揺れている。",
    category: "政治",
    effect: { approval: -5, happiness: -1 },
  },
  {
    id: "labor_strike",
    title: "労働者の大規模ストライキ",
    body: "賃上げを求める声が高まり、各地で仕事が止まっている。",
    category: "経済",
    effect: { gdp: -6, approval: -3, happiness: -2 },
  },
  {
    id: "tourism_boom",
    title: "地方都市に観光ブーム",
    body: "SNSで話題になった町に観光客が押し寄せ、地域経済が潤っている。",
    category: "経済",
    effect: { gdp: 6, happiness: 3, environment: -1 },
  },
  {
    id: "green_movement",
    title: "市民による環境運動が活発化",
    body: "脱炭素を求める市民運動が広がり、企業も対応を迫られている。",
    category: "政治",
    effect: { environment: 5, gdp: -2, approval: 1 },
  },
  {
    id: "private_innovation",
    title: "民間企業が画期的な技術を開発",
    body: "国内企業が世界を驚かせる新技術を発表し、株価が沸いた。",
    category: "技術",
    effect: { technology: 5, gdp: 6, approval: 1 },
  },
];

/** 選択型イベントのみ（時代別の歴史イベントも合流） */
export const choiceEvents = [
  ...eventDeck,
  ...historyEvents1850,
  ...historyEvents1900,
  ...historyEvents1919,
  ...historyEvents1939,
  ...historyEvents1945,
  ...historyEvents1973,
  ...historyEvents1991,
  ...historyEvents2008,
].filter((e) => e.choices && e.choices.length > 0);

/** パッシブ型イベントのみ */
export const passiveEvents = eventDeck.filter((e) => !e.choices || e.choices.length === 0);
