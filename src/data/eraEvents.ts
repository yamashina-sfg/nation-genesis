import type { GameEvent } from "../types/game";

/**
 * 時代ごとの速報イベント（1850年〜現代）。
 * 教科書ではなく「ゲーム内速報」。難しい歴史用語はやさしく言い換える。
 * since/until で時代を制限し、その時代らしい出来事だけが起きるようにする。
 */
export const eraEvents: GameEvent[] = [
  /* ===================== 1850〜1900：近代国家づくり ===================== */
  {
    id: "e_railway_boom", scope: "positive", category: "経済", since: 1850, until: 1915,
    title: "鉄道建設ブーム！",
    body: "各地で工場と都市が線路でつながり、商人たちが新しい市場に沸いています。",
    citizen: "「遠くの町まで一日で行ける」と人々は大興奮。",
    effect: { gdp: 6, technology: 2, happiness: 1, environment: -1 },
    followups: [
      { afterDays: 60, title: "沿線に新しい町が育つ", body: "鉄道のまわりに工場や商店が集まり、新しい町が次々と生まれています。", category: "経済", effect: { gdp: 5, unemployment: -0.4 } },
    ],
  },
  {
    id: "e_factory_workers", scope: "domestic", category: "経済", since: 1850, until: 1940,
    title: "工場で働く人が急増",
    body: "農村を離れ、都市の工場で働く人が増えています。煙突の町が広がっています。",
    citizen: "「現金収入はありがたいが、労働は過酷だ」との声も。",
    effect: { gdp: 5, unemployment: -0.5, happiness: -2, environment: -2 },
  },
  {
    id: "e_labor_dispute", scope: "citizen", category: "政治", since: 1860, until: 1945,
    title: "工場で労働争議が起きる",
    body: "長時間労働と低賃金に耐えかねた労働者が、待遇改善を求めて声を上げました。",
    citizen: "「人間らしく働きたいだけだ」と労働者たち。",
    effect: { approval: -3, happiness: -2, gdp: -2 },
  },
  {
    id: "e_urbanization", scope: "domestic", category: "政治", since: 1850, until: 1930,
    title: "農村から都市へ、人の波",
    body: "仕事を求めて多くの人が都市に流れ込み、住宅や衛生の問題が出始めています。",
    citizen: "「都会は活気があるが、暮らしは窮屈だ」との声。",
    effect: { gdp: 3, happiness: -2, environment: -2 },
  },
  {
    id: "e_bank_panic_old", scope: "market", category: "市場", since: 1850, until: 1930,
    title: "銀行のとりつけ騒ぎ",
    body: "ある銀行の経営不安が噂され、預金を引き出そうとする人が窓口に殺到しました。",
    citizen: "「預けたお金は無事なのか」と人々が動揺。",
    effect: { gdp: -4, trust: -2, happiness: -2 },
  },
  {
    id: "e_border_dispute", scope: "diplo", category: "外交", since: 1850, until: 1945,
    title: "隣国との国境問題が浮上",
    body: "国境付近の領有をめぐり、隣国との間でにらみ合いが続いています。",
    citizen: "「戦にならなければいいが」と国民は不安げ。",
    effect: { trust: -2, military: 1, happiness: -1 },
  },
  {
    id: "e_colonial_race", scope: "diplo", category: "外交", since: 1860, until: 1914,
    title: "列強による植民地競争が激化",
    body: "強国が世界各地で勢力争いを繰り広げ、出遅れまいとする圧力が高まっています。",
    citizen: "「我が国も乗り遅れるな」という声が広がります。",
    effect: { military: 2, trust: -1, gdp: 2 },
  },
  {
    id: "e_edu_backlash", scope: "citizen", category: "政治", since: 1850, until: 1910,
    title: "義務教育への反発",
    body: "「子どもは働き手だ」として、学校に通わせることへの反発が一部で起きています。",
    citizen: "「畑仕事の手が減る」と嘆く農家も。",
    effect: { approval: -2, happiness: -1 },
    followups: [
      { afterDays: 90, title: "読み書きできる若者が増える", body: "教育が根づき、読み書き計算のできる若者が社会を支え始めています。", category: "技術", effect: { technology: 3, gdp: 3 } },
    ],
  },

  /* ===================== 1900〜1945：戦争と世界危機 ===================== */
  {
    id: "e_ww_tension", scope: "diplo", category: "外交", since: 1910, until: 1918,
    title: "世界をまきこむ大戦の足音",
    body: "大国どうしの対立が抜き差しならぬところまで来て、世界に緊張が走っています。",
    citizen: "「うちの国は巻き込まれないでくれ」と祈る人々。",
    effect: { trust: -3, military: 2, happiness: -2 },
  },
  {
    id: "e_arms_race", scope: "diplo", category: "外交", since: 1900, until: 1945,
    title: "軍拡競争が止まらない",
    body: "周辺国が次々と軍備を増強し、対抗して防衛費を増やす圧力が強まっています。",
    citizen: "「軍より暮らしにお金を」との声も根強い。",
    effect: { military: 2, budget: -4, approval: -1 },
  },
  {
    id: "e_war_boom", scope: "market", category: "経済", since: 1914, until: 1945,
    title: "戦時の特需に沸く工場",
    body: "軍需の注文が殺到し、工場はフル稼働。一時的に景気が大きく上向いています。",
    citizen: "「仕事はいくらでもある」と工員。だが先行きは不透明。",
    effect: { gdp: 6, unemployment: -0.5, inflation: 0.6 },
    followups: [
      { afterDays: 60, title: "物価がじわじわ上昇", body: "戦時の需要で物がなくなり、物価が上がり始めています。", category: "経済", effect: { inflation: 0.8, happiness: -2 } },
    ],
  },
  {
    id: "e_shortage", scope: "crisis", category: "経済", since: 1914, until: 1946,
    title: "深刻な物資不足",
    body: "輸入が滞り、食料や燃料が手に入りにくくなっています。配給に行列ができています。",
    citizen: "「並んでも買えない」と主婦たちがため息。",
    effect: { happiness: -4, inflation: 1.0, approval: -3 },
  },
  {
    id: "e_great_depression", scope: "crisis", category: "経済", since: 1929, until: 1939,
    title: "世界中で仕事とお金が消えた大不況",
    body: "海の向こうの株価暴落をきっかけに、世界中で会社が倒れ、失業者があふれています。",
    citizen: "「昨日まで働いていたのに」と路頭に迷う人々。",
    effect: { gdp: -10, unemployment: 1.2, approval: -4, happiness: -4 },
    followups: [
      { afterDays: 60, title: "国産優先で生き残りを図る", body: "各国が自国の産業を守るため、輸入に高い壁を作り始めました。", category: "外交", effect: { gdp: -4, trust: -2 } },
    ],
  },
  {
    id: "e_mass_unemployment", scope: "domestic", category: "経済", since: 1929, until: 1940,
    title: "失業者が街にあふれる",
    body: "仕事を失った人々が職を求めて街をさまよい、社会不安が高まっています。",
    citizen: "「働きたくても働き口がない」と若者。",
    effect: { unemployment: 0.9, approval: -3, happiness: -3 },
  },
  {
    id: "e_protectionism_old", scope: "world", category: "外交", since: 1929, until: 1945,
    title: "各国が貿易の壁を高くする",
    body: "自国の産業を守ろうと、各国が輸入品に高い関税をかけ合っています。",
    citizen: "「輸出が止まって工場が苦しい」と経営者。",
    effect: { gdp: -5, trust: -2 },
  },
  {
    id: "e_air_raid", scope: "crisis", category: "災害", since: 1939, until: 1945,
    title: "空襲で都市が被害",
    body: "敵機による爆撃で都市の一部が焼け、多くの人が住まいを失いました。",
    citizen: "「一夜にしてすべてを失った」と被災者。",
    effect: { gdp: -8, happiness: -5, budget: -8, approval: -2 },
  },
  {
    id: "e_postwar_plan", scope: "positive", category: "政治", since: 1944, until: 1952,
    title: "戦後復興の計画が動き出す",
    body: "長い戦争が終わり、国を立て直すための復興計画づくりが始まりました。",
    citizen: "「ようやく前を向ける」と人々に希望が戻ります。",
    effect: { approval: 4, happiness: 3, gdp: 2 },
  },

  /* ===================== 1946〜1990：冷戦と復興 ===================== */
  {
    id: "e_reconstruction_demand", scope: "positive", category: "経済", since: 1946, until: 1965,
    title: "復興需要で経済が動き出す",
    body: "住まいや工場の再建が一斉に進み、建設や製造の注文が急増しています。",
    citizen: "「町に槌音が戻ってきた」と職人たち。",
    effect: { gdp: 7, unemployment: -0.6, happiness: 2 },
  },
  {
    id: "e_high_growth", scope: "positive", category: "経済", since: 1955, until: 1975,
    title: "高度経済成長まっただ中",
    body: "工業生産が伸び続け、暮らしが年々豊かになる「成長の時代」が続いています。",
    citizen: "「来年はもっと良くなる」と誰もが信じています。",
    effect: { gdp: 9, happiness: 3, approval: 3, environment: -2 },
    followups: [
      { afterDays: 90, title: "成長のひずみ、公害が表面化", body: "急速な工業化の裏で、空気や水の汚れが問題になり始めました。", category: "災害", effect: { environment: -5, happiness: -2 } },
    ],
  },
  {
    id: "e_labor_movement", scope: "citizen", category: "政治", since: 1946, until: 1990,
    title: "労働運動が盛り上がる",
    body: "賃上げや待遇改善を求める労働組合の運動が各地で活発になっています。",
    citizen: "「成長の果実を働く者にも」と労働者。",
    effect: { happiness: 1, gdp: -3, approval: -1, inflation: 0.4 },
  },
  {
    id: "e_oil_shock", scope: "crisis", category: "経済", since: 1973, until: 1985,
    title: "石油危機で物価が急騰",
    body: "原油の供給が細り、ガソリンや日用品の値段が一気に跳ね上がっています。",
    citizen: "「トイレットペーパーまで買い占めだ」と大混乱。",
    effect: { inflation: 1.4, gdp: -6, happiness: -3, approval: -2 },
    followups: [
      { afterDays: 90, title: "省エネ技術で巻き返し", body: "危機をバネに、燃費の良い製品や省エネ技術の開発が進みました。", category: "技術", effect: { technology: 4, gdp: 3 } },
    ],
  },
  {
    id: "e_cold_war_tension", scope: "diplo", category: "外交", since: 1946, until: 1990,
    title: "大国どうしのにらみ合いが続く",
    body: "二つの大国が直接は戦わないまま、世界中で勢力争いを繰り広げています。",
    citizen: "「いつ戦争になるか」と核の影におびえる人も。",
    effect: { trust: -2, military: 2, happiness: -1 },
  },
  {
    id: "e_tech_innovation", scope: "positive", category: "技術", since: 1950, until: 1990,
    title: "新しい技術が次々と登場",
    body: "家電や自動車、エレクトロニクスなど、暮らしを変える技術が花開いています。",
    citizen: "「三種の神器が我が家にも」と主婦は笑顔。",
    effect: { technology: 4, gdp: 5, happiness: 2 },
  },
  {
    id: "e_baby_boom", scope: "positive", category: "政治", since: 1946, until: 1965,
    title: "赤ちゃんの誕生ラッシュ",
    body: "戦後の安定で出生数が大きく増え、学校や住宅の整備が追いつかないほどです。",
    citizen: "「どこも子どもでいっぱい」と先生たち。",
    effect: { happiness: 3, approval: 2 },
  },
  {
    id: "e_pollution", scope: "crisis", category: "災害", since: 1955, until: 1982,
    title: "公害が深刻な社会問題に",
    body: "工場の排煙や排水で空気や川が汚れ、健康被害を訴える声が広がっています。",
    citizen: "「成長より、まず健康を」と住民が抗議。",
    effect: { environment: -5, happiness: -3, approval: -2 },
  },

  /* ===================== 1991〜2019：グローバル化 ===================== */
  {
    id: "e_bubble_burst_jp", scope: "market", category: "市場", since: 1991, until: 2000,
    title: "バブルがはじけ、資産価格が暴落",
    body: "実態とかけ離れて膨らんだ地価や株価が一気にしぼみ、後始末に追われています。",
    citizen: "「あの熱狂は何だったのか」と投資家。",
    effect: { gdp: -8, happiness: -3, approval: -2 },
  },
  {
    id: "e_it_rise", scope: "market", category: "技術", since: 1995, until: 2019,
    title: "IT企業が急成長",
    body: "インターネットを武器にした新しい企業が次々と現れ、株式市場をけん引しています。",
    citizen: "「これからはパソコンとネットの時代」と若者。",
    effect: { technology: 5, gdp: 5, approval: 1 },
    followups: [
      { afterDays: 60, title: "ネットが暮らしに浸透", body: "買い物も連絡もネットで完結する人が増え、生活が大きく変わりました。", category: "技術", effect: { technology: 3, gdp: 4 } },
    ],
  },
  {
    id: "e_financial_crisis", scope: "crisis", category: "市場", since: 2000, until: 2012,
    title: "世界金融危機が襲う",
    body: "海外の大手金融機関の破綻をきっかけに、世界中の市場が大混乱に陥りました。",
    citizen: "「年金も貯金も大丈夫なのか」と不安が広がる。",
    effect: { gdp: -9, unemployment: 0.8, happiness: -3, approval: -3 },
  },
  {
    id: "e_globalization", scope: "world", category: "経済", since: 1991, until: 2019,
    title: "世界中でモノ・お金・人が動く",
    body: "国境を越えた取引や投資、移動がかつてなく活発になり、世界が一つの市場のようです。",
    citizen: "「海外の品が安く買える」と消費者は歓迎。",
    effect: { gdp: 5, trust: 2, inflation: 0.2 },
  },
  {
    id: "e_tourism_boom2", scope: "positive", category: "経済", since: 1995, until: 2019,
    title: "観光ブームで街がにぎわう",
    body: "海外からの旅行者が増え、各地の観光地や商店街がうるおっています。",
    citizen: "「外国のお客さんで大忙し」と店主。",
    effect: { gdp: 5, happiness: 2, environment: -1 },
  },
  {
    id: "e_terror", scope: "crisis", category: "外交", since: 2001, until: 2019,
    title: "テロへの警戒が高まる",
    body: "各地でのテロを受け、空港や都市の警備が強化され、緊張が走っています。",
    citizen: "「安全のためなら多少の不便は仕方ない」との声。",
    effect: { trust: -1, military: 1, happiness: -2, budget: -3 },
  },
  {
    id: "e_sns_flame", scope: "citizen", category: "政治", since: 2008, until: 2019,
    title: "SNSで政府批判が炎上",
    body: "ある対応をめぐる投稿が一気に拡散し、ネット世論が大きく荒れています。",
    citizen: "「みんなが見ている」と政府への風当たりが強まる。",
    effect: { approval: -4, happiness: -1 },
  },
  {
    id: "e_aging_society", scope: "domestic", category: "政治", since: 1995, until: 2019,
    title: "少子高齢化が進む",
    body: "子どもが減り高齢者が増え、年金や医療の負担、人手不足が課題になっています。",
    citizen: "「支える側が足りない」と現役世代がため息。",
    effect: { gdp: -3, budget: -4, happiness: -1 },
  },

  /* ===================== 2020〜：現代の課題 ===================== */
  {
    id: "e_pandemic", scope: "crisis", category: "災害", since: 2020,
    title: "感染症が世界に拡大",
    body: "新しい感染症が世界中に広がり、人の動きが止まって経済も大きく揺れています。",
    citizen: "「外に出るのもこわい」と人々は家にこもる。",
    effect: { gdp: -8, happiness: -4, budget: -6, approval: -2 },
    followups: [
      { afterDays: 60, title: "在宅とデジタル化が一気に進む", body: "危機をきっかけに、在宅勤務やオンライン化が急速に広がりました。", category: "技術", effect: { technology: 4, gdp: 3 } },
    ],
  },
  {
    id: "e_ai_surge", scope: "market", category: "技術", since: 2020,
    title: "AI企業が急成長",
    body: "賢い人工知能が次々と登場し、関連企業の価値が爆発的に高まっています。",
    citizen: "「仕事の仕方が変わりそう」と期待と不安が交錯。",
    effect: { technology: 5, gdp: 5, unemployment: 0.3 },
  },
  {
    id: "e_chip_shortage", scope: "crisis", category: "経済", since: 2020,
    title: "半導体が足りない",
    body: "あらゆる機器に必要な半導体が世界的に不足し、自動車や家電の生産が滞っています。",
    citizen: "「注文した車が何か月も来ない」と消費者。",
    effect: { gdp: -5, technology: -1, inflation: 0.5 },
  },
  {
    id: "e_cyber_attack", scope: "crisis", category: "技術", since: 2020,
    title: "大規模サイバー攻撃を受ける",
    body: "重要なシステムがネット越しに攻撃され、一部のサービスが止まりました。",
    citizen: "「個人情報は大丈夫なのか」と不安が広がる。",
    effect: { trust: -2, technology: -1, approval: -2, budget: -3 },
  },
  {
    id: "e_decarbon_pressure", scope: "world", category: "政治", since: 2020,
    title: "脱炭素への国際的な圧力",
    body: "気候変動対策を求める声が世界的に強まり、各国が二酸化炭素削減を競っています。",
    citizen: "「未来のために」と若者が行動を呼びかける。",
    effect: { environment: 3, gdp: -2, trust: 1 },
  },
  {
    id: "e_energy_crisis2", scope: "crisis", category: "経済", since: 2020,
    title: "エネルギー価格が高騰",
    body: "地政学的な混乱で燃料や電気の値段が跳ね上がり、家計と企業を直撃しています。",
    citizen: "「電気代が倍になった」と悲鳴。",
    effect: { inflation: 0.9, happiness: -3, budget: -4 },
  },
  {
    id: "e_migration_issue", scope: "domestic", category: "政治", since: 2020,
    title: "移民・難民の受け入れが争点に",
    body: "人手不足と人道支援の必要から、外国からの人の受け入れが大きな議論になっています。",
    citizen: "「助けたい」「準備が心配」と賛否が割れる。",
    effect: { gdp: 3, approval: -2, happiness: -1 },
  },
  {
    id: "e_inequality", scope: "citizen", category: "政治", since: 2020,
    title: "格差の広がりへの不満",
    body: "豊かな人とそうでない人の差が広がり、社会の分断を心配する声が高まっています。",
    citizen: "「頑張っても報われない」と若い世代。",
    effect: { happiness: -3, approval: -3 },
  },
];
