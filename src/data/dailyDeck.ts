import type { GameEvent } from "../types/game";

/**
 * 1日ごとに抽選される「速報」イベント集。
 * 月次イベント(events.ts)より効果は小さめ＝毎日少しずつ世界が動く。
 * scope でバケツ分けし、毎日どれかが起きる可能性をつくる。
 * followups で数日後・数週間後・数か月後の後続効果（短期/中期/長期）を持たせる。
 */
export const dailyDeck: GameEvent[] = [
  /* ===== 国内（domestic） ===== */
  {
    id: "d_startup_boom", scope: "domestic", category: "経済", since: 1960,
    title: "若者の起業ブーム",
    body: "学生や若手が次々と会社を立ち上げ、街に新しい活気が生まれています。",
    citizen: "「自分もやってみたい」という声が増えています。",
    effect: { gdp: 4, technology: 2, happiness: 2 },
    followups: [
      { afterDays: 30, title: "新興企業がサービス開始", body: "起業ブームの企業が相次いでサービスを始め、便利になったと評判です。", category: "技術", effect: { technology: 3, gdp: 3 } },
      { afterDays: 120, title: "新産業が雇用を生む", body: "数か月前に生まれた新興企業群が、若者の雇用の受け皿になっています。", category: "経済", effect: { unemployment: -0.5, gdp: 5 } },
    ],
  },
  {
    id: "d_housing_up", scope: "domestic", category: "経済",
    title: "住宅価格の上昇が続く",
    body: "都市部の住宅価格が上がり続け、若い世帯から不満の声が上がっています。",
    citizen: "「家が買えない」という嘆きが広がっています。",
    effect: { happiness: -3, inflation: 0.4, approval: -2 },
  },
  {
    id: "d_costoflife", scope: "domestic", category: "経済",
    title: "生活費高騰への抗議",
    body: "食料品や光熱費の値上がりに、家計を直撃された市民が声を上げています。",
    citizen: "「給料は上がらないのに物だけ高い」と不満が募ります。",
    effect: { happiness: -4, approval: -3, inflation: 0.3 },
  },
  {
    id: "d_edu_demand", scope: "domestic", category: "政治",
    title: "教育改革を求める声",
    body: "保護者や教員から、時代に合った教育への改革を求める署名が集まっています。",
    citizen: "「子どもの未来のために」と訴える親が増えています。",
    effect: { approval: -1, happiness: -1 },
    followups: [
      { afterDays: 14, title: "教育議論が盛り上がる", body: "教育改革をめぐる議論が高まり、関心が政治へ向き始めました。", category: "政治", effect: { approval: 2 } },
    ],
  },
  {
    id: "d_med_shortage", scope: "domestic", category: "政治",
    title: "医療現場の人手不足",
    body: "病院や介護施設で人手不足が深刻化し、現場から悲鳴が上がっています。",
    citizen: "「予約が取れない」と高齢者が困っています。",
    effect: { happiness: -3, approval: -2 },
  },
  {
    id: "d_sns_unite", scope: "domestic", category: "政治",
    title: "人気スポーツ大会で国民団結",
    body: "代表チームの活躍に国中が沸き、街は祝祭ムードに包まれています。",
    citizen: "「久しぶりにみんなで盛り上がった」と笑顔が広がります。",
    effect: { happiness: 5, approval: 4 },
  },
  {
    id: "d_birthrate_complaint", scope: "domestic", category: "政治",
    title: "少子化対策への不満",
    body: "子育て世帯から、支援が足りないとの不満が噴出しています。",
    citizen: "「これでは二人目は無理」という声が目立ちます。",
    effect: { happiness: -2, approval: -3 },
  },
  {
    id: "d_local_tourism", scope: "domestic", category: "経済",
    title: "地方都市に観光ブーム",
    body: "SNSで話題になった小さな町に観光客が押し寄せ、地域が潤っています。",
    citizen: "「商店街がにぎわって嬉しい」と地元の人。",
    effect: { gdp: 4, happiness: 2, environment: -1 },
  },
  {
    id: "d_new_service", scope: "domestic", category: "技術", since: 1995,
    title: "新技術の民間サービスが流行",
    body: "AIを使った便利なサービスが一気に普及し、暮らしが変わり始めています。",
    citizen: "「もう手放せない」と利用者が急増しています。",
    effect: { technology: 3, gdp: 3, happiness: 1 },
  },
  {
    id: "d_disaster_recovery_anger", scope: "domestic", category: "災害",
    title: "災害復旧の遅れに不満",
    body: "先の災害からの復旧が進まず、被災地から行政への不満が高まっています。",
    citizen: "「いつになったら元の生活に戻れるのか」と訴えます。",
    effect: { approval: -4, happiness: -2 },
  },

  /* ===== 市民（citizen） ===== */
  {
    id: "c_demo", scope: "citizen", category: "政治",
    title: "大規模デモが各地で発生",
    body: "政策への不満が膨らみ、各地の広場に大勢の市民が集まりました。",
    citizen: "「声を届けたい」とプラカードを掲げる人々。",
    effect: { approval: -4, happiness: -2, trust: -1 },
  },
  {
    id: "c_strike", scope: "citizen", category: "経済",
    title: "労働者のストライキ",
    body: "賃上げを求める労働者が一斉に仕事を止め、各地で影響が出ています。",
    citizen: "「生活できる賃金を」と労働者が訴えます。",
    effect: { gdp: -5, approval: -2, happiness: -1 },
    followups: [
      { afterDays: 21, title: "賃上げ交渉が妥結", body: "ストライキを受けた交渉がまとまり、賃金が引き上げられました。", category: "経済", effect: { happiness: 3, inflation: 0.4 } },
    ],
  },
  {
    id: "c_sns_criticism", scope: "citizen", category: "政治",
    title: "SNSで政府批判が拡散",
    body: "ある投稿をきっかけに政府への批判が一気に広まり、世論が揺れています。",
    citizen: "「説明が足りない」という声が拡散しています。",
    effect: { approval: -5, happiness: -1 },
  },
  {
    id: "c_youth_politics", scope: "citizen", category: "政治",
    title: "若者の政治参加が増加",
    body: "若い世代が政治に関心を持ち始め、投票や対話の場に集まっています。",
    citizen: "「自分たちで変えたい」と若者が動き出しました。",
    effect: { approval: 3, happiness: 2 },
  },
  {
    id: "c_green_movement", scope: "citizen", category: "政治",
    title: "市民の環境運動が活発化",
    body: "脱炭素を求める市民運動が広がり、企業も対応を迫られています。",
    citizen: "「次の世代に綺麗な街を」と参加者。",
    effect: { environment: 4, gdp: -2, approval: 1 },
  },
  {
    id: "c_volunteer", scope: "citizen", category: "政治",
    title: "ボランティアの輪が広がる",
    body: "地域を支え合う活動が各地に広がり、社会の温かさが見直されています。",
    citizen: "「困ったときはお互いさま」と参加者。",
    effect: { happiness: 3, approval: 1 },
  },

  /* ===== 世界（world） ===== */
  {
    id: "w_global_boom", scope: "world", category: "経済",
    title: "世界的な好景気が広がる",
    body: "海外経済が上向き、輸出が伸びて工場がフル稼働しています。",
    citizen: "「残業が増えたけど給料も上がった」と工場勤務の人。",
    effect: { gdp: 6, unemployment: -0.3, approval: 1 },
  },
  {
    id: "w_global_recession", scope: "world", category: "経済",
    title: "世界同時不況の波",
    body: "海外の景気後退で注文が減り、企業が様子見に入っています。",
    citizen: "「先が見えない」と経営者は不安げです。",
    effect: { gdp: -6, unemployment: 0.4, approval: -2 },
  },
  {
    id: "w_oil_spike", scope: "world", category: "経済",
    title: "原油価格が高騰",
    body: "中東情勢の緊張でガソリンや電気代が上がり、家計を圧迫しています。",
    citizen: "「車に乗るのもためらう」とドライバー。",
    effect: { inflation: 0.8, happiness: -3, budget: -3 },
  },
  {
    id: "w_ai_revolution", scope: "world", category: "技術", since: 2010,
    title: "世界的なAI革命が加速",
    body: "新しいAIが次々登場し、対応できる国とできない国の差が開いています。",
    citizen: "「うちの会社も乗り遅れたくない」と社員。",
    effect: { technology: 4, gdp: 4, unemployment: 0.2 },
    followups: [
      { afterDays: 60, title: "AI導入で生産性が向上", body: "AIを取り入れた企業の生産性が上がり、競争力が高まっています。", category: "技術", effect: { gdp: 5, technology: 3 } },
    ],
  },
  {
    id: "w_food_crisis", scope: "world", category: "経済",
    title: "世界的な食料価格高騰",
    body: "不作と輸出規制が重なり、食卓の負担が増しています。",
    citizen: "「買い物のたびに値段が上がっている」と主婦。",
    effect: { inflation: 0.9, happiness: -3, approval: -1 },
  },
  {
    id: "w_trade_friction", scope: "world", category: "外交",
    title: "大国間で貿易摩擦が激化",
    body: "関税の応酬が始まり、世界のサプライチェーンが揺れています。",
    citizen: "「部品が届かない」と製造業から悲鳴。",
    effect: { gdp: -5, trust: -1 },
  },
  {
    id: "w_pandemic_warn", scope: "world", category: "災害",
    title: "海外で新たな感染症の兆し",
    body: "遠い国で新しい感染症が報告され、各国が警戒を強めています。",
    citizen: "「また流行するのでは」と不安の声。",
    effect: { happiness: -2, trust: 1 },
    followups: [
      { afterDays: 45, title: "水際対策が功を奏す", body: "早めの警戒で国内への流入を抑えられ、評価が高まっています。", category: "災害", effect: { approval: 3, trust: 2 } },
    ],
  },

  /* ===== 市場（market） ===== */
  {
    id: "m_stock_surge", scope: "market", category: "市場",
    title: "株価指数が急騰",
    body: "好決算が相次ぎ、国内株価指数が大きく値上がりしました。",
    citizen: "「資産が増えた」と投資家は笑顔です。",
    effect: { gdp: 4, happiness: 2, approval: 1 },
  },
  {
    id: "m_stock_crash", scope: "market", category: "市場",
    title: "株価が急落",
    body: "海外発の売りが波及し、国内株価指数が急落しました。",
    citizen: "「年金は大丈夫なのか」と不安が広がります。",
    effect: { gdp: -5, happiness: -3, approval: -2 },
  },
  {
    id: "m_bank_fear", scope: "market", category: "市場",
    title: "銀行の経営不安が広がる",
    body: "一部の銀行に経営不安の噂が立ち、預金者が窓口に並んでいます。",
    citizen: "「お金を引き出した方がいいのか」と動揺。",
    effect: { gdp: -4, trust: -2, approval: -2 },
    followups: [
      { afterDays: 7, title: "金融当局が沈静化に動く", body: "当局の素早い対応で銀行不安はひとまず落ち着きました。", category: "市場", effect: { trust: 2, gdp: 2 } },
    ],
  },
  {
    id: "m_realestate_down", scope: "market", category: "市場",
    title: "不動産価格が下落",
    body: "値上がりを続けた不動産が反落し、建設業に影響が出ています。",
    citizen: "「ローンより家の価値が下がった」と住宅購入者。",
    effect: { gdp: -3, happiness: -1 },
  },
  {
    id: "m_ai_company_grow", scope: "market", category: "技術", since: 1998,
    title: "AI企業が急成長",
    body: "国内のAI企業が世界市場で評価され、株価をけん引しています。",
    citizen: "「うちの国にもこんな企業が」と誇らしげ。",
    effect: { technology: 4, gdp: 5, approval: 1 },
  },
  {
    id: "m_export_strong", scope: "market", category: "経済",
    title: "輸出企業が好調",
    body: "通貨安も追い風となり、輸出企業の業績が伸びています。",
    citizen: "「ボーナスが増えそう」と社員。",
    effect: { gdp: 6, budget: 3 },
  },
  {
    id: "m_weak_currency", scope: "market", category: "市場",
    title: "通貨安が進む",
    body: "自国通貨が売られ、輸入品が高くなる一方で輸出には追い風です。",
    citizen: "「海外旅行が高くなった」と嘆く人も。",
    effect: { inflation: 0.6, gdp: 4, trust: -1 },
  },
  {
    id: "m_bubble_sign", scope: "market", category: "市場",
    title: "バブルの兆し",
    body: "投資マネーが過熱気味に流れ込み、資産価格が実態以上に膨らんでいます。",
    citizen: "「今が買い時だ」と熱狂する投資家。",
    effect: { gdp: 5, happiness: 2, approval: 1 },
    followups: [
      { afterDays: 40, title: "過熱した相場が反落", body: "実態とかけ離れた価格が修正され、相場が大きく下げました。", category: "市場", effect: { gdp: -9, happiness: -4, approval: -2 } },
    ],
  },
  {
    id: "m_invest_boom", scope: "market", category: "経済",
    title: "国内に投資ブーム",
    body: "国内外の投資家が成長分野に資金を投じ、新しい事業が次々生まれています。",
    citizen: "「街に新しいビルが増えた」と住民。",
    effect: { gdp: 5, technology: 2 },
  },

  /* ===== 外交（diplo） ===== */
  {
    id: "x_summit_request", scope: "diplo", category: "外交",
    title: "隣国から首脳会談の要請",
    body: "隣国が関係改善を望み、首脳会談を呼びかけてきました。",
    citizen: "「仲良くやってほしい」と期待の声。",
    effect: { trust: 2 },
  },
  {
    id: "x_trade_proposal", scope: "diplo", category: "外交",
    title: "貿易交渉の提案が届く",
    body: "ある国から有利な条件での貿易交渉が持ちかけられました。",
    citizen: "「輸出が増えるなら歓迎」と企業。",
    effect: { trust: 1, gdp: 2 },
    followups: [
      { afterDays: 30, title: "貿易交渉が前進", body: "持ちかけられた交渉が進み、新たな取引の道が開けました。", category: "経済", effect: { gdp: 5, trust: 2 } },
    ],
  },
  {
    id: "x_tension_up", scope: "diplo", category: "外交",
    title: "周辺国との緊張が上昇",
    body: "国境付近での小競り合いが報じられ、地域の緊張が高まっています。",
    citizen: "「戦争にはならないでほしい」と不安。",
    effect: { trust: -2, military: 1, happiness: -1 },
  },
  {
    id: "x_invite_conf", scope: "diplo", category: "外交",
    title: "国際会議への招待",
    body: "重要な国際会議への招待が届き、存在感を示す好機が訪れています。",
    citizen: "「世界に名を売る機会だ」と期待。",
    effect: { trust: 3, approval: 1 },
  },
  {
    id: "x_refugee", scope: "diplo", category: "外交",
    title: "難民受け入れ要請",
    body: "近隣の混乱で発生した難民の受け入れを、国際社会から求められています。",
    citizen: "「人道的に助けるべき」「準備が心配」と賛否。",
    effect: { trust: 2, budget: -4, approval: -2 },
  },
  {
    id: "x_ally_help", scope: "diplo", category: "外交",
    title: "同盟国から支援要請",
    body: "同盟国が困難に直面し、支援を求めてきました。",
    citizen: "「困ったときはお互いさま」との声。",
    effect: { trust: 3, budget: -5 },
  },
  {
    id: "x_friendly_change", scope: "diplo", category: "外交",
    title: "友好国で政権交代",
    body: "友好国で新しい指導者が誕生し、関係の再構築が必要になっています。",
    citizen: "「これまで通りいけるのか」と関心。",
    effect: { trust: -1 },
  },

  /* ===== 危機（crisis） ===== */
  {
    id: "k_typhoon", scope: "crisis", category: "災害",
    title: "大型台風が接近",
    body: "勢力の強い台風が接近し、沿岸部に避難の呼びかけが出ています。",
    citizen: "「早めに避難した方がいい」と住民。",
    effect: { budget: -6, happiness: -3, approval: -1, environment: -2 },
  },
  {
    id: "k_quake", scope: "crisis", category: "災害",
    title: "地震が発生",
    body: "強い地震が観測され、一部でインフラに被害が出ています。",
    citizen: "「無事を祈るばかり」と被災地の声。",
    effect: { budget: -8, happiness: -4, gdp: -3 },
    followups: [
      { afterDays: 10, title: "復旧作業が本格化", body: "全国から支援が集まり、被災地の復旧が進み始めました。", category: "災害", effect: { approval: 2, happiness: 2 } },
    ],
  },
  {
    id: "k_blackout", scope: "crisis", category: "災害",
    title: "大規模停電が発生",
    body: "電力需要の急増で広い範囲が停電し、市民生活が混乱しました。",
    citizen: "「冷蔵庫の中身が全部だめに」と困惑。",
    effect: { happiness: -3, gdp: -3, approval: -2 },
  },
  {
    id: "k_cyber", scope: "crisis", category: "技術", since: 2000,
    title: "サイバー攻撃を受ける",
    body: "政府機関や企業がサイバー攻撃を受け、一部のサービスが停止しました。",
    citizen: "「個人情報は大丈夫なのか」と不安。",
    effect: { trust: -2, technology: -1, approval: -2 },
  },
  {
    id: "k_water", scope: "crisis", category: "災害",
    title: "深刻な水不足",
    body: "少雨が続き、農業や生活用水に影響が出始めています。",
    citizen: "「節水しないと」と各家庭で工夫。",
    effect: { happiness: -3, gdp: -2, inflation: 0.4 },
  },
  {
    id: "k_security", scope: "crisis", category: "政治",
    title: "治安の悪化が報じられる",
    body: "都市部での犯罪増加が報じられ、住民の不安が高まっています。",
    citizen: "「夜道が怖い」との声が増えています。",
    effect: { happiness: -3, approval: -3 },
  },
  {
    id: "k_minister_gaffe", scope: "crisis", category: "政治",
    title: "閣僚の失言が問題化",
    body: "閣僚の不用意な発言が報じられ、野党やメディアが批判を強めています。",
    citizen: "「緊張感が足りない」と厳しい声。",
    effect: { approval: -5, trust: -1 },
  },
  {
    id: "k_corruption_doubt", scope: "crisis", category: "政治",
    title: "汚職疑惑が浮上",
    body: "政府関係者の資金をめぐる疑惑が報じられ、説明責任が問われています。",
    citizen: "「きちんと調べてほしい」と国民。",
    effect: { approval: -4, trust: -3 },
  },

  /* ===== ポジティブ（positive） ===== */
  {
    id: "p_resource", scope: "positive", category: "経済",
    title: "天然資源を発見",
    body: "国内で有望な資源の埋蔵が確認され、市場が沸いています。",
    citizen: "「うちの国にも宝が」と期待。",
    effect: { gdp: 7, budget: 5, trust: 1 },
    followups: [
      { afterDays: 90, title: "資源開発が始動", body: "発見された資源の開発が本格化し、新たな収入源になりつつあります。", category: "経済", effect: { gdp: 8, budget: 6 } },
    ],
  },
  {
    id: "p_medical", scope: "positive", category: "技術",
    title: "医療技術が進歩",
    body: "国内の研究チームが画期的な治療法を発表し、世界から注目されています。",
    citizen: "「助かる命が増える」と医療現場も歓迎。",
    effect: { technology: 4, happiness: 3, trust: 2 },
  },
  {
    id: "p_birthrate_sign", scope: "positive", category: "政治",
    title: "出生率改善の兆し",
    body: "子育て世代に明るい話題が増え、街に赤ちゃんの姿が目立つようになりました。",
    citizen: "「子育てしやすくなった」と若い親。",
    effect: { happiness: 4, approval: 3 },
  },
  {
    id: "p_sports_win", scope: "positive", category: "政治",
    title: "国際スポーツ大会で優勝",
    body: "代表が世界の頂点に立ち、国中が歓喜に沸いています。",
    citizen: "「誇らしい！」と街は祝賀ムード。",
    effect: { happiness: 5, approval: 5, trust: 1 },
  },
  {
    id: "p_big_invest", scope: "positive", category: "経済",
    title: "大企業が国内投資を決定",
    body: "大手企業が国内に大規模な工場・研究拠点を作ると発表しました。",
    citizen: "「雇用が増える」と地元は歓迎。",
    effect: { gdp: 6, unemployment: -0.4, technology: 2 },
    followups: [
      { afterDays: 75, title: "新工場が稼働", body: "発表された拠点が稼働を始め、地域に雇用が広がっています。", category: "経済", effect: { unemployment: -0.5, gdp: 4 } },
    ],
  },
  {
    id: "p_edu_result", scope: "positive", category: "技術",
    title: "教育成果が向上",
    body: "国際的な学力調査で国内の若者の成績が大きく伸びました。",
    citizen: "「先生たちの努力の成果」と保護者。",
    effect: { technology: 3, happiness: 2, approval: 1 },
  },
  {
    id: "p_new_industry", scope: "positive", category: "技術",
    title: "新産業が誕生",
    body: "これまでなかった新しい産業が芽生え、未来への期待が高まっています。",
    citizen: "「新しい仕事が生まれている」と就活生。",
    effect: { gdp: 5, technology: 4, unemployment: -0.3 },
  },
  {
    id: "p_diplo_improve", scope: "positive", category: "外交",
    title: "外交関係が改善",
    body: "粘り強い交渉が実を結び、ある国との関係が大きく前進しました。",
    citizen: "「対立より対話を」と歓迎の声。",
    effect: { trust: 4, approval: 2 },
  },
];

/** scope ごとに引きやすくする */
export function dailyByScope(scope: GameEvent["scope"]): GameEvent[] {
  return dailyDeck.filter((e) => e.scope === scope);
}
