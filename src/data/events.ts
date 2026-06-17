import type { GameEvent } from "../types/game";

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
    title: "エネルギー価格が急騰",
    body: "国際情勢の悪化でエネルギー輸入コストが急上昇しています。家庭と企業が直撃を受けています。",
    category: "経済",
    effect: {},
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
];

/** 選択型イベントのみ */
export const choiceEvents = eventDeck.filter((e) => e.choices && e.choices.length > 0);

/** パッシブ型イベントのみ */
export const passiveEvents = eventDeck.filter((e) => !e.choices || e.choices.length === 0);
