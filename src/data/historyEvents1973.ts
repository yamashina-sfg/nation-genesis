import type { GameEvent } from "../types/game";

/**
 * 1973〜1991年「石油危機・スタグフレーション・金融自由化・バブル・冷戦終結」の歴史イベント。
 * 既存の GameEvent / EventChoice / followups / voices を使う。
 * やさしい言い換え：スタグフレーション=「不況なのに物価が上がる状態」、
 * 金融自由化=「お金の流れを自由にする政策」、バブル経済=「実力以上に価格が上がり続ける状態」、
 * 冷戦終結=「長く続いた東西対立の終わり」。実在の政治家・政党は出さない。
 *
 * バブルは「加速させるか抑制するか」を選ばせ、加速を選ぶと数年後に崩壊（株価暴落・失業・
 * 銀行危機）が followups で起こる設計。
 */
export const historyEvents1973: GameEvent[] = [
  /* ===== 石油危機（1973〜1982） ===== */
  {
    id: "h4_oil1_1973",
    since: 1973, until: 1980, category: "経済", scope: "crisis",
    title: "原油価格が突然の急騰（第一次石油危機）",
    body: "【緊急速報】原油価格が急騰！ガソリンや電気代が跳ね上がり、企業も家計も大混乱です。高度成長は終わりを迎えました。",
    citizen: "「電気代が高すぎます」「トイレットペーパーまで品切れ」と混乱。",
    effect: {},
    historicalNote: "1973年の石油危機は高度経済成長を終わらせ、省エネと産業構造の転換を世界に迫った。",
    voices: [
      { characterId: "business", stance: "support", text: "省エネ技術に投資すれば、危機を競争力に変えられます。" },
      { characterId: "finance", stance: "oppose", text: "補助金は青天井です。財政が破綻しかねません。" },
      { characterId: "citizen", stance: "support", text: "生活が苦しいです。せめて当面の負担を和らげてください。" },
    ],
    choices: [
      { id: "saveenergy", label: "省エネ・代替エネに投資する", description: "長期的に安定・短期は出費", effect: { technology: 5, environment: 3, budget: -14, gdp: -3 }, explanation: "将来のエネルギー自立に近づきますが、当面の予算を圧迫します。" },
      { id: "subsidy", label: "補助金で価格を抑える", description: "国民不満減・財政悪化", effect: { happiness: 4, approval: 4, budget: -18, inflation: -0.4 }, explanation: "生活を守れますが、財政が大きく悪化します。" },
      { id: "market", label: "市場に任せる", description: "予算温存・支持率低下", effect: { budget: 4, happiness: -6, approval: -6, inflation: 0.8 }, explanation: "財政は守れますが、物価高で国民の不満が噴出します。" },
    ],
    followups: [
      { afterDays: 90, title: "省エネ技術が芽を出し始める", body: "危機をバネに、燃費の良い製品や省エネ技術の開発が進んでいます。", category: "技術", effect: { technology: 4, gdp: 3 } },
    ],
  },
  {
    id: "h4_fuel_1974",
    since: 1973, until: 1982, category: "経済", scope: "crisis",
    title: "ガソリン・エネルギー不足が続く",
    body: "【速報】燃料の供給が細り、工場の操業短縮や休日のガソリン販売停止まで起きています。",
    citizen: "「日曜は車に乗るなと言われた」と戸惑う声。",
    effect: {},
    historicalNote: "エネルギー不足は省エネ運動を社会に根づかせ、エネルギー安全保障を国家戦略の中心に据えた。",
    choices: [
      { id: "diversify", label: "エネルギー源を分散・備蓄する", description: "安定確保・出費", effect: { technology: 3, trust: 2, budget: -12 }, explanation: "石油への依存を減らし供給を安定させますが、費用がかかります。" },
      { id: "endure", label: "節約を呼びかけ耐える", description: "節約・生産は落ちる", effect: { happiness: -3, gdp: -3, environment: 2 }, explanation: "出費は抑えますが、節約で生産と暮らしが細ります。" },
    ],
  },
  {
    id: "h4_oil2_1979",
    since: 1979, until: 1985, category: "経済", scope: "crisis",
    title: "再びの原油急騰（第二次石油危機）",
    body: "【緊急速報】中東情勢の悪化で原油が再び急騰。物価高と景気の冷え込みが同時に襲っています。",
    citizen: "「また値上げか」と疲れた表情の市民。",
    effect: {},
    historicalNote: "二度の石油危機は省エネ・脱石油の流れを決定づけ、産業構造を重厚長大から軽薄短小へと変えた。",
    choices: [
      { id: "transform", label: "省エネ型の産業へ転換する", description: "将来の強み・痛みを伴う", effect: { technology: 5, gdp: -3, environment: 3, budget: -10 }, explanation: "エネルギーを食わない産業へ作り替え、将来の競争力を得ます。当面は痛みます。" },
      { id: "protect", label: "既存産業を補助金で守る", description: "雇用維持・財政と非効率", effect: { unemployment: -0.3, budget: -14, gdp: 1 }, explanation: "雇用は守られますが、財政負担と非効率を抱えます。" },
    ],
  },
  {
    id: "h4_saveenergy_1976",
    since: 1974, until: 1988, category: "技術", scope: "domestic",
    title: "省エネ政策を国策で進める",
    body: "【速報】「資源のない国は知恵で勝つ」。省エネ技術と効率化に国を挙げて取り組みます。",
    citizen: "「燃費の良い車が増えた」と実感する声。",
    effect: {},
    historicalNote: "省エネ技術の追求は、皮肉にも石油危機を技術的優位へ転じる転機となった。",
    choices: [
      { id: "invest", label: "省エネ技術に大きく投資", description: "技術↑・将来の輸出力", effect: { technology: 6, gdp: 4, environment: 4, budget: -10 }, explanation: "省エネ技術が世界で武器になり、環境にも良いですが投資が要ります。" },
      { id: "regulate", label: "規制で省エネを義務化する", description: "確実・企業負担", effect: { environment: 4, technology: 2, gdp: -2 }, explanation: "確実に省エネが進みますが、企業には負担となります。" },
    ],
  },

  /* ===== スタグフレーション・不況（1974〜1985） ===== */
  {
    id: "h4_stagflation_1975",
    since: 1974, until: 1984, category: "経済", scope: "crisis",
    title: "不況なのに物価が上がる",
    body: "【速報】景気は冷えているのに物価だけ上がる——「不況なのに物価が上がる状態」に経済が苦しんでいます。",
    citizen: "「給料は増えないのに物価だけ上がっています」と悲鳴。",
    effect: {},
    historicalNote: "スタグフレーション（不況なのに物価が上がる状態）は従来の経済政策では対処が難しく、各国を悩ませた。",
    voices: [
      { characterId: "finance", stance: "support", text: "まず物価を抑えるべきです。お金を引き締めましょう。" },
      { characterId: "business", stance: "oppose", text: "引き締めれば不況が深まります。景気が先です。" },
      { characterId: "citizen", stance: "neutral", text: "とにかく生活が苦しいんです。何とかしてください。" },
    ],
    choices: [
      { id: "tighten", label: "物価抑制を優先（引き締め）", description: "物価安定・不況深化", effect: { inflation: -1.0, gdp: -5, unemployment: 0.5 }, explanation: "物価上昇は収まりますが、景気と雇用が冷え込みます。" },
      { id: "stimulate", label: "景気刺激を優先（緩和）", description: "景気↑・物価高続く", effect: { gdp: 5, inflation: 0.8, unemployment: -0.4 }, explanation: "景気は持ち直しますが、物価高が長引きます。" },
    ],
  },
  {
    id: "h4_unemploy_1977",
    since: 1975, until: 1986, category: "経済", scope: "domestic",
    title: "失業率が上昇する",
    body: "【速報】不況で職を失う人が増え、特に若者の就職難が社会問題になっています。",
    citizen: "「働きたくても仕事がない」と若者。",
    effect: {},
    historicalNote: "低成長時代の失業は構造的なものとなり、雇用対策が政治の重要課題となった。",
    choices: [
      { id: "jobs", label: "雇用対策・職業訓練を行う", description: "失業緩和・財政負担", effect: { unemployment: -0.6, happiness: 4, budget: -12 }, explanation: "失業を和らげますが、財政の負担が増します。" },
      { id: "growth", label: "成長で雇用を生むのを待つ", description: "出費なし・改善は遅い", effect: { unemployment: 0.3, happiness: -3 }, explanation: "支出は抑えますが、失業の改善は遅れます。" },
    ],
  },
  {
    id: "h4_deficit_1980",
    since: 1976, until: 1991, category: "経済", scope: "domestic",
    title: "財政赤字が膨らみ続ける",
    body: "【速報】不況対策や社会保障で支出が増え、国の借金が雪だるま式に膨らんでいます。",
    citizen: "「将来世代にツケを回すのか」と懸念の声。",
    effect: {},
    historicalNote: "低成長下で膨らむ財政赤字は、増税か歳出削減かという痛みを伴う選択を各国に迫った。",
    voices: [
      { characterId: "finance", stance: "support", text: "歳出を削り、財政を立て直すべきです。" },
      { characterId: "citizen", stance: "oppose", text: "暮らしの予算を削らないでください。" },
    ],
    choices: [
      { id: "austerity", label: "歳出を削減する", description: "財政改善・サービス低下", effect: { budget: 14, happiness: -4, gdp: -3 }, explanation: "借金は減らせますが、行政サービスが削られ不満が出ます。" },
      { id: "grow", label: "成長で税収を取り戻す賭けに出る", description: "景気重視・赤字続く", effect: { gdp: 4, budget: -8 }, explanation: "成長で税収増を狙いますが、当面の赤字は膨らみます。" },
    ],
  },
  {
    id: "h4_taxreform_1984",
    since: 1980, until: 1991, category: "経済", scope: "domestic",
    title: "税制の抜本改革を行うか",
    body: "【速報】財政難を背景に、所得税中心から広く薄く集める方式への改革が議論されています。",
    citizen: "「これ以上の負担増は困る」と家計。",
    effect: {},
    historicalNote: "戦後の税制を見直す改革は、財政再建と公平性をめぐり各国で激しい議論を呼んだ。",
    choices: [
      { id: "consumption", label: "広く薄く集める新税を導入", description: "安定財源・反発大", effect: { budget: 16, approval: -8, happiness: -4 }, explanation: "安定した財源を確保できますが、新税への反発は大きいです。" },
      { id: "keep", label: "現行制度を維持する", description: "波風回避・赤字続く", effect: { approval: 2, budget: -6 }, explanation: "反発は避けられますが、財政の穴は埋まりません。" },
    ],
  },
  {
    id: "h4_restructure_1982",
    since: 1978, until: 1991, category: "市場", scope: "market",
    title: "企業の再編・合理化が進む",
    body: "【速報】生き残りをかけて企業が合併やリストラを進め、効率化と痛みが同時に広がっています。",
    citizen: "「会社が合併で、配置転換になった」と社員。",
    effect: {},
    historicalNote: "低成長時代の企業再編は競争力を高めたが、雇用の流動化と不安をもたらした。",
    choices: [
      { id: "support", label: "再編を後押しし競争力強化", description: "効率↑・雇用に痛み", effect: { gdp: 6, technology: 2, unemployment: 0.4, happiness: -2 }, explanation: "企業は強くなりますが、雇用に痛みが生じます。" },
      { id: "protect", label: "雇用を守る方向で調整", description: "安定・効率は落ちる", effect: { unemployment: -0.3, happiness: 3, gdp: -2 }, explanation: "雇用は守られますが、効率化は進みにくくなります。" },
    ],
  },

  /* ===== 技術革新（1976〜1991） ===== */
  {
    id: "h4_pc_1982",
    since: 1980, until: 1991, category: "技術", scope: "domestic",
    title: "パソコン革命が始まる",
    body: "【速報】机に置けるコンピュータが普及し始め、仕事も暮らしも変わろうとしています。",
    citizen: "「これからはコンピュータの時代らしい」と興味津々。",
    effect: {},
    historicalNote: "パソコンの登場は情報革命の幕開けとなり、後のIT社会・ネット時代の礎となった。",
    voices: [
      { characterId: "business", stance: "support", text: "次の時代の基盤です。乗り遅れは許されません。" },
      { characterId: "citizen", stance: "neutral", text: "便利そうですが、使いこなせるか不安です。" },
    ],
    choices: [
      { id: "invest", label: "情報産業を国策で育てる", description: "未来の基盤・先行投資", effect: { technology: 7, gdp: 5, budget: -10 }, explanation: "次の時代の主役産業を育てますが、先行投資が必要です。" },
      { id: "wait", label: "民間の普及を見守る", description: "節約・立ち遅れ", effect: { technology: 2 }, explanation: "出費は抑えますが、情報革命で後れを取る恐れがあります。" },
    ],
    followups: [
      { afterDays: 120, title: "コンピュータが職場と暮らしに浸透", body: "事務や設計、家庭にまでコンピュータが入り込み、生産性が上がっています。", category: "技術", effect: { technology: 4, gdp: 4 } },
    ],
  },
  {
    id: "h4_semicon_1980",
    since: 1976, until: 1991, category: "市場", scope: "market",
    title: "半導体産業が急成長",
    body: "【速報】「産業のコメ」と呼ばれる半導体で世界をリードし始め、輸出をけん引しています。",
    citizen: "「我が国の半導体が世界一」と誇らしげ。",
    effect: {},
    historicalNote: "半導体は情報化社会の基盤として戦略物資となり、やがて国家間の競争・摩擦の焦点となった。",
    choices: [
      { id: "lead", label: "半導体を国家戦略にする", description: "輸出力↑・通商摩擦", effect: { gdp: 9, technology: 5, trust: -3, budget: -8 }, explanation: "輸出と技術力が大きく伸びますが、相手国との貿易摩擦を招きます。" },
      { id: "balance", label: "他産業とのバランスを保つ", description: "安定・突出はしない", effect: { gdp: 4, technology: 3 }, explanation: "特定産業に偏らず安定を保ちますが、突出した強みは生まれません。" },
    ],
  },
  {
    id: "h4_robot_1983",
    since: 1978, until: 1991, category: "技術", scope: "domestic",
    title: "工場の自動化・ロボット導入が進む",
    body: "【速報】産業用ロボットが工場に導入され、生産性が上がる一方で「仕事が機械に奪われる」不安も。",
    citizen: "「効率は上がるが、自分の仕事は大丈夫か」と労働者。",
    effect: {},
    historicalNote: "工場の自動化は品質と生産性を飛躍させたが、雇用のあり方に新たな問いを投げかけた。",
    choices: [
      { id: "automate", label: "自動化を強力に推進", description: "生産性↑・雇用不安", effect: { gdp: 8, technology: 4, unemployment: 0.4, happiness: -2 }, explanation: "国際競争力は高まりますが、雇用への不安が広がります。" },
      { id: "reskill", label: "自動化＋労働者の再教育", description: "両立・費用", effect: { gdp: 5, technology: 3, unemployment: -0.2, budget: -8 }, explanation: "効率化と雇用の両立を図りますが、再教育に費用がかかります。" },
    ],
  },
  {
    id: "h4_telecom_1985",
    since: 1980, until: 1991, category: "技術", scope: "domestic",
    title: "通信技術が大きく発展",
    body: "【速報】電話網のデジタル化や新しい通信サービスが広がり、情報のやり取りが速く便利になっています。",
    citizen: "「遠くの家族とも気軽に話せる」と喜ぶ声。",
    effect: {},
    historicalNote: "通信の高度化は経済活動を効率化し、後のインターネット社会への土台を築いた。",
    choices: [
      { id: "modernize", label: "通信インフラを近代化する", description: "効率と暮らし↑・出費", effect: { technology: 5, gdp: 4, happiness: 2, budget: -10 }, explanation: "経済と暮らしが便利になりますが、整備に費用がかかります。" },
      { id: "private", label: "通信事業を自由化・民営化する", description: "競争で発展・格差も", effect: { gdp: 5, technology: 3, trust: 1 }, explanation: "競争でサービスが発展しますが、地域や所得による格差も生まれます。" },
    ],
  },

  /* ===== 金融自由化・バブル（1980〜1991） ===== */
  {
    id: "h4_liberalize_1984",
    since: 1980, until: 1991, category: "市場", scope: "market",
    title: "お金の流れを自由にする政策",
    body: "【速報】金利や金融取引の規制を緩める「お金の流れを自由にする政策」が進み、投資が活発になっています。",
    citizen: "「銀行や株が身近になった」と関心が高まる。",
    effect: {},
    historicalNote: "金融自由化（お金の流れを自由にする政策）は経済を活性化させたが、過剰な投機とバブルの土壌にもなった。",
    voices: [
      { characterId: "business", stance: "support", text: "規制緩和で経済が活気づきます。世界の流れです。" },
      { characterId: "finance", stance: "oppose", text: "緩めすぎれば、投機の暴走を招きます。慎重に。" },
    ],
    choices: [
      { id: "deregulate", label: "大胆に自由化する", description: "経済活性・バブルの芽", effect: { gdp: 7, trust: 2, inflation: 0.4 }, explanation: "投資が活発になり経済が伸びますが、投機が過熱する危うさも生まれます。" },
      { id: "careful", label: "慎重に段階的に進める", description: "安定・成長は穏やか", effect: { gdp: 3, trust: 3 }, explanation: "暴走を避けつつ進めますが、活性化は緩やかです。" },
    ],
  },
  {
    id: "h4_realestate_1987",
    since: 1985, until: 1991, category: "市場", scope: "market",
    title: "不動産投資ブームが過熱",
    body: "【速報】土地の値段が上がり続け、「土地は必ず値上がりする」と投資マネーが殺到しています。",
    citizen: "「住宅が高くて買えません」と庶民は嘆く。",
    effect: {},
    historicalNote: "実力以上に価格が上がり続ける『バブル経済』では、土地神話が人々を熱狂させた。",
    choices: [
      { id: "accelerate", label: "開発を後押しし熱狂に乗る", description: "今は潤う・崩壊リスク", effect: { gdp: 8, happiness: 3, inflation: 0.6 }, explanation: "今は経済が沸きますが、いずれの暴落の反動を大きくします。" },
      { id: "cool", label: "投機を冷ます規制をかける", description: "暴走を防ぐ・人気は落ちる", effect: { gdp: -3, happiness: 3, inflation: -0.4, trust: 2 }, explanation: "庶民の住宅難を和らげ将来の崩壊を防ぎますが、目先の景気と人気は落ちます。" },
    ],
    followups: [
      { afterDays: 120, title: "地価がさらに高騰、庶民の手が届かない", body: "土地への投機がやまず、若い世代はマイホームを諦め始めています。", category: "市場", effect: { happiness: -4, approval: -2 } },
    ],
  },
  {
    id: "h4_stockboom_1988",
    since: 1985, until: 1991, category: "市場", scope: "market",
    title: "株式投資ブームに国民が熱狂",
    body: "【速報】株価が最高値を更新し続け、主婦や若者まで株に手を出す熱狂ぶりです。",
    citizen: "「株でひと儲け」と誰もが浮かれている。",
    effect: {},
    historicalNote: "資産価格の高騰は人々を熱狂させたが、実体経済とのかい離はやがて大きな崩壊を招いた。",
    choices: [
      { id: "ride", label: "好景気を最大限に活用する", description: "資産効果↑・崩壊リスク", effect: { gdp: 8, happiness: 4, approval: 3 }, explanation: "資産効果で消費も伸びますが、崩壊したときの反動が大きくなります。" },
      { id: "warn", label: "過熱に警鐘を鳴らし抑える", description: "軟着陸狙い・水を差す", effect: { gdp: -2, trust: 2, happiness: -1 }, explanation: "崩壊を和らげようとしますが、好景気に水を差すと嫌われます。" },
    ],
  },
  {
    id: "h4_banklending_1988",
    since: 1985, until: 1991, category: "市場", scope: "market",
    title: "銀行が融資を拡大しすぎる",
    body: "【速報】銀行が土地を担保に競って貸し込み、お金がじゃぶじゃぶと市場にあふれています。",
    citizen: "「いくらでも借りられる」と浮かれる経営者。",
    effect: {},
    historicalNote: "緩い融資の拡大はバブルを膨らませ、後に巨額の不良債権となって金融危機を招いた。",
    voices: [
      { characterId: "business", stance: "support", text: "資金が回れば経済は伸びます。今は攻めるときです。" },
      { characterId: "finance", stance: "oppose", text: "土地担保の貸し込みは危険です。崩れれば不良債権の山です。" },
    ],
    choices: [
      { id: "loose", label: "融資の勢いに任せる", description: "景気↑・不良債権の種", effect: { gdp: 7, happiness: 2, inflation: 0.5 }, explanation: "経済は沸きますが、崩壊時の不良債権という時限爆弾を抱えます。" },
      { id: "guideline", label: "融資に歯止めをかける", description: "健全化・景気は冷える", effect: { gdp: -4, trust: 3, inflation: -0.4 }, explanation: "金融を健全に保ち将来の危機を防ぎますが、景気を冷やします。" },
    ],
  },
  {
    id: "h4_bubble_1989",
    since: 1986, until: 1991, category: "市場", scope: "market",
    title: "バブル経済の絶頂——加速か、抑制か",
    body: "【速報】株も土地も「実力以上に上がり続ける」異常な好景気。この熱狂をどうするか、歴史的な判断が問われます。",
    citizen: "「永遠に好景気が続く」と誰もが信じている。",
    effect: {},
    historicalNote: "バブル経済（実力以上に価格が上がり続ける状態）は、絶頂のときこそ崩壊の入り口でもあった。",
    voices: [
      { characterId: "business", stance: "support", text: "この勢いを止める理由はありません。成長を続けましょう。" },
      { characterId: "finance", stance: "oppose", text: "実体とかけ離れています。今こそ軟着陸させるべきです。" },
      { characterId: "citizen", stance: "neutral", text: "土地も株も高すぎて、普通の暮らしには手が届きません。" },
    ],
    choices: [
      { id: "accelerate", label: "バブルを加速させる", description: "今は絶好調・数年後に崩壊の危険", effect: { gdp: 10, happiness: 5, approval: 4, inflation: 0.7 }, explanation: "今は経済が絶好調ですが、過熱を放置すれば数年後に大崩壊を招きます。" },
      { id: "softland", label: "バブルを抑え軟着陸を図る", description: "崩壊を防ぐ・痛みは今", effect: { gdp: -5, happiness: -3, approval: -4, trust: 4, inflation: -0.5 }, explanation: "将来の大崩壊を防ぎますが、今の痛みと人気の低下は避けられません。" },
    ],
    followups: [
      { afterDays: 90, title: "【号外】バブルが崩壊、株価が暴落", body: "実力とかけ離れて膨らんだ株と土地の価格が一気にしぼみ、資産が消えました。", category: "市場", effect: { gdp: -10, happiness: -5, approval: -4 } },
      { afterDays: 150, title: "不良債権と失業が経済を蝕む", body: "貸したお金が返らず銀行が苦しみ、企業の倒産と失業が広がっています。", category: "経済", effect: { gdp: -6, unemployment: 0.8, budget: -10 } },
    ],
  },
  {
    id: "h4_burst_sign_1990",
    since: 1990, until: 1994, category: "市場", scope: "crisis",
    title: "バブル崩壊の足音",
    body: "【緊急速報】上がり続けた株価が崩れ始め、「もう上がらないのでは」と不安が広がっています。",
    citizen: "「あの熱狂は何だったのか」と投資家。",
    effect: {},
    historicalNote: "バブルの崩壊は長い不況（失われた時代）の入り口となり、金融システムの立て直しを迫った。",
    choices: [
      { id: "stabilize", label: "金融システムを守り軟着陸させる", description: "連鎖を防ぐ・巨額の出費", effect: { gdp: 3, trust: 3, budget: -18, happiness: 1 }, explanation: "金融危機の連鎖を防ぎますが、巨額の公的支援が必要です。" },
      { id: "letfall", label: "市場の調整に任せる", description: "出費なし・危機拡大", effect: { gdp: -8, unemployment: 0.8, happiness: -5, approval: -5 }, explanation: "財政は守れますが、倒産と失業の連鎖が経済を深く傷つけます。" },
    ],
  },

  /* ===== 社会（少子高齢化・住宅・教育） ===== */
  {
    id: "h4_birthrate_1986",
    since: 1980, until: 1991, category: "政治", scope: "domestic",
    title: "少子化の兆しが見え始める",
    body: "【速報】生まれる子どもの数が減り始め、「このままでは将来の働き手が足りない」と懸念されています。",
    citizen: "「子育てにお金がかかりすぎる」と若い夫婦。",
    effect: {},
    historicalNote: "少子化の始まりは、数十年後の労働力不足と社会保障の危機を予感させる静かな変化だった。",
    choices: [
      { id: "support", label: "子育て支援を始める", description: "将来への布石・出費", effect: { happiness: 4, approval: 3, budget: -12 }, explanation: "将来の人口減に手を打ちますが、効果が出るのは何十年も先です。" },
      { id: "later", label: "今は経済を優先する", description: "節約・問題は先送り", effect: { gdp: 2, happiness: -1 }, explanation: "目先の経済を優先しますが、少子化の波は静かに進みます。" },
    ],
  },
  {
    id: "h4_aging_1988",
    since: 1980, until: 1991, category: "政治", scope: "domestic",
    title: "高齢化の始まりに備える",
    body: "【速報】お年寄りの割合が増え始め、医療や年金の将来負担への備えが課題になっています。",
    citizen: "「老後を安心して暮らせる国に」と願う声。",
    effect: {},
    historicalNote: "高齢化の進行は、年金・医療・介護という社会保障の持続性を長期の課題として浮かび上がらせた。",
    choices: [
      { id: "prepare", label: "社会保障を持続可能に改革", description: "将来の安定・今の痛み", effect: { trust: 3, budget: 6, happiness: -2 }, explanation: "将来世代の負担を和らげますが、今の給付見直しに反発も出ます。" },
      { id: "expand", label: "高齢者福祉を手厚くする", description: "安心↑・将来の負担", effect: { happiness: 5, approval: 4, budget: -12 }, explanation: "お年寄りの安心は高まりますが、将来の財政負担が重くなります。" },
    ],
  },
  {
    id: "h4_housing_1989",
    since: 1986, until: 1992, category: "政治", scope: "citizen",
    title: "住宅価格の高騰で家が買えない",
    body: "【速報】バブルで土地と住宅が高騰し、普通に働く人がマイホームを持てなくなっています。",
    citizen: "「一生かけても家が買えない」と若い世代。",
    effect: {},
    historicalNote: "資産バブルは持つ者と持たざる者の格差を広げ、住宅問題を深刻な社会不満にした。",
    choices: [
      { id: "publichousing", label: "公的住宅と規制で対応", description: "暮らし改善・市場に介入", effect: { happiness: 5, approval: 4, gdp: -3, budget: -12 }, explanation: "庶民の住まいを守りますが、市場への介入と費用を伴います。" },
      { id: "market", label: "市場に任せる", description: "出費なし・格差拡大", effect: { gdp: 2, happiness: -5, approval: -4 }, explanation: "費用は抑えますが、住宅格差と不満が広がります。" },
    ],
  },
  {
    id: "h4_education_cost_1985",
    since: 1980, until: 1991, category: "政治", scope: "citizen",
    title: "教育費の上昇が家計を圧迫",
    body: "【速報】進学競争の激化で塾や学費の負担が増え、家計を圧迫しています。",
    citizen: "「子どもの教育費で精一杯です」と親。",
    effect: {},
    historicalNote: "教育費の高騰は家計を圧迫し、教育機会の格差という新たな問題を生んだ。",
    choices: [
      { id: "support", label: "奨学金や公教育を充実", description: "機会均等・出費", effect: { happiness: 4, technology: 2, budget: -10 }, explanation: "教育の機会を広げ将来の人材も育てますが、費用がかかります。" },
      { id: "market", label: "民間の教育に任せる", description: "節約・格差拡大", effect: { technology: 1, happiness: -2 }, explanation: "費用は抑えますが、教育格差が広がります。" },
    ],
  },

  /* ===== 冷戦終盤（1979〜1989） ===== */
  {
    id: "h4_coldwar_tension_1980",
    since: 1979, until: 1986, category: "外交", scope: "diplo",
    title: "冷戦の緊張が再び高まる",
    body: "【速報】大国が大規模な軍事演習を行い、東西の緊張が再燃しています。軍拡の圧力が強まります。",
    citizen: "「また核の影におびえるのか」と不安。",
    effect: {},
    historicalNote: "1980年代前半、冷戦は『新冷戦』と呼ばれる緊張期を迎え、軍拡競争が再び激化した。",
    voices: [
      { characterId: "defense", stance: "support", text: "相手が軍拡するなら、こちらも備えを固めるべきです。" },
      { characterId: "finance", stance: "oppose", text: "軍拡は財政を蝕みます。際限がありません。" },
    ],
    choices: [
      { id: "rearm", label: "軍備を増強する", description: "抑止力↑・財政と緊張", effect: { military: 7, trust: -3, budget: -14 }, explanation: "抑止力は高まりますが、財政負担と緊張の悪循環を招きます。" },
      { id: "dialogue", label: "対話と緊張緩和を探る", description: "信用↑・弱腰批判も", effect: { trust: 5, military: -1, approval: -2 }, explanation: "緊張を下げ平和の担い手となりますが、弱腰と見られる面もあります。" },
    ],
  },
  {
    id: "h4_armscontrol_1987",
    since: 1985, until: 1991, category: "外交", scope: "diplo",
    title: "歴史的な核軍縮交渉",
    body: "【速報】対立してきた大国どうしが、核兵器を減らす交渉のテーブルに着きました。世界に和解の機運が高まります。",
    citizen: "「核が減るなら、世界は良くなる」と期待。",
    effect: {},
    historicalNote: "1980年代後半の軍縮交渉は冷戦の雪解けを象徴し、核戦争の恐怖を和らげた。",
    choices: [
      { id: "support", label: "軍縮を積極的に後押しする", description: "信用と平和↑・守りは薄く", effect: { trust: 7, happiness: 4, military: -3, budget: 6 }, explanation: "平和の担い手として信用を得て予算も浮きますが、守りは手薄になります。" },
      { id: "cautious", label: "備えを残しつつ歓迎する", description: "現実的なバランス", effect: { trust: 3, military: 1 }, explanation: "和解を歓迎しつつも、万一への備えは残します。" },
    ],
  },
  {
    id: "h4_regional_1983",
    since: 1975, until: 1990, category: "外交", scope: "diplo",
    title: "代理戦争・地域紛争への対応",
    body: "【速報】遠い地域の紛争に大国が関与し、あなたの国にも立場の表明や関与が求められています。",
    citizen: "「他国の戦争に関わるべきではない」との声も。",
    effect: {},
    historicalNote: "冷戦下の地域紛争はしばしば大国の代理戦争となり、多くの国を難しい立場に置いた。",
    choices: [
      { id: "engage", label: "陣営に協力し関与する", description: "同盟強化・敵も作る", effect: { trust: 3, military: 2, budget: -8, happiness: -2 }, explanation: "同盟内の立場は強まりますが、敵対勢力と費用を抱えます。" },
      { id: "neutral", label: "関与を避け中立を保つ", description: "巻き込まれ回避・冷淡と見られる", effect: { trust: 1, happiness: 1 }, explanation: "巻き込まれを避けますが、日和見と見られることもあります。" },
    ],
  },
  {
    id: "h4_burden_1986",
    since: 1980, until: 1991, category: "外交", scope: "diplo",
    title: "同盟内の負担分担を求められる",
    body: "【速報】同盟国から「もっと防衛費や貢献を」と負担の増加を強く求められています。",
    citizen: "「同盟は大事だが、負担ばかりは…」と複雑。",
    effect: {},
    historicalNote: "冷戦終盤、同盟内の負担分担（バードンシェアリング）は外交の重要な争点となった。",
    choices: [
      { id: "contribute", label: "要求に応えて負担を増やす", description: "関係維持・国内に不満", effect: { trust: 5, military: 2, budget: -10, approval: -2 }, explanation: "同盟関係は強まりますが、国内では負担増への不満が出ます。" },
      { id: "negotiate", label: "粘り強く負担を抑える交渉", description: "国益確保・摩擦", effect: { budget: 4, trust: -2, approval: 2 }, explanation: "国の負担は抑えますが、同盟国との摩擦が生じます。" },
    ],
  },
  {
    id: "h4_spy_1984",
    since: 1975, until: 1990, category: "外交", scope: "crisis",
    title: "大規模なスパイ事件が発覚",
    body: "【速報】先端技術や機密が盗まれていたことが発覚し、外交問題に発展しかねない事態です。",
    citizen: "「技術が盗まれていたとは」と衝撃。",
    effect: {},
    historicalNote: "冷戦下の諜報戦は最先端技術や機密をめぐって激化し、しばしば国際関係を揺るがした。",
    choices: [
      { id: "firm", label: "毅然と対応し防諜を固める", description: "威信↑・関係冷却", effect: { trust: 2, military: 2, technology: 1, budget: -6 }, explanation: "国の威信と技術を守りますが、相手国との関係は冷えます。" },
      { id: "quiet", label: "穏便に処理する", description: "関係維持・弱腰批判", effect: { trust: -1, approval: -2 }, explanation: "関係悪化は避けますが、国内では手ぬるいと批判されます。" },
    ],
  },

  /* ===== 歴史的大事件：冷戦終結（1989〜1992） ===== */
  {
    id: "h4_berlinwall_1989",
    since: 1989, until: 1991, category: "外交", scope: "diplo",
    title: "ベルリンの壁が崩壊する",
    body: "【号外】東西を分けてきた壁が市民の手で打ち壊されました！冷戦の終わりが現実味を帯び、世界が歓喜に沸いています。",
    citizen: "「歴史が動いた」とテレビに釘付けの人々。",
    effect: {},
    historicalNote: "ベルリンの壁崩壊は東西対立の終わりを象徴し、東欧の民主化と冷戦終結への扉を開いた。",
    choices: [
      { id: "embrace", label: "新しい時代を積極的に迎える", description: "信用と機会↑・支援の費用", effect: { trust: 7, happiness: 5, gdp: 3, budget: -8 }, explanation: "平和と自由の流れを後押しし新たな市場と信用を得ますが、支援に費用がかかります。" },
      { id: "cautious", label: "混乱を警戒し慎重に見守る", description: "リスク回避・好機も逃す", effect: { trust: 2, military: 1 }, explanation: "急変の混乱を避けますが、新時代の主導権を握る機会を逃します。" },
    ],
  },
  {
    id: "h4_eastdemoc_1990",
    since: 1989, until: 1993, category: "外交", scope: "diplo",
    title: "東欧諸国が次々と民主化",
    body: "【速報】東側の国々で市民が立ち上がり、相次いで体制が変わっています。新しい国々が世界に加わろうとしています。",
    citizen: "「自由を求める人々を応援したい」との声。",
    effect: {},
    historicalNote: "東欧の民主化は冷戦秩序を一変させ、新たな国際関係と市場経済への移行をもたらした。",
    choices: [
      { id: "support", label: "民主化と市場移行を支援する", description: "信用と将来市場↑・出費", effect: { trust: 6, gdp: 3, budget: -10 }, explanation: "新興の民主国家を支え将来の市場と信用を得ますが、当面の支出が増えます。" },
      { id: "trade", label: "新市場との通商に注力する", description: "実利↑・関与は限定", effect: { gdp: 6, trust: 2 }, explanation: "新しい市場で実利を狙いますが、政治的関与は控えめにします。" },
    ],
  },
  {
    id: "h4_sovietcollapse_1991",
    since: 1991, until: 1994, category: "外交", scope: "crisis",
    title: "ソ連が崩壊する",
    body: "【号外】超大国が解体し、いくつもの新しい国が生まれました。世界を二分してきた構図が、ついに終わりを迎えます。",
    citizen: "「あの大国が消えるなんて」と誰もが驚く。",
    effect: {},
    historicalNote: "ソ連の崩壊は冷戦を完全に終わらせ、唯一の超大国を残す『新しい世界秩序』の幕を開けた。",
    voices: [
      { characterId: "foreign", stance: "support", text: "新しい国々と関係を築く、またとない好機です。" },
      { characterId: "defense", stance: "neutral", text: "力の空白は新たな混乱も生みます。油断は禁物です。" },
    ],
    choices: [
      { id: "engage", label: "新興国を支援し関係を築く", description: "信用と影響力↑・出費とリスク", effect: { trust: 7, gdp: 2, budget: -10 }, explanation: "新しい国々との関係を先んじて築きますが、不安定さと費用も抱えます。" },
      { id: "stabilize", label: "自国と地域の安定を最優先", description: "堅実・好機は限定", effect: { military: 2, trust: 2, happiness: 2 }, explanation: "混乱に備えて足元を固めますが、新時代の主導権では一歩引きます。" },
    ],
  },
  {
    id: "h4_coldwar_end_1990",
    since: 1989, until: 1993, category: "外交", scope: "positive",
    title: "長く続いた東西対立の終わり",
    body: "【速報】数十年に及んだ冷戦が終わりを迎え、軍事から平和への「配当」をどう使うかが問われています。",
    citizen: "「もう核戦争におびえなくていい」と安堵が広がる。",
    effect: {},
    historicalNote: "冷戦終結（長く続いた東西対立の終わり）は『平和の配当』を生み、軍事費を福祉や経済に回す好機をもたらした。",
    voices: [
      { characterId: "citizen", stance: "support", text: "浮いた軍事費を、暮らしや教育に回してください。" },
      { characterId: "defense", stance: "oppose", text: "世界はまだ不安定です。守りを緩めるのは早計です。" },
      { characterId: "finance", stance: "neutral", text: "平和の配当は、財政再建にも使えます。" },
    ],
    choices: [
      { id: "dividend", label: "軍事費を削り暮らしに回す", description: "暮らしと財政↑・守りは薄く", effect: { military: -4, happiness: 6, budget: 12, approval: 4 }, explanation: "平和の配当で暮らしと財政が潤いますが、守りは手薄になります。" },
      { id: "prudent", label: "備えを残しつつ少し回す", description: "バランス・効果は中程度", effect: { military: -1, happiness: 3, budget: 5 }, explanation: "平和を享受しつつ、万一への備えも残す堅実な道です。" },
    ],
  },
  {
    id: "h4_wagedemand_1976",
    since: 1974, until: 1985, category: "経済", scope: "citizen",
    title: "物価高に賃上げ要求が噴出",
    body: "【速報】物価ばかり上がる中、労働組合が大幅な賃上げを求めて一斉に動いています。",
    citizen: "「給料が物価に追いつきません」と労働者。",
    effect: {},
    historicalNote: "物価高と賃上げの追いかけっこは、物価上昇をさらに加速させる悪循環を生みやすかった。",
    choices: [
      { id: "raise", label: "賃上げを後押しする", description: "暮らし↑・物価も↑", effect: { happiness: 5, approval: 3, inflation: 0.7, gdp: 2 }, explanation: "暮らしは楽になりますが、物価上昇に拍車がかかります。" },
      { id: "restrain", label: "物価安定のため抑制を促す", description: "物価安定・不満残る", effect: { inflation: -0.4, happiness: -4, gdp: 1 }, explanation: "物価の悪循環は抑えますが、労働者の不満が残ります。" },
    ],
  },
  {
    id: "h4_zaitech_1987",
    since: 1985, until: 1991, category: "市場", scope: "market",
    title: "企業まで投機に走る「財テク」ブーム",
    body: "【速報】本業そっちのけで企業が株や土地で稼ぐ「財テク」に夢中になっています。健全と言えるのか。",
    citizen: "「まじめに働くのがばからしい」との声まで。",
    effect: {},
    historicalNote: "本業を離れた投機（財テク）の横行はバブルの過熱を示し、後の崩壊の深刻さを物語った。",
    choices: [
      { id: "allow", label: "活発な投資を容認する", description: "短期の利益・モラル低下", effect: { gdp: 6, inflation: 0.5, happiness: 1 }, explanation: "短期的には潤いますが、勤労意欲とモラルが揺らぎます。" },
      { id: "discourage", label: "本業重視へ誘導する", description: "健全化・成長は鈍る", effect: { gdp: -2, technology: 2, trust: 2 }, explanation: "実体経済を健全に保ちますが、目先の成長は鈍ります。" },
    ],
  },
  {
    id: "h4_urbancrowd_1980",
    since: 1975, until: 1991, category: "政治", scope: "domestic",
    title: "大都市への一極集中が進む",
    body: "【速報】仕事を求めて大都市に人が集まり続け、過密と地方の衰退が同時に進んでいます。",
    citizen: "「都会は息苦しい、でも仕事は都会にしかない」とジレンマ。",
    effect: {},
    historicalNote: "大都市への一極集中は経済効率を高める一方、過密・地価高騰・地方の過疎という歪みを残した。",
    choices: [
      { id: "balance", label: "地方分散・地域振興を進める", description: "均衡↑・費用と時間", effect: { happiness: 4, environment: 2, budget: -12, gdp: 2 }, explanation: "地方を元気にし過密を和らげますが、費用と時間がかかります。" },
      { id: "concentrate", label: "大都市の効率を生かす", description: "効率↑・地方は衰退", effect: { gdp: 6, happiness: -3, environment: -2 }, explanation: "経済効率は高まりますが、過密と地方の衰退が進みます。" },
    ],
  },
  {
    id: "h4_nuke_1982",
    since: 1979, until: 1988, category: "外交", scope: "crisis",
    title: "核ミサイル配備をめぐる緊張",
    body: "【緊急速報】新型核ミサイルの配備計画で東西の緊張が極度に高まり、各地で反核運動が起きています。",
    citizen: "「核はいらない」と大規模な反核デモ。",
    effect: {},
    historicalNote: "新型核兵器の配備計画は『新冷戦』の緊張を象徴し、同時に世界的な反核・平和運動を呼び起こした。",
    voices: [
      { characterId: "defense", stance: "support", text: "抑止のバランス上、配備はやむを得ません。" },
      { characterId: "citizen", stance: "oppose", text: "核には絶対反対です。平和の声を上げてください。" },
    ],
    choices: [
      { id: "accept", label: "抑止力として受け入れる", description: "守り↑・反核世論と緊張", effect: { military: 4, trust: 2, happiness: -4, approval: -3 }, explanation: "抑止のバランスは保てますが、反核世論と緊張の高まりを招きます。" },
      { id: "oppose", label: "配備に反対し軍縮を求める", description: "支持と平和↑・同盟に摩擦", effect: { approval: 5, happiness: 4, trust: -2, military: -1 }, explanation: "国内の支持と平和の評価を得ますが、同盟国との摩擦が生じます。" },
    ],
  },
];
