import type { GameEvent } from "../types/game";

/**
 * 1945〜1973年「戦後復興・高度経済成長・冷戦」の歴史イベント（選択型）。
 * 既存の GameEvent / EventChoice / followups / voices を使う。
 * やさしい言い換え：高度経済成長=「国全体が急激に豊かになる時代」、
 * 冷戦=「大国同士が直接戦わずに競争する時代」、公害=「経済成長の副作用として起きる環境問題」。
 * 冷戦は『戦争』ではなく『緊張・競争』として表現。実在の政治家・政党は出さない。
 */
export const historyEvents1945: GameEvent[] = [
  /* ===== 戦後復興（1945〜1958） ===== */
  {
    id: "h3_recovery_plan_1947",
    since: 1946, until: 1958, category: "経済", scope: "domestic",
    title: "国の再建計画が本格始動",
    body: "【速報】焼け跡からの再出発。住まい・工場・道路の立て直しに国を挙げて取り組みます。",
    citizen: "「前を向いて働こう」と人々に活気が戻る。",
    effect: {},
    historicalNote: "戦後復興は需要を生んで経済を動かし、その後の急成長への助走となった。",
    voices: [
      { characterId: "business", stance: "support", text: "復興需要は巨大です。今こそ大胆に投資すべきです。" },
      { characterId: "finance", stance: "neutral", text: "理想は分かりますが、借金とのバランスが要ります。" },
    ],
    choices: [
      { id: "bold", label: "大規模に投資して一気に再建", description: "復興加速・財政悪化", effect: { gdp: 12, unemployment: -0.6, happiness: 4, budget: -20 }, explanation: "経済と雇用が一気に回復しますが、財政赤字が膨らみます。" },
      { id: "steady", label: "財政を見ながら着実に", description: "堅実・回復は遅い", effect: { gdp: 5, budget: -8, happiness: 2 }, explanation: "無理のない再建で安定しますが、回復には時間がかかります。" },
    ],
  },
  {
    id: "h3_veterans_1947",
    since: 1945, until: 1955, category: "政治", scope: "citizen",
    title: "帰還兵の社会復帰を支える",
    body: "【速報】戦地から戻った人々の仕事と暮らしの立て直しが、社会全体の課題になっています。",
    citizen: "「戦争で青春を失った。やり直したい」と元兵士。",
    effect: {},
    historicalNote: "帰還兵への職業訓練や教育支援は、労働力を生かし社会を安定させる鍵となった。",
    choices: [
      { id: "support", label: "職業訓練と教育で支える", description: "再起を助ける・出費", effect: { unemployment: -0.5, happiness: 4, technology: 1, budget: -12 }, explanation: "人材を生かし社会を安定させますが、支援に費用がかかります。" },
      { id: "market", label: "民間の雇用に任せる", description: "節約・取り残し", effect: { unemployment: 0.3, happiness: -3 }, explanation: "出費は抑えますが、再起できない人が取り残されます。" },
    ],
  },
  {
    id: "h3_blackmarket_end_1949",
    since: 1946, until: 1955, category: "経済", scope: "market",
    title: "闇市から正常な経済へ",
    body: "【速報】混乱期の闇取引から、正規の流通と価格へ——経済を健全に戻す取り組みが進みます。",
    citizen: "「ようやく普通に買い物ができる」と安堵。",
    effect: {},
    historicalNote: "統制と闇市場の混乱から正常な市場経済へ戻すことは、復興期の重要な課題だった。",
    choices: [
      { id: "stabilize", label: "通貨と物価を安定させる", description: "信用回復・一時の痛み", effect: { inflation: -0.8, trust: 3, gdp: 3, happiness: 1 }, explanation: "経済の土台が整いますが、引き締めで一時的に痛みも出ます。" },
      { id: "gradual", label: "段階的に自由化する", description: "穏当・混乱が長引く", effect: { gdp: 4, inflation: 0.3 }, explanation: "急激な痛みは避けますが、正常化に時間がかかります。" },
    ],
  },
  {
    id: "h3_recovery_done_1955",
    since: 1953, until: 1962, category: "経済", scope: "positive",
    title: "戦後復興がほぼ完了する",
    body: "【速報】生産も暮らしも戦前の水準を取り戻しました。「もはや復興ではない」と次の時代が見えてきました。",
    citizen: "「やっと人並みの暮らしに戻れた」と笑顔。",
    effect: {},
    historicalNote: "戦前水準の回復は一つの節目となり、ここから本格的な高度経済成長が始まった。",
    choices: [
      { id: "growth", label: "次は成長の時代へ踏み出す", description: "飛躍を狙う・過熱注意", effect: { gdp: 10, technology: 3, happiness: 4, environment: -3 }, explanation: "豊かさへの飛躍を狙いますが、成長の副作用にも目配りが要ります。" },
      { id: "consolidate", label: "暮らしの底上げを固める", description: "安定・地味", effect: { happiness: 5, approval: 3, budget: -6 }, explanation: "国民全体の暮らしを着実に底上げします。" },
    ],
    followups: [
      { afterDays: 120, title: "「国全体が急激に豊かになる時代」へ", body: "生産も消費も右肩上がり。誰もが来年はもっと良くなると信じています。", category: "経済", effect: { gdp: 8, happiness: 4 } },
    ],
  },

  /* ===== 高度経済成長（1955〜1973） ===== */
  {
    id: "h3_industrial_1958",
    since: 1955, until: 1973, category: "経済", scope: "domestic",
    title: "工業化が加速し、豊かさが急上昇",
    body: "【速報】重化学工業がフル稼働し、国全体が急激に豊かになっています。ただし空や川の汚れも気になり始めました。",
    citizen: "「給料が上がりました！」「最近、空気が汚れてきた気が…」と複雑。",
    effect: {},
    historicalNote: "高度経済成長（国全体が急激に豊かになる時代）は生活を一変させたが、公害という副作用も生んだ。",
    voices: [
      { characterId: "business", stance: "support", text: "成長を最優先すべきです。今は走るときです。" },
      { characterId: "welfare", stance: "oppose", text: "公害対策が必要です。健康あっての豊かさです。" },
      { characterId: "finance", stance: "neutral", text: "財政との両立も忘れてはいけません。" },
    ],
    choices: [
      { id: "growth", label: "工業投資を強化する", description: "豊かさ↑・公害↑", effect: { gdp: 14, technology: 4, environment: -7, happiness: 2 }, explanation: "国は急速に豊かになりますが、公害が深刻化します。" },
      { id: "regulate", label: "環境規制を強化する", description: "暮らし↑・成長は鈍る", effect: { gdp: 4, environment: 5, happiness: 5, budget: -6 }, explanation: "健康と環境を守りますが、成長の勢いはやや鈍ります。" },
      { id: "balance", label: "バランスを重視する", description: "安定・どちらも限定的", effect: { gdp: 8, environment: -2, happiness: 3 }, explanation: "成長と環境の中間を取り、安定を狙います。" },
    ],
  },
  {
    id: "h3_export_1960",
    since: 1955, until: 1973, category: "市場", scope: "market",
    title: "国内企業が世界へ進出",
    body: "【速報】輸出が過去最高を更新！街では新しい工場や商業施設が次々と建設されています。",
    citizen: "「うちの製品が海外で売れている」と誇らしげ。",
    effect: {},
    historicalNote: "輸出主導の成長は外貨と雇用を生み、加工貿易立国の道を切り開いた。",
    choices: [
      { id: "boost", label: "輸出産業をさらに後押し", description: "豊かさ↑・通商摩擦も", effect: { gdp: 10, budget: 4, trust: -2 }, explanation: "経済は潤いますが、相手国との貿易摩擦の芽も生まれます。" },
      { id: "domestic", label: "内需も育ててバランスを取る", description: "安定・成長は穏やか", effect: { gdp: 5, happiness: 4 }, explanation: "国内市場も育て、外需頼みの危うさを避けます。" },
    ],
  },
  {
    id: "h3_appliances_1962",
    since: 1955, until: 1972, category: "技術", scope: "domestic",
    title: "家電が家庭に行きわたる",
    body: "【速報】洗濯機・冷蔵庫・テレビが「あこがれの品」から「当たり前」へ。暮らしが激変しています。",
    citizen: "「新しい家電が買えました！」と主婦は笑顔。",
    effect: {},
    historicalNote: "家電の普及は家事を軽減し、女性の社会進出や大量消費社会の到来を後押しした。",
    choices: [
      { id: "promote", label: "国産家電産業を育てる", description: "産業と暮らし↑・投資", effect: { gdp: 8, technology: 4, happiness: 4, budget: -8 }, explanation: "国民の暮らしと国の産業が同時に潤いますが、支援に費用がかかります。" },
      { id: "import", label: "輸入も自由にする", description: "消費者は得・国内競争激化", effect: { happiness: 3, gdp: 3, trust: 2 }, explanation: "消費者は安く買えますが、国内メーカーは競争にさらされます。" },
    ],
  },
  {
    id: "h3_auto_1963",
    since: 1958, until: 1973, category: "経済", scope: "domestic",
    title: "自動車産業が基幹産業に育つ",
    body: "【速報】マイカーの時代が到来し、自動車産業が国の経済を引っ張る存在になっています。",
    citizen: "「いつか自分の車を」と若者の夢が広がる。",
    effect: {},
    historicalNote: "自動車産業は裾野が広く、鉄鋼・部品・道路・石油など多くの産業を牽引した。",
    choices: [
      { id: "invest", label: "自動車産業を国策で支援", description: "経済↑・道路と公害の課題", effect: { gdp: 11, technology: 3, environment: -4, budget: -8 }, explanation: "経済の柱が育ちますが、道路整備や排ガスの課題も生まれます。" },
      { id: "transit", label: "公共交通も同時に整える", description: "バランス・成長は穏やか", effect: { gdp: 5, happiness: 4, environment: 2, budget: -10 }, explanation: "車社会の弊害を抑えますが、費用がかかり成長は穏やかです。" },
    ],
  },
  {
    id: "h3_highway_1964",
    since: 1960, until: 1975, category: "経済", scope: "domestic",
    title: "高速道路網の建設計画",
    body: "【速報】国の隅々を結ぶ高速道路の大計画。物流と地域開発の起爆剤として期待されています。",
    citizen: "「どこへでも車で行ける時代だ」と期待。",
    effect: {},
    historicalNote: "高速道路網は物流を効率化し地域開発を促したが、巨額の投資と環境への影響も伴った。",
    voices: [
      { characterId: "business", stance: "support", text: "物流の大動脈です。経済成長に不可欠です。" },
      { characterId: "finance", stance: "neutral", text: "巨額の事業です。採算と借金を見極めましょう。" },
    ],
    choices: [
      { id: "build", label: "全国網を一気に整備", description: "成長↑・財政と環境負担", effect: { gdp: 12, unemployment: -0.4, budget: -22, environment: -4 }, explanation: "経済と雇用を強力に押し上げますが、巨額の借金と環境負荷を伴います。" },
      { id: "phased", label: "主要路線から段階的に", description: "堅実・効果は緩やか", effect: { gdp: 6, budget: -10, environment: -2 }, explanation: "必要な区間に絞り、財政の無理を避けます。" },
    ],
    followups: [
      { afterDays: 150, title: "高速道路網が地域経済を活性化", body: "道がつながり、地方にも工場や観光客が訪れるようになりました。", category: "経済", effect: { gdp: 8, happiness: 3 } },
    ],
  },
  {
    id: "h3_port_1961",
    since: 1955, until: 1973, category: "経済", scope: "domestic",
    title: "貿易港・工業地帯の整備",
    body: "【速報】臨海部に巨大な工業地帯と港を造成し、輸出立国の土台を固めます。",
    citizen: "「海辺が一大コンビナートに」と驚きの声。",
    effect: {},
    historicalNote: "臨海工業地帯の造成は輸出産業を支えたが、後に沿岸の公害問題の舞台にもなった。",
    choices: [
      { id: "develop", label: "大規模に開発する", description: "輸出力↑・環境負担", effect: { gdp: 9, trust: 2, environment: -5, budget: -12 }, explanation: "輸出の競争力が高まりますが、沿岸環境への負荷が増します。" },
      { id: "modest", label: "環境に配慮して進める", description: "穏当・成長は控えめ", effect: { gdp: 4, environment: 1, budget: -8 }, explanation: "環境に配慮しつつ整備しますが、効果は控えめです。" },
    ],
  },
  {
    id: "h3_expo_1968",
    since: 1958, until: 1975, category: "外交", scope: "positive",
    title: "国際博覧会を開催する好機",
    body: "【速報】世界から人と技術が集う国際博覧会の開催地に。国の発展を世界に示す舞台です。",
    citizen: "「未来の暮らしが見られる」と家族で心待ち。",
    effect: {},
    historicalNote: "国際博覧会は国の発展と技術を世界に示し、観光・インフラ・国民の誇りを高める一大行事となった。",
    choices: [
      { id: "host", label: "盛大に開催する", description: "威信と経済↑・巨額の費用", effect: { trust: 7, gdp: 8, happiness: 5, budget: -16 }, explanation: "国際的な評価と経済効果、国民の誇りを得ますが、開催費は莫大です。" },
      { id: "modest", label: "堅実な規模で開く", description: "効果も費用も中程度", effect: { trust: 3, gdp: 3, happiness: 2, budget: -6 }, explanation: "無理のない範囲で開催し、そこそこの成果を得ます。" },
    ],
  },

  /* ===== 教育 ===== */
  {
    id: "h3_education_1958",
    since: 1950, until: 1973, category: "政治", scope: "domestic",
    title: "教育の機会を広げる",
    body: "【速報】成長を支える人材を育てるため、学校の整備と就学の支援が進められています。",
    citizen: "「子どもにはちゃんと教育を受けさせたい」と親。",
    effect: {},
    historicalNote: "教育の普及は質の高い労働力を生み、高度経済成長を人の面から支えた。",
    choices: [
      { id: "invest", label: "教育に大きく投資する", description: "将来の国力↑・出費", effect: { technology: 4, happiness: 3, budget: -12 }, explanation: "未来の国力の土台になりますが、当面の支出が増えます。" },
      { id: "basic", label: "基礎教育に絞る", description: "節約・伸びは限定", effect: { technology: 2, budget: -5 }, explanation: "費用を抑えますが、高度人材の育成は限られます。" },
    ],
  },
  {
    id: "h3_university_1962",
    since: 1955, until: 1973, category: "政治", scope: "citizen",
    title: "大学進学率が急上昇",
    body: "【速報】「うちの子も大学へ」という家庭が増え、大学の拡充が追いつかないほどです。",
    citizen: "「子どもを大学へ行かせたいです」と多くの親。",
    effect: {},
    historicalNote: "高等教育の大衆化は技術者や専門職を大量に生み、社会の高度化を進めた。",
    voices: [
      { characterId: "business", stance: "support", text: "高度人材は産業の高度化に不可欠です。" },
      { characterId: "finance", stance: "neutral", text: "大学の拡充には継続的な財源が要ります。" },
    ],
    choices: [
      { id: "expand", label: "大学を大幅に増やす", description: "人材↑・財政負担", effect: { technology: 6, gdp: 5, budget: -14, happiness: 3 }, explanation: "高度人材が育ち産業が強くなりますが、財政の負担が増します。" },
      { id: "quality", label: "数より質を重んじる", description: "堅実・門戸は狭い", effect: { technology: 3, budget: -6 }, explanation: "質の高い教育を保ちますが、進学を望む層には狭き門です。" },
    ],
  },
  {
    id: "h3_research_1960",
    since: 1950, until: 1973, category: "技術", scope: "domestic",
    title: "研究機関を設立し科学技術へ投資",
    body: "【速報】国立の研究所を整え、最先端の科学技術に国を挙げて取り組みます。",
    citizen: "「我が国の技術が世界に追いつく日も近い」と期待。",
    effect: {},
    historicalNote: "科学技術への公的投資は、後の技術立国・輸出産業の競争力の源泉となった。",
    choices: [
      { id: "fund", label: "研究開発に大きく投資", description: "技術↑・成果は数年後", effect: { technology: 6, gdp: 4, budget: -12 }, explanation: "将来の競争力を育てますが、成果が出るには時間がかかります。" },
      { id: "applied", label: "すぐ役立つ応用研究に絞る", description: "即効・基礎が手薄", effect: { technology: 3, gdp: 3, budget: -6 }, explanation: "短期の成果を狙いますが、基礎研究の厚みは欠きます。" },
    ],
  },

  /* ===== 福祉 ===== */
  {
    id: "h3_health_1958",
    since: 1950, until: 1973, category: "政治", scope: "citizen",
    title: "医療制度を整える",
    body: "【速報】誰もが病院にかかれる仕組みづくりが進み、暮らしの安心が高まっています。",
    citizen: "「お金の心配なく医者にかかれる」と高齢者は安堵。",
    effect: {},
    historicalNote: "国民皆保険など医療制度の整備は平均寿命を延ばし、福祉国家への歩みを進めた。",
    choices: [
      { id: "universal", label: "皆保険を整える", description: "安心↑・継続財源が必要", effect: { happiness: 7, approval: 5, budget: -16 }, explanation: "暮らしの安心が大きく高まりますが、毎年の財源が必要です。" },
      { id: "partial", label: "対象を絞って始める", description: "穏当・取りこぼし", effect: { happiness: 3, budget: -6 }, explanation: "費用を抑えますが、制度から漏れる人が出ます。" },
    ],
  },
  {
    id: "h3_pension_1961",
    since: 1955, until: 1973, category: "政治", scope: "citizen",
    title: "年金制度を整備する",
    body: "【速報】老後の暮らしを社会で支える年金の仕組みづくりが議論されています。",
    citizen: "「老後の不安が減るなら」と現役世代も歓迎。",
    effect: {},
    historicalNote: "年金制度は老後の安心を生んだが、将来の人口構造次第で持続性が課題となる仕組みでもあった。",
    choices: [
      { id: "generous", label: "手厚い年金を約束する", description: "安心↑・将来の負担大", effect: { happiness: 6, approval: 5, budget: -10 }, explanation: "老後の安心は高まりますが、将来世代への負担を約束することになります。" },
      { id: "sustainable", label: "持続可能な範囲にとどめる", description: "堅実・物足りなさ", effect: { happiness: 2, approval: 1, budget: -4 }, explanation: "将来も続く制度にしますが、当面は物足りないと見られます。" },
    ],
  },
  {
    id: "h3_welfare_reform_1965",
    since: 1958, until: 1974, category: "政治", scope: "domestic",
    title: "社会保障を改革する",
    body: "【速報】成長で生まれた富を、暮らしの安心にどう配るか——社会保障の在り方が問われています。",
    citizen: "「成長の恩恵をみんなに」と願う声。",
    effect: {},
    historicalNote: "成長期の社会保障拡充は『豊かさの分配』を進めたが、財政との両立が常に課題となった。",
    voices: [
      { characterId: "citizen", stance: "support", text: "生活の豊かさも重要です。安心を広げてください。" },
      { characterId: "finance", stance: "oppose", text: "一度広げた給付は減らせません。財政を慎重に。" },
      { characterId: "business", stance: "neutral", text: "安心が消費を生むなら、経済にもプラスです。" },
    ],
    choices: [
      { id: "expand", label: "社会保障を手厚くする", description: "暮らし↑・財政負担", effect: { happiness: 7, approval: 5, budget: -16 }, explanation: "豊かさを広く分配しますが、継続的な財政負担を抱えます。" },
      { id: "balance", label: "成長と両立する範囲で", description: "穏当・どちらも程々", effect: { happiness: 3, gdp: 2, budget: -6 }, explanation: "成長を損なわない範囲で安心を広げます。" },
    ],
  },

  /* ===== 冷戦（緊張・競争として） ===== */
  {
    id: "h3_coldwar_1948",
    since: 1947, until: 1975, category: "外交", scope: "diplo",
    title: "東西対立の時代が始まる",
    body: "【速報】二つの大国が、直接は戦わないまま世界中で勢力と体制を競い合う時代に入りました。",
    citizen: "「どちらの陣営につくべきか」と国論も揺れる。",
    effect: {},
    historicalNote: "冷戦（大国同士が直接戦わずに競争する時代）は、軍拡・宇宙・経済・思想のあらゆる面で世界を二分した。",
    voices: [
      { characterId: "defense", stance: "support", text: "どちらかの後ろ盾は安全のために必要です。" },
      { characterId: "foreign", stance: "neutral", text: "巧みに立ち回れば、中立も大きな価値になります。" },
    ],
    choices: [
      { id: "align", label: "一方の陣営に加わる", description: "後ろ盾↑・自由は制約", effect: { trust: 5, military: 3, budget: -6 }, explanation: "強力な後ろ盾と援助を得ますが、その陣営の論理に縛られます。" },
      { id: "nonaligned", label: "どちらにも属さず中立を保つ", description: "自由・板挟み", effect: { trust: 2, gdp: 3, military: 1 }, explanation: "独自の立場で両陣営と付き合えますが、双方から圧力を受けます。" },
    ],
  },
  {
    id: "h3_alliance_1951",
    since: 1949, until: 1973, category: "外交", scope: "diplo",
    title: "軍事同盟への参加を問われる",
    body: "【速報】陣営の軍事同盟に加わるか否か。安全と引き換えに、基地や負担も求められます。",
    citizen: "「守ってもらえるなら」「巻き込まれる」と賛否。",
    effect: {},
    historicalNote: "冷戦下の軍事同盟は安全保障の柱となったが、基地問題や陣営対立への関与も生んだ。",
    choices: [
      { id: "join", label: "同盟に加わる", description: "安全↑・基地と拘束", effect: { trust: 5, military: 4, happiness: -2, budget: -6 }, explanation: "守りは固まりますが、基地の受け入れや陣営対立への関与を伴います。" },
      { id: "independent", label: "自主防衛を選ぶ", description: "自由・コスト増", effect: { military: 3, trust: -2, budget: -12 }, explanation: "自由を保ちますが、自前の防衛に大きな費用がかかります。" },
    ],
  },
  {
    id: "h3_nuke_1955",
    since: 1949, until: 1975, category: "外交", scope: "crisis",
    title: "核実験をめぐる国際緊張",
    body: "【緊急速報】大国の核実験が相次ぎ、世界に緊張が走っています。核の脅威にどう向き合うか。",
    citizen: "「きのこ雲のニュースが怖い」と不安の声。",
    effect: {},
    historicalNote: "核開発競争は『恐怖の均衡』を生み、直接戦争を避けさせる一方、人類規模の不安をもたらした。",
    voices: [
      { characterId: "defense", stance: "support", text: "抑止力なくして、核の時代は生き残れません。" },
      { characterId: "citizen", stance: "oppose", text: "核には反対です。平和の声を上げてください。" },
    ],
    choices: [
      { id: "deterrence", label: "同盟の核の傘に頼る", description: "守り↑・自主性は低下", effect: { military: 4, trust: 3, happiness: -2 }, explanation: "核の脅威から守られますが、陣営への依存が深まります。" },
      { id: "antinuke", label: "核廃絶と軍縮を訴える", description: "信用と支持↑・守りは薄い", effect: { trust: 5, approval: 4, happiness: 3, military: -2 }, explanation: "平和の担い手として信用と支持を得ますが、現実の守りは手薄です。" },
    ],
  },
  {
    id: "h3_space_1961",
    since: 1957, until: 1975, category: "技術", scope: "positive",
    title: "宇宙開発競争に沸く世界",
    body: "【速報】大国が次々と人工衛星やロケットを打ち上げ、宇宙が新たな競争と憧れの舞台になっています。",
    citizen: "「夜空の衛星を見上げた」と子どもたちが興奮。",
    effect: {},
    historicalNote: "冷戦下の宇宙開発競争は、ロケットや通信、コンピュータなど多くの技術革新を生んだ。",
    choices: [
      { id: "invest", label: "宇宙・先端技術に投資する", description: "技術と威信↑・巨額", effect: { technology: 7, trust: 4, gdp: 3, budget: -16 }, explanation: "最先端技術と国際的威信を得ますが、莫大な投資が必要です。" },
      { id: "applied", label: "通信や気象など実用に絞る", description: "堅実・派手さなし", effect: { technology: 4, gdp: 3, budget: -6 }, explanation: "暮らしに役立つ技術を着実に得ますが、華やかな成果は控えめです。" },
    ],
    followups: [
      { afterDays: 120, title: "衛星技術が通信と暮らしを変える", body: "宇宙開発で培った技術が、通信や天気予報など暮らしにも応用され始めました。", category: "技術", effect: { technology: 4, gdp: 3 } },
    ],
  },
  {
    id: "h3_spy_1962",
    since: 1948, until: 1975, category: "外交", scope: "crisis",
    title: "スパイ事件が発覚する",
    body: "【速報】機密を探る諜報活動が明るみに出て、外交問題に発展しかねない事態です。",
    citizen: "「裏でそんなことが」と国民は驚き。",
    effect: {},
    historicalNote: "冷戦は諜報・防諜の影の戦いでもあり、スパイ事件はしばしば国際関係を緊張させた。",
    choices: [
      { id: "firm", label: "毅然と抗議し防諜を固める", description: "威信↑・関係は冷える", effect: { trust: 2, military: 2, budget: -6 }, explanation: "国の威信は保てますが、相手国との関係は冷え込みます。" },
      { id: "quiet", label: "水面下で穏便に処理する", description: "関係維持・弱腰批判", effect: { trust: -1, approval: -2 }, explanation: "関係悪化は避けますが、国内では弱腰と見られます。" },
    ],
  },
  {
    id: "h3_base_1965",
    since: 1950, until: 1975, category: "政治", scope: "citizen",
    title: "軍事基地をめぐる住民の反発",
    body: "【速報】同盟の軍事基地が暮らしの近くにあり、騒音や事件への住民の不満が高まっています。",
    citizen: "「基地はいらない」「でも安全のため」と地域が割れる。",
    effect: {},
    historicalNote: "冷戦下の軍事基地は安全保障の要だったが、地元住民の負担や反対運動という難題も伴った。",
    voices: [
      { characterId: "defense", stance: "support", text: "基地は安全保障の要です。維持すべきです。" },
      { characterId: "citizen", stance: "oppose", text: "暮らしの近くの基地は不安です。負担が大きい。" },
      { characterId: "foreign", stance: "neutral", text: "同盟関係に関わります。慎重な調整が要ります。" },
    ],
    choices: [
      { id: "keep", label: "安全保障を優先し維持", description: "守り↑・住民の不満", effect: { military: 3, trust: 2, happiness: -4, approval: -3 }, explanation: "守りと同盟は保てますが、地元の不満と反対運動が残ります。" },
      { id: "ease", label: "負担軽減を交渉する", description: "暮らし配慮・同盟に摩擦", effect: { happiness: 4, approval: 2, trust: -3 }, explanation: "住民の負担を和らげますが、同盟国との調整は難航します。" },
    ],
  },

  /* ===== 国際経済 ===== */
  {
    id: "h3_trade_1955",
    since: 1950, until: 1973, category: "外交", scope: "world",
    title: "国際貿易の枠組みに加わる",
    body: "【速報】関税を下げ自由な貿易を広げる国際的な枠組みへの参加が議論されています。",
    citizen: "「輸出が増えるなら歓迎」と企業。",
    effect: {},
    historicalNote: "戦後の自由貿易体制は世界経済の成長を支え、加工貿易立国の追い風となった。",
    choices: [
      { id: "join", label: "自由貿易に積極参加する", description: "豊かさ↑・国内競争", effect: { gdp: 9, trust: 5, happiness: 2 }, explanation: "輸出が伸び国際的地位も上がりますが、国内産業は競争にさらされます。" },
      { id: "protect", label: "国内産業を守りつつ慎重に", description: "保護・成長は穏やか", effect: { gdp: 3, happiness: 2, trust: -2 }, explanation: "国内の雇用を守りますが、貿易の恩恵は限られます。" },
    ],
  },
  {
    id: "h3_coop_1960",
    since: 1955, until: 1975, category: "外交", scope: "diplo",
    title: "海外への経済協力と投資",
    body: "【速報】発展途上の国々への援助や、海外への企業進出が広がっています。",
    citizen: "「世界とつながる国になってきた」と実感。",
    effect: {},
    historicalNote: "経済協力や海外投資は国際的信用を高め、資源や市場の確保にもつながった。",
    choices: [
      { id: "aid", label: "経済協力を積極化する", description: "信用↑・出費", effect: { trust: 6, gdp: 3, budget: -10 }, explanation: "国際的な信用と将来の市場を得ますが、当面の支出が増えます。" },
      { id: "domestic", label: "まず国内を優先する", description: "内向き・好機損失", effect: { happiness: 2, budget: 2, trust: -2 }, explanation: "国内に資源を回しますが、国際的な存在感は伸び悩みます。" },
    ],
  },
  {
    id: "h3_currency_1965",
    since: 1955, until: 1973, category: "市場", scope: "market",
    title: "通貨の安定をどう保つか",
    body: "【速報】成長で通貨や物価が動きやすくなり、安定を保つ金融のかじ取りが問われています。",
    citizen: "「物価が上がりすぎないか心配」と家計。",
    effect: {},
    historicalNote: "戦後の固定相場制は通貨を安定させ貿易を促したが、やがて変動相場への移行を迫られた。",
    choices: [
      { id: "stable", label: "通貨と物価の安定を優先", description: "信用↑・成長は抑制", effect: { inflation: -0.5, trust: 4, gdp: -2 }, explanation: "通貨の信用と物価の安定を守りますが、成長はやや抑えられます。" },
      { id: "growth", label: "成長を優先し緩める", description: "景気↑・物価上昇リスク", effect: { gdp: 6, inflation: 0.6 }, explanation: "景気を後押ししますが、物価上昇のリスクを抱えます。" },
    ],
  },

  /* ===== 社会問題（成長の影） ===== */
  {
    id: "h3_population_1960",
    since: 1950, until: 1973, category: "政治", scope: "domestic",
    title: "人口が増え、都市に集中する",
    body: "【速報】成長を求めて人々が都市へ集中。住宅・通勤・学校が追いつきません。",
    citizen: "「満員電車で毎日くたくた」と通勤者。",
    effect: {},
    historicalNote: "成長期の都市集中は活力を生む一方、過密・住宅難・交通難という都市問題を深刻にした。",
    choices: [
      { id: "newtown", label: "郊外開発と交通整備を進める", description: "暮らし改善・出費", effect: { happiness: 5, gdp: 4, budget: -14, environment: -2 }, explanation: "住まいと通勤の負担を和らげますが、開発費がかかります。" },
      { id: "concentrate", label: "都市集中のまま成長を取る", description: "効率↑・過密深まる", effect: { gdp: 6, happiness: -4, environment: -3 }, explanation: "経済効率は高まりますが、過密と暮らしの息苦しさが増します。" },
    ],
  },
  {
    id: "h3_traffic_1964",
    since: 1958, until: 1974, category: "政治", scope: "citizen",
    title: "深刻な交通渋滞と事故",
    body: "【速報】車が増えすぎて道路は大渋滞、交通事故も急増。「交通戦争」とまで呼ばれています。",
    citizen: "「子どもが安心して歩けない」と保護者。",
    effect: {},
    historicalNote: "モータリゼーションの急進は渋滞・事故・大気汚染を招き、交通安全と都市計画の課題を突きつけた。",
    choices: [
      { id: "safety", label: "交通安全と公共交通に投資", description: "暮らし↑・出費", effect: { happiness: 5, environment: 2, budget: -12 }, explanation: "事故と渋滞を減らし暮らしを守りますが、費用がかかります。" },
      { id: "roads", label: "道路をさらに広げる", description: "車優先・事故と公害続く", effect: { gdp: 4, happiness: -2, environment: -3 }, explanation: "車の流れは改善しますが、事故や排ガスの問題は残ります。" },
    ],
  },
  {
    id: "h3_pollution_1967",
    since: 1958, until: 1975, category: "災害", scope: "crisis",
    title: "公害問題が社会問題として表面化",
    body: "【緊急速報】工場の排煙や排水で健康被害が広がり、「経済成長の副作用」として公害が大問題に。",
    citizen: "「成長より、まず健康を返してほしい」と被害住民が訴える。",
    effect: {},
    historicalNote: "公害（経済成長の副作用として起きる環境問題）は深刻な健康被害を生み、環境規制と公害対策法を各国に迫った。",
    voices: [
      { characterId: "welfare", stance: "support", text: "国民の健康が第一です。厳しい規制が必要です。" },
      { characterId: "business", stance: "oppose", text: "急な規制は企業の負担が大きすぎます。" },
      { characterId: "finance", stance: "neutral", text: "対策費は要りますが、放置すれば信頼を失います。" },
    ],
    choices: [
      { id: "regulate", label: "厳しい公害規制を導入する", description: "健康と環境↑・成長は鈍る", effect: { environment: 7, happiness: 6, approval: 4, gdp: -6, budget: -8 }, explanation: "健康と環境を守り信頼を回復しますが、企業負担で成長は鈍ります。" },
      { id: "voluntary", label: "企業の自主努力に任せる", description: "成長維持・被害続く", effect: { gdp: 3, environment: -4, happiness: -5, approval: -4 }, explanation: "成長は守られますが、公害の被害と国民の怒りが続きます。" },
    ],
    followups: [
      { afterDays: 120, title: "公害対策が実を結び、空と川が戻る", body: "規制と技術で汚染が減り、青い空と澄んだ川が少しずつ戻ってきました。", category: "災害", effect: { environment: 5, happiness: 4 } },
    ],
  },
  {
    id: "h3_labor_1968",
    since: 1955, until: 1974, category: "政治", scope: "citizen",
    title: "賃上げを求める労働争議",
    body: "【速報】成長の果実の分配を求め、労働組合が一斉に賃上げ交渉やストに動いています。",
    citizen: "「会社は儲かっている。給料を上げてほしい」と労働者。",
    effect: {},
    historicalNote: "成長期の労使交渉は賃金を押し上げ、分厚い中間層と消費社会の形成につながった。",
    choices: [
      { id: "raise", label: "賃上げを後押しする", description: "暮らしと消費↑・物価も", effect: { happiness: 5, gdp: 3, inflation: 0.5, approval: 3 }, explanation: "暮らしが豊かになり消費も増えますが、物価上昇を伴います。" },
      { id: "restrain", label: "物価への配慮で抑制する", description: "物価安定・不満残る", effect: { inflation: -0.3, happiness: -3, gdp: 2 }, explanation: "物価は安定しますが、労働者の不満がくすぶります。" },
    ],
  },
];
