import type { GameEvent } from "../types/game";

/**
 * 1939〜1945年「第二次世界大戦」の歴史イベント（選択型）。
 * 「戦争ゲーム」ではなく「戦争時代の国家運営」を体験させる。軍事だけでなく
 * 外交・経済・国民生活・復興も同じくらい重く。既存システムをそのまま活用。
 * やさしい言い換え：総力戦=「国全体で戦争を支える状態」、配給制度=「必要な物を
 * 公平に分ける仕組み」、講和交渉=「戦争を終わらせる話し合い」。実在人物・政党は出さない。
 */
export const historyEvents1939: GameEvent[] = [
  /* ===== 戦争勃発（1939〜1941） ===== */
  {
    id: "h2_outbreak_1939",
    since: 1939, until: 1941, category: "外交", scope: "crisis",
    title: "再び世界大戦が勃発",
    body: "【緊急速報】大国が隣国へ侵攻し、世界は再び大戦へ突入しました。あなたの国の針路が問われています。",
    citizen: "「また戦争なのか」と国民に重い空気が広がる。",
    effect: {},
    historicalNote: "第二次世界大戦は、戦間期の経済危機・全体主義の台頭・国際協調の失敗が重なって始まった。",
    voices: [
      { characterId: "defense", stance: "support", text: "備えを最優先に。後手に回れば国が危うい。" },
      { characterId: "finance", stance: "oppose", text: "戦費は国家を破綻させかねません。慎重に。" },
      { characterId: "citizen", stance: "oppose", text: "暮らしを守ってください。戦争だけは…。" },
      { characterId: "foreign", stance: "neutral", text: "中立も参戦も、それぞれに大きな賭けです。" },
    ],
    choices: [
      { id: "neutral", label: "中立を守る", description: "犠牲は避けるが圧力と孤立", effect: { trust: -3, gdp: 5, budget: 4, happiness: 2 }, explanation: "戦禍を免れ各国と取引できますが、両陣営から圧力を受けます。" },
      { id: "prepare", label: "総力戦の備えを始める", description: "守り↑・暮らしと財政に重荷", effect: { military: 9, budget: -20, happiness: -3 }, explanation: "国全体で戦争を支える備えに入りますが、生活と財政に重くのしかかります。" },
      { id: "diplomacy", label: "外交で巻き込まれを避ける", description: "回避を狙う・失敗の危険", effect: { trust: 5, military: 1, approval: -2 }, explanation: "交渉で戦争を避けようとしますが、相手次第では裏目に出ます。" },
    ],
    followups: [
      { afterDays: 90, title: "戦争が長引き、あらゆる物が不足する", body: "戦線が広がり、燃料も食料も足りなくなってきました。", category: "経済", effect: { inflation: 1.0, happiness: -5, gdp: -5 } },
      { afterDays: 210, title: "戦後の復興という重荷", body: "戦いが収まっても、焼け跡と借金の重荷が国に残りました。", category: "経済", effect: { budget: -12, gdp: -4 } },
    ],
  },
  {
    id: "h2_invasion_1940",
    since: 1939, until: 1943, category: "外交", scope: "crisis",
    title: "隣国への侵攻に対応を迫られる",
    body: "【緊急速報】近隣で軍事侵攻が始まり、難民と緊張が押し寄せています。傍観か、関与か。",
    citizen: "「明日は我が身では」と国境の町は震える。",
    effect: {},
    historicalNote: "侵略の連鎖は中立国にも難民流入や安全保障の危機をもたらし、巻き込まれを避けるのを難しくした。",
    choices: [
      { id: "aid", label: "侵略された側を支援する", description: "信用↑・敵を作る", effect: { trust: 6, military: 2, budget: -12, happiness: -2 }, explanation: "人道と正義の側に立ち信用を得ますが、侵略国の敵意を買います。" },
      { id: "neutral", label: "関わらず防衛を固める", description: "安全重視・冷ややかな目", effect: { military: 4, trust: -3, budget: -8 }, explanation: "自国の守りを優先しますが、見て見ぬふりと批判されます。" },
    ],
  },
  {
    id: "h2_allyrequest_1940",
    since: 1939, until: 1944, category: "外交", scope: "diplo",
    title: "同盟国から支援を求められる",
    body: "【速報】共に戦う同盟国が、兵力・物資・資金の支援を強く求めてきました。",
    citizen: "「約束は守るべき」「うちも余裕がない」と割れる。",
    effect: {},
    historicalNote: "同盟は支え合いの力であると同時に、戦争への深い関与を避けられなくする拘束でもあった。",
    voices: [
      { characterId: "foreign", stance: "support", text: "信義を欠けば、いざという時に誰も助けてくれません。" },
      { characterId: "finance", stance: "oppose", text: "自国の備えも足りないのに、これ以上は…。" },
    ],
    choices: [
      { id: "full", label: "全面的に支援する", description: "結束↑・自国は消耗", effect: { trust: 7, military: -2, budget: -16, happiness: -2 }, explanation: "同盟の絆は強まりますが、自国の余力を大きく削ります。" },
      { id: "limited", label: "できる範囲で支える", description: "現実的なバランス", effect: { trust: 3, budget: -7 }, explanation: "信義を保ちつつ無理のない範囲で助けます。" },
      { id: "refuse", label: "自国優先で断る", description: "余力温存・信用低下", effect: { trust: -5, military: 1 }, explanation: "自国の備えは守れますが、同盟内で孤立しかねません。" },
    ],
  },
  {
    id: "h2_neutral_1940",
    since: 1939, until: 1944, category: "外交", scope: "diplo",
    title: "中立を保てるか、圧力が強まる",
    body: "【速報】両陣営から「どちらにつくのか」と踏み絵を迫られ、中立の維持が難しくなっています。",
    citizen: "「巻き込まれたくない」と多くの国民。",
    effect: {},
    historicalNote: "中立の維持は巧みな外交と運を要し、戦争の拡大とともに各国でいっそう困難になった。",
    choices: [
      { id: "stayneutral", label: "あくまで中立を貫く", description: "犠牲回避・板挟み", effect: { trust: -2, gdp: 4, budget: 3 }, explanation: "戦禍を避け取引も続けられますが、両陣営の不満という板挟みに耐えます。" },
      { id: "lean", label: "一方に歩み寄る", description: "後ろ盾を得る・敵も作る", effect: { trust: 3, military: 2, budget: -6 }, explanation: "後ろ盾を得ますが、反対陣営を明確な敵に回します。" },
    ],
  },

  /* ===== 軍事 ===== */
  {
    id: "h2_draft_1940",
    since: 1939, until: 1945, category: "政治", scope: "domestic",
    title: "国民を兵士として集める制度の拡大",
    body: "【速報】兵力を確保するため、広く国民を兵として集める仕組みの強化が検討されています。",
    citizen: "「家族が戦地へ行きました」と涙ぐむ母。",
    effect: {},
    historicalNote: "徴兵（国民を兵士として集める制度）は大量動員を可能にしたが、家族と労働力を戦場に奪った。",
    voices: [
      { characterId: "defense", stance: "support", text: "兵力なくして国は守れません。動員は不可欠です。" },
      { characterId: "citizen", stance: "oppose", text: "働き手も息子も取られては、暮らしが立ちません。" },
      { characterId: "foreign", stance: "neutral", text: "外交で危機を避けられるなら、それが最善です。" },
    ],
    choices: [
      { id: "expand", label: "徴兵を拡大する", description: "軍事力↑・幸福と支持↓", effect: { military: 10, happiness: -5, approval: -4, gdp: -3 }, explanation: "兵力は整いますが、家族の悲しみと働き手不足を招きます。" },
      { id: "volunteer", label: "志願制を維持する", description: "国民満足・兵力不足", effect: { military: 3, happiness: 1 }, explanation: "国民の不満は抑えられますが、必要な兵力に届きません。" },
      { id: "diplomacy", label: "外交解決を優先する", description: "戦争回避の望み・失敗は危険", effect: { trust: 4, military: -1, approval: -1 }, explanation: "動員を避け交渉に賭けますが、失敗すれば守りが手薄なまま危機を迎えます。" },
    ],
  },
  {
    id: "h2_armsexpand_1941",
    since: 1939, until: 1945, category: "市場", scope: "market",
    title: "軍備拡張と軍需産業の急成長",
    body: "【速報】戦車・艦船・航空機の生産が最優先となり、軍需企業の株価が急騰しています。",
    citizen: "「軍需工場は人手不足、でも食料品は手に入らない」と矛盾。",
    effect: {},
    historicalNote: "戦時の軍需は経済を一時的に膨張させたが、生活物資の欠乏と物価高（インフレ）を深刻にした。",
    choices: [
      { id: "maximize", label: "生産を軍需に全振りする", description: "戦力↑・暮らし犠牲", effect: { military: 8, gdp: 5, happiness: -6, inflation: 0.8 }, explanation: "戦力は最大化しますが、国民生活が極限まで切り詰められます。" },
      { id: "balance", label: "民需も一定は確保する", description: "穏当・戦力は伸び悩む", effect: { military: 4, happiness: -2, budget: -8 }, explanation: "暮らしへの配慮で不満を抑えますが、軍備の伸びは鈍ります。" },
    ],
  },
  {
    id: "h2_airdefense_1941",
    since: 1939, until: 1945, category: "政治", scope: "domestic",
    title: "空からの攻撃に備える",
    body: "【速報】敵機の脅威に備え、防空壕や警報、灯火管制の整備が急がれています。",
    citizen: "「夜は灯りを消して」と隣組が声をかけ合う。",
    effect: {},
    historicalNote: "防空体制は市民を巻き込む総力戦の象徴で、銃後の暮らしを大きく変えた。",
    choices: [
      { id: "build", label: "防空体制を本格整備する", description: "被害軽減・出費", effect: { happiness: 3, military: 2, budget: -12 }, explanation: "空襲の被害を抑え国民を守れますが、費用がかかります。" },
      { id: "minimal", label: "最低限にとどめる", description: "節約・被害拡大の恐れ", effect: { budget: -3, happiness: -2 }, explanation: "出費は抑えますが、いざ空襲のとき被害が大きくなります。" },
    ],
  },
  {
    id: "h2_intel_1942",
    since: 1939, until: 1945, category: "技術", scope: "domestic",
    title: "見えない戦い——情報戦",
    body: "【速報】敵の通信を探り、味方の秘密を守る「情報戦」が戦況を左右し始めています。",
    citizen: "「うわさに惑わされるな」と注意喚起。",
    effect: {},
    historicalNote: "暗号解読や諜報といった情報戦は、表に出ないまま戦争の勝敗を大きく動かした。",
    choices: [
      { id: "invest", label: "諜報・防諜に投資する", description: "優位↑・費用", effect: { military: 4, technology: 3, trust: 1, budget: -8 }, explanation: "戦況を有利にし技術も育ちますが、地味で費用のかかる投資です。" },
      { id: "skip", label: "正面の戦力を優先する", description: "目に見える備え・情報で後手", effect: { military: 3, technology: -1 }, explanation: "目に見える軍備を優先しますが、見えない戦いで後れを取ります。" },
    ],
  },

  /* ===== 経済・統制 ===== */
  {
    id: "h2_supply_1941",
    since: 1939, until: 1946, category: "経済", scope: "crisis",
    title: "あらゆる物資が不足する",
    body: "【速報】鉄も布も足りず、釘一本まで節約の呼びかけ。生活と生産の両方が細っています。",
    citizen: "「金属は供出、鍋まで持っていかれた」とぼやく。",
    effect: {},
    historicalNote: "総力戦下の物資不足は、回収・代用品・節約の運動を生み、暮らしの隅々を統制した。",
    choices: [
      { id: "control", label: "国が物資を統制し配分する", description: "公平・自由は制限", effect: { gdp: 2, happiness: -3, military: 2, budget: -6 }, explanation: "限りある物資を重要な所へ回せますが、暮らしの自由は奪われます。" },
      { id: "market", label: "市場の調整に任せる", description: "自由だが買い占めと格差", effect: { inflation: 0.8, happiness: -4, gdp: -2 }, explanation: "統制は避けますが、買い占めと価格高騰で弱者が苦しみます。" },
    ],
  },
  {
    id: "h2_fuel_1942",
    since: 1939, until: 1946, category: "経済", scope: "crisis",
    title: "深刻な燃料・エネルギー不足",
    body: "【緊急速報】石油や石炭が底をつき、工場も交通も止まりかけています。",
    citizen: "「バスも来ない、暖も取れない」と凍える冬。",
    effect: {},
    historicalNote: "資源の乏しさは戦争遂行の生命線であり、エネルギー確保が国家戦略の中心となった。",
    choices: [
      { id: "ration", label: "燃料を軍と工場に優先配分", description: "戦力維持・生活直撃", effect: { military: 3, gdp: 2, happiness: -5 }, explanation: "戦争と生産は維持できますが、国民生活が凍えます。" },
      { id: "alt", label: "代替燃料の開発を急ぐ", description: "将来の備え・即効性なし", effect: { technology: 4, budget: -10, gdp: -2 }, explanation: "長い目では自給に近づきますが、当面の不足は解消しません。" },
    ],
  },
  {
    id: "h2_food_1942",
    since: 1939, until: 1947, category: "災害", scope: "crisis",
    title: "食料が決定的に足りない",
    body: "【号外】輸入は途絶え、働き手は戦地へ。配給だけでは腹を満たせず、栄養不足が広がっています。",
    citizen: "「配給だけでは足りません」と痩せた子を抱える母。",
    effect: {},
    historicalNote: "食料難は銃後の最大の苦しみで、配給・代用食・自給の努力が国民生活を覆った。",
    voices: [
      { characterId: "citizen", stance: "support", text: "せめて子どもに食べさせたい。何とかしてください。" },
      { characterId: "finance", stance: "neutral", text: "輸入も増産も、どちらも大きな費用がかかります。" },
    ],
    choices: [
      { id: "ration", label: "配給制で公平に分ける", description: "餓えを防ぐ・不満は残る", effect: { happiness: -2, approval: 3, budget: -8 }, explanation: "必要な物を公平に分け飢えを防ぎますが、ひもじさへの不満は消えません。" },
      { id: "increase", label: "増産と輸入に全力", description: "供給↑・財政悪化", effect: { happiness: 2, budget: -16, gdp: 2 }, explanation: "食料を確保しますが、財政の負担が重くなります。" },
      { id: "market", label: "市場に任せる", description: "出費なし・困窮拡大", effect: { happiness: -7, approval: -6, inflation: 0.8 }, explanation: "支出は避けられますが、価格高騰と飢えが広がります。" },
    ],
  },
  {
    id: "h2_rationing_1941",
    since: 1939, until: 1947, category: "政治", scope: "domestic",
    title: "必要な物を公平に分ける仕組み",
    body: "【速報】不足する物資を行き渡らせるため、切符で配る「配給制度」の導入が決まりつつあります。",
    citizen: "「並んででも、皆に行き渡るなら」と理解を示す声も。",
    effect: {},
    historicalNote: "配給制度（必要な物を公平に分ける仕組み）は混乱を抑えたが、闇市場という影も生んだ。",
    choices: [
      { id: "strict", label: "厳格に配給を運用する", description: "公平・闇市場の芽", effect: { happiness: 1, approval: 3, gdp: -3 }, explanation: "公平さは保てますが、裏で闇取引が生まれます。" },
      { id: "loose", label: "ある程度自由を残す", description: "不満は小・不公平も", effect: { happiness: -1, inflation: 0.5 }, explanation: "窮屈さは和らぎますが、持てる者と持たざる者の差が出ます。" },
    ],
  },
  {
    id: "h2_blackmarket_1943",
    since: 1940, until: 1947, category: "市場", scope: "crisis",
    title: "闇市場がはびこる",
    body: "【速報】配給では足りず、高値で物を売り買いする闇市場が広がっています。取り締まるべきか。",
    citizen: "「闇でしか手に入らない、でも高すぎる」と嘆く。",
    effect: {},
    historicalNote: "統制経済の裏で生まれた闇市場は、人々の生存を支える一方、不公平と腐敗の温床にもなった。",
    choices: [
      { id: "crackdown", label: "厳しく取り締まる", description: "秩序↑・生活はさらに苦しく", effect: { approval: 2, happiness: -4, gdp: -2 }, explanation: "公平の建前は守られますが、抜け道を断たれた人々はさらに困窮します。" },
      { id: "tolerate", label: "黙認して生活を回す", description: "暮らしは回る・不公平拡大", effect: { happiness: 2, trust: -2, inflation: 0.4 }, explanation: "人々の生活は何とか回りますが、不公平と腐敗が広がります。" },
    ],
  },

  /* ===== 市民生活 ===== */
  {
    id: "h2_airraid_1943",
    since: 1940, until: 1945, category: "災害", scope: "crisis",
    title: "都市が大空襲を受ける",
    body: "【緊急速報】敵機による大規模な空襲で市街地が焼け、多くの人が家と肉親を失いました。",
    citizen: "「一夜にして街が消えた」と焼け跡に立ち尽くす。",
    effect: {},
    historicalNote: "都市への無差別爆撃は総力戦の悲劇を象徴し、銃後の市民にも甚大な犠牲を強いた。",
    choices: [
      { id: "rescue", label: "救援と復旧に全力を注ぐ", description: "民を支える・巨額の出費", effect: { happiness: 3, approval: 5, budget: -20, gdp: -4 }, explanation: "被災者を支え信頼を得ますが、莫大な費用と国力の消耗を伴います。" },
      { id: "fighton", label: "前線への補給を優先する", description: "戦力維持・民は見捨てられ感", effect: { military: 3, happiness: -6, approval: -5 }, explanation: "戦争遂行は保てますが、見捨てられたと感じる国民の心が離れます。" },
    ],
    followups: [
      { afterDays: 60, title: "焼け出された人々が各地へ避難", body: "住まいを失った大勢が地方へ逃れ、受け入れと食料が課題になっています。", category: "政治", effect: { happiness: -3, budget: -8 } },
    ],
  },
  {
    id: "h2_refugees_1943",
    since: 1939, until: 1947, category: "政治", scope: "citizen",
    title: "避難民が大量に発生する",
    body: "【速報】戦火を逃れた人々が押し寄せ、受け入れと食料・住まいの確保が追いつきません。",
    citizen: "「身一つで逃げてきた」と疲れ切った避難民。",
    effect: {},
    historicalNote: "戦争は膨大な避難民・難民を生み、受け入れと人道は戦時の国家運営の重い課題となった。",
    choices: [
      { id: "accept", label: "受け入れて支援する", description: "人道・財政と摩擦", effect: { trust: 4, happiness: 1, budget: -14, approval: -2 }, explanation: "人道の務めを果たし信用も得ますが、財政と地域の負担が増します。" },
      { id: "limit", label: "受け入れを絞る", description: "負担減・非難も", effect: { budget: -4, trust: -3, happiness: -1 }, explanation: "負担は抑えますが、冷たい対応と国際的な非難を招きます。" },
    ],
  },
  {
    id: "h2_wareariness_1944",
    since: 1942, until: 1945, category: "政治", scope: "citizen",
    title: "戦争疲れが国全体に広がる",
    body: "【速報】長引く戦争と耐乏生活に、国民の心が限界に近づいています。",
    citizen: "「早く戦争を終わらせてください」と疲れ切った声。",
    effect: {},
    historicalNote: "長期の戦争による厭戦気分は、戦意の低下や和平を求める世論、政変の引き金となった。",
    voices: [
      { characterId: "citizen", stance: "support", text: "もう限界です。終わらせる道を探ってください。" },
      { characterId: "defense", stance: "oppose", text: "ここで折れれば、これまでの犠牲が水の泡です。" },
    ],
    choices: [
      { id: "seekpeace", label: "戦争を終わらせる話し合いを探る", description: "支持回復・弱腰批判", effect: { approval: 6, happiness: 6, military: -3, trust: -2 }, explanation: "国民の心は戻りますが、敵味方に弱腰と見られる危うさもあります。" },
      { id: "endure", label: "勝利まで耐え抜くよう促す", description: "戦争継続・疲弊深まる", effect: { military: 2, happiness: -6, approval: -5 }, explanation: "戦いは続きますが、国民の疲弊と不満が限界を超えていきます。" },
    ],
  },
  {
    id: "h2_unrest_1944",
    since: 1942, until: 1946, category: "政治", scope: "crisis",
    title: "耐乏生活で治安が悪化",
    body: "【速報】物不足と不安の中、各地で混乱や犯罪が増え、社会の秩序が揺らいでいます。",
    citizen: "「生きるために、なりふり構っていられない」との声。",
    effect: {},
    historicalNote: "戦争末期の窮乏と混乱は治安を悪化させ、戦後の社会再建を一段と難しくした。",
    choices: [
      { id: "relief", label: "生活支援で不安を和らげる", description: "根本対応・財政負担", effect: { happiness: 4, approval: 3, budget: -12 }, explanation: "暮らしを支え治安の根を断ちますが、苦しい財政から捻出します。" },
      { id: "order", label: "取り締まりを強める", description: "即効・反発も", effect: { happiness: -2, approval: 1, military: 1 }, explanation: "表面の秩序は戻りますが、根本の窮乏は残ります。" },
    ],
  },

  /* ===== 外交・終戦への道 ===== */
  {
    id: "h2_alliance_1940",
    since: 1939, until: 1944, category: "外交", scope: "diplo",
    title: "陣営との同盟を結ぶか",
    body: "【速報】大国から正式な同盟の打診が届きました。後ろ盾を得るか、自由を保つか。",
    citizen: "「強い味方は心強い」「巻き込まれる」と賛否。",
    effect: {},
    historicalNote: "戦時の同盟は勝敗と戦後の立場を左右したが、結ぶ相手を誤れば国の運命を狂わせた。",
    choices: [
      { id: "join", label: "同盟を結ぶ", description: "後ろ盾↑・運命を共に", effect: { trust: 6, military: 3, budget: -6 }, explanation: "強力な後ろ盾を得ますが、その陣営と運命を共にします。" },
      { id: "independent", label: "独立を保つ", description: "自由・孤立リスク", effect: { trust: -2, military: 1 }, explanation: "身軽でいられますが、いざという時の味方を欠きます。" },
    ],
  },
  {
    id: "h2_exilegov_1942",
    since: 1940, until: 1945, category: "外交", scope: "diplo",
    title: "亡命政府への支援を求められる",
    body: "【速報】占領された国の亡命政府が、承認と支援を求めてきました。立場が問われます。",
    citizen: "「正義の側に立つべき」「敵を増やすな」と意見が分かれる。",
    effect: {},
    historicalNote: "亡命政府の承認は道義的な選択であると同時に、占領国を敵に回す外交的賭けでもあった。",
    choices: [
      { id: "support", label: "承認し支援する", description: "信用↑・敵対も", effect: { trust: 5, budget: -8, military: 1 }, explanation: "正義の側として信用を得ますが、占領国の敵意を買います。" },
      { id: "neutral", label: "態度を保留する", description: "波風回避・冷淡と見られる", effect: { trust: -2 }, explanation: "敵を増やさずに済みますが、日和見と見られます。" },
    ],
  },
  {
    id: "h2_peace_talk_1944",
    since: 1943, until: 1946, category: "外交", scope: "diplo",
    title: "戦争を終わらせる話し合いの糸口",
    body: "【速報】水面下で和平の打診が動き始めました。条件と、振り上げた拳の下ろし方が難題です。",
    citizen: "「どんな形でもいい、終わってほしい」と願う。",
    effect: {},
    historicalNote: "講和交渉（戦争を終わらせる話し合い）は、面子・賠償・戦後秩序が絡み、開戦より難しいとも言われた。",
    voices: [
      { characterId: "foreign", stance: "support", text: "好機を逃せば、犠牲がいたずらに増えるだけです。" },
      { characterId: "defense", stance: "oppose", text: "不利な条件での和平は、将来に禍根を残します。" },
    ],
    choices: [
      { id: "pursue", label: "和平交渉を進める", description: "犠牲を止める・譲歩も", effect: { trust: 4, happiness: 5, military: -2, approval: 3 }, explanation: "これ以上の犠牲を止められますが、一定の譲歩は避けられません。" },
      { id: "fighton", label: "有利になるまで戦う", description: "条件改善狙い・消耗", effect: { military: 1, happiness: -4, budget: -8 }, explanation: "より良い条件を狙いますが、その間も国力と人命が削られます。" },
    ],
  },
  {
    id: "h2_conference_1945",
    since: 1944, until: 1947, category: "外交", scope: "diplo",
    title: "戦後秩序を決める国際会議",
    body: "【速報】戦勝国が集い、戦後の世界の枠組みを話し合う会議が開かれます。あなたの国の立ち位置が問われます。",
    citizen: "「二度と戦争が起きない仕組みを」と願う声。",
    effect: {},
    historicalNote: "戦後の国際会議は新たな国際秩序と平和維持の仕組みを生んだが、新たな対立（冷戦）の芽も含んでいた。",
    choices: [
      { id: "cooperate", label: "国際協調の枠組みを推す", description: "長期安定・実利は薄い", effect: { trust: 8, approval: 2, budget: -4 }, explanation: "平和の仕組みづくりに貢献し信用を得ますが、目先の見返りは小さいです。" },
      { id: "interest", label: "自国の取り分を最大化する", description: "実利↑・遺恨も", effect: { gdp: 6, budget: 8, trust: -4 }, explanation: "領土や賠償で実利を得ますが、将来の対立の種を残します。" },
    ],
  },

  /* ===== 技術 ===== */
  {
    id: "h2_radar_1941",
    since: 1939, until: 1946, category: "技術", scope: "domestic",
    title: "電波で敵を捉える新技術（レーダー）",
    body: "【速報】遠くの敵機や艦船を電波で察知する技術が、戦況を一変させ始めています。",
    citizen: "「空襲の前に警報が鳴るようになった」と安堵。",
    effect: {},
    historicalNote: "レーダーは防空と海戦を一変させ、戦後はレンジや気象観測など民生にも広く応用された。",
    choices: [
      { id: "invest", label: "レーダー開発に投資する", description: "守りと技術↑・費用", effect: { technology: 5, military: 4, budget: -10 }, explanation: "防空力と技術力が大きく伸びますが、開発費がかかります。" },
      { id: "later", label: "既存の備えを優先する", description: "節約・技術で後れ", effect: { military: 2, technology: -1 }, explanation: "当面の出費は抑えますが、技術競争で後れを取ります。" },
    ],
  },
  {
    id: "h2_codebreak_1942",
    since: 1939, until: 1946, category: "技術", scope: "domestic",
    title: "敵の暗号を解き明かす",
    body: "【速報】数学者や技術者を集め、敵の秘密通信を解読する極秘の取り組みが進んでいます。",
    citizen: "（国民には知らされない、静かな戦い）",
    effect: {},
    historicalNote: "暗号解読は多くの命を救い戦況を左右したが、その功績は長く秘密にされた。後の計算機の礎にもなった。",
    choices: [
      { id: "fund", label: "頭脳を集めて全力で取り組む", description: "戦況優位・技術の礎", effect: { military: 4, technology: 5, budget: -8 }, explanation: "見えない戦いで優位に立ち、戦後の計算技術の芽も育てます。" },
      { id: "skip", label: "限られた資源を前線へ", description: "目先優先・好機損失", effect: { military: 2, technology: -1 }, explanation: "前線の備えを優先しますが、情報戦の好機を逃します。" },
    ],
  },
  {
    id: "h2_aircraft_1942",
    since: 1939, until: 1946, category: "技術", scope: "market",
    title: "航空機技術が飛躍する",
    body: "【速報】戦争を背景に、航空機の性能が急速に進歩。空が戦いと産業の主役になりつつあります。",
    citizen: "「空の時代が来る」と技術者は息巻く。",
    effect: {},
    historicalNote: "戦時の航空技術の飛躍は、戦後の旅客機・宇宙開発につながる土台となった。",
    choices: [
      { id: "invest", label: "航空産業を育てる", description: "技術と産業↑・費用", effect: { technology: 5, military: 3, gdp: 3, budget: -10 }, explanation: "戦後にもつながる技術と産業を育てますが、投資が必要です。" },
      { id: "ground", label: "陸の備えを優先する", description: "堅実・空で後れ", effect: { military: 3, technology: -1 }, explanation: "手堅い備えを優先しますが、空の優位を逃します。" },
    ],
  },
  {
    id: "h2_medicine_1943",
    since: 1939, until: 1948, category: "技術", scope: "domestic",
    title: "戦場が医療を進歩させる",
    body: "【速報】多くの負傷者を救う中で、輸血や新しい薬、外科の技術が急速に進歩しています。",
    citizen: "「助かる命が増えた」と医療現場も実感。",
    effect: {},
    historicalNote: "戦争の悲劇の中で進んだ輸血・抗生物質・外科の進歩は、戦後の医療と平均寿命を大きく押し上げた。",
    choices: [
      { id: "invest", label: "医療技術に投資する", description: "暮らしと技術↑・費用", effect: { technology: 4, happiness: 4, budget: -8 }, explanation: "多くの命を救い戦後の医療の礎を築きますが、費用がかかります。" },
      { id: "minimal", label: "最低限の治療にとどめる", description: "節約・進歩は遅い", effect: { happiness: -1, budget: -2 }, explanation: "出費は抑えますが、救える命と進歩を逃します。" },
    ],
  },

  /* ===== 戦争終結と戦後（1945〜） ===== */
  {
    id: "h2_warend_1945",
    since: 1945, until: 1947, category: "外交", scope: "diplo",
    title: "ついに大戦が終わる",
    body: "【号外】長く凄惨な戦争がついに終結。歓喜の声と、深い悲しみと、焼け跡だけが残されました。",
    citizen: "「生きて終戦を迎えられた」と泣き崩れる人々。",
    effect: {},
    historicalNote: "未曾有の犠牲を出した戦争の終結は、平和への希望と、巨大な復興という課題の始まりだった。",
    choices: [
      { id: "mourn", label: "慰霊と国民の心の再建を優先", description: "暮らし回復・国際関与は後回し", effect: { happiness: 6, approval: 5, budget: -8 }, explanation: "傷ついた国民の心を癒やすことを優先します。外への関与は薄くなります。" },
      { id: "rebuild", label: "ただちに経済再建へ動く", description: "復興は速い・財政負担", effect: { gdp: 7, unemployment: -0.5, budget: -14 }, explanation: "復興需要で経済を回しますが、財政の重荷が増します。" },
    ],
  },
  {
    id: "h2_postwar_unemploy_1946",
    since: 1945, until: 1950, category: "経済", scope: "domestic",
    title: "復員と軍需停止で失業者が急増",
    body: "【速報】兵士が帰り、軍需工場が止まり、大量の人が職を失っています。",
    citizen: "「戦争は終わったのに、また仕事がない」と元兵士。",
    effect: {},
    historicalNote: "戦後の軍需停止と復員は大量失業を生み、平時経済への転換が各国の課題となった。",
    choices: [
      { id: "publicworks", label: "公共事業で雇用を作る", description: "失業緩和・財政負担", effect: { unemployment: -0.8, happiness: 5, budget: -18, approval: 4 }, explanation: "復興事業で職を生み社会を安定させますが、財政赤字が膨らみます。" },
      { id: "convert", label: "民需産業への転換を促す", description: "持続的・痛みも", effect: { gdp: 5, unemployment: -0.3, happiness: -1 }, explanation: "平時の産業へ作り替えますが、転換の間は痛みが伴います。" },
    ],
  },
  {
    id: "h2_housing_1946",
    since: 1945, until: 1952, category: "政治", scope: "citizen",
    title: "焼け跡で深刻な住宅不足",
    body: "【速報】空襲で多くの家が焼け、人々は仮小屋やバラックで寒空をしのいでいます。",
    citizen: "「屋根のある暮らしがしたい」と切実な声。",
    effect: {},
    historicalNote: "戦後の住宅難は深刻で、公営住宅の大量供給と都市の再建が各国の急務となった。",
    choices: [
      { id: "build", label: "公営住宅を大量供給する", description: "暮らし改善・雇用・出費", effect: { happiness: 6, unemployment: -0.5, budget: -18 }, explanation: "住まいの不安を解消し雇用も生みますが、巨額の費用がかかります。" },
      { id: "slow", label: "復興の優先順位を絞る", description: "財政配慮・不満残る", effect: { happiness: -3, budget: -4 }, explanation: "財政には配慮できますが、住まいを待つ人々の不満が残ります。" },
    ],
  },
  {
    id: "h2_infra_1947",
    since: 1945, until: 1953, category: "経済", scope: "domestic",
    title: "壊れたインフラを再建する",
    body: "【速報】鉄道・橋・電気・水道——戦争で壊れた国の土台の立て直しが急がれています。",
    citizen: "「電車が動いた」「水道が出た」と小さな喜び。",
    effect: {},
    historicalNote: "インフラ再建は復興の土台であり、戦後の高度成長への助走となった大事業だった。",
    choices: [
      { id: "bigspend", label: "大規模に再建投資する", description: "復興加速・財政悪化", effect: { gdp: 12, unemployment: -0.6, happiness: 4, budget: -20 }, explanation: "経済と雇用が一気に回復し成長の土台を作りますが、財政赤字が膨らみます。" },
      { id: "phased", label: "財政を見ながら段階的に", description: "堅実・回復は遅い", effect: { gdp: 4, budget: -8, happiness: 1 }, explanation: "借金を抑えつつ進めますが、回復には時間がかかります。" },
    ],
  },
  {
    id: "h2_reconplan_1946",
    since: 1945, until: 1955, category: "経済", scope: "domestic",
    title: "国の未来を描く復興計画",
    body: "【速報】焼け跡からどんな国を作るのか——長期の復興計画づくりが始まりました。",
    citizen: "「次こそ平和で豊かな国を」と人々が前を向く。",
    effect: {},
    historicalNote: "復興計画は単なる再建にとどまらず、福祉・教育・産業の近代化を進め、その後の繁栄の礎となった。",
    voices: [
      { characterId: "business", stance: "support", text: "今こそ未来の産業に大胆に投資すべきです。" },
      { characterId: "finance", stance: "neutral", text: "理想は分かりますが、財源の裏づけが要ります。" },
      { characterId: "citizen", stance: "support", text: "二度と戦争をしない、豊かな国にしてほしい。" },
    ],
    choices: [
      { id: "ambitious", label: "教育と産業に大胆投資する", description: "長期の繁栄・当面の負担", effect: { technology: 5, gdp: 8, happiness: 4, budget: -18 }, explanation: "将来の繁栄の土台を築きますが、当面は大きな財政負担を背負います。" },
      { id: "steady", label: "堅実に少しずつ立て直す", description: "無理なく・成長は緩やか", effect: { gdp: 4, budget: -6, happiness: 2 }, explanation: "身の丈に合った復興で安定しますが、飛躍は望みにくいです。" },
    ],
    followups: [
      { afterDays: 180, title: "復興が軌道に乗り、暮らしが上向く", body: "計画が実を結び始め、街に活気と笑顔が戻ってきました。", category: "経済", effect: { gdp: 8, happiness: 5, approval: 3 } },
    ],
  },
];
