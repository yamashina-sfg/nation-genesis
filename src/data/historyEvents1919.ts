import type { GameEvent } from "../types/game";

/**
 * 1919〜1939年「戦間期・世界恐慌・社会不安」の歴史イベント（選択型）。
 * 既存の GameEvent / EventChoice / followups / voices を使う。
 * 難しい用語はやさしく：世界恐慌=「世界中でお金が回らなくなった大不況」、
 * デフレ=「物価が下がり続ける状態」、保護貿易=「外国製品を入りにくくする政策」。
 * 実在の政治家・政党は出さない。
 */
export const historyEvents1919: GameEvent[] = [
  /* ===== 戦後復興（1919〜1925） ===== */
  {
    id: "h_postwar_demob_1919",
    since: 1919, until: 1926, category: "政治", scope: "domestic",
    title: "戦地から兵士が大量に帰ってくる",
    body: "【速報】復員した兵士たちが職を求めて街にあふれています。仕事と居場所の確保が急務です。",
    citizen: "「戦争は終わったが、働き口がない」と元兵士。",
    effect: {},
    historicalNote: "戦後の大量復員は深刻な失業を生み、社会不安や政治の不安定化の一因となった。",
    voices: [
      { characterId: "citizen", stance: "support", text: "国のために戦った人たちです。仕事を用意すべきです。" },
      { characterId: "finance", stance: "oppose", text: "雇用対策にはお金がかかります。財源が心配です。" },
    ],
    choices: [
      { id: "jobs", label: "公共事業で雇用を作る", description: "失業緩和・財政負担", effect: { unemployment: -0.7, happiness: 4, budget: -16, approval: 4 }, explanation: "元兵士に仕事を用意し社会を安定させますが、財政の負担になります。" },
      { id: "market", label: "民間の回復に任せる", description: "出費なし・不満残る", effect: { unemployment: 0.5, happiness: -4, approval: -4 }, explanation: "支出は避けられますが、失業と不満が長引きます。" },
    ],
  },
  {
    id: "h_postwar_inflation_1920",
    since: 1919, until: 1925, category: "経済", scope: "market",
    title: "戦後の急な物価上昇",
    body: "【速報】戦時の借金と物不足で物価が跳ね上がり、家計が悲鳴を上げています。",
    citizen: "「お金の価値がどんどん下がる」と主婦。",
    effect: {},
    historicalNote: "戦後の激しいインフレは貯蓄を目減りさせ、中間層の没落と社会不安をもたらした。",
    choices: [
      { id: "tighten", label: "お金を借りにくくして物価を抑える", description: "物価安定・景気は冷える", effect: { inflation: -1.0, gdp: -4, happiness: 2 }, explanation: "物価上昇は収まりますが、景気が冷え込みます。" },
      { id: "support", label: "賃金や手当を上げて生活を守る", description: "暮らし支援・物価高続く", effect: { happiness: 4, budget: -10, inflation: 0.4 }, explanation: "生活は支えられますが、さらなる物価高を呼ぶ恐れがあります。" },
    ],
  },
  {
    id: "h_postwar_housing_1921",
    since: 1919, until: 1928, category: "政治", scope: "citizen",
    title: "深刻な住宅不足",
    body: "【速報】復興と都市流入で住む場所が足りず、家賃が高騰しています。",
    citizen: "「家賃が払えず一家で間借り暮らし」との声。",
    effect: {},
    historicalNote: "戦後の住宅難は各国で公営住宅政策や都市計画を本格化させるきっかけになった。",
    choices: [
      { id: "build", label: "公営住宅を大量に建てる", description: "暮らし改善・出費", effect: { happiness: 6, unemployment: -0.4, budget: -16 }, explanation: "住まいの不安が和らぎ建設の雇用も生まれますが、費用は重いです。" },
      { id: "private", label: "民間任せにする", description: "節約・格差拡大", effect: { happiness: -3, gdp: 2 }, explanation: "出費は抑えられますが、住宅格差が広がります。" },
    ],
  },
  {
    id: "h_league_hope_1920",
    since: 1919, until: 1933, category: "外交", scope: "diplo",
    title: "国際協調の枠組みに期待",
    body: "【速報】「二度と大戦を起こさない」ための国際的な話し合いの場に、各国が集い始めました。",
    citizen: "「もう戦争はこりごり」と平和を願う声。",
    effect: {},
    historicalNote: "戦後つくられた国際協調の仕組みは平和を目指したが、強制力に乏しく後に機能不全に陥った。",
    choices: [
      { id: "lead", label: "積極的に参加し主導する", description: "信用上昇・労力", effect: { trust: 7, approval: 3, budget: -6 }, explanation: "平和の担い手として信用を得ますが、関与には手間がかかります。" },
      { id: "cautious", label: "様子を見て距離を置く", description: "自由だが孤立も", effect: { trust: -2, military: 1 }, explanation: "縛られずに済みますが、国際的な発言力は弱まります。" },
    ],
  },

  /* ===== 1920年代の好景気（1922〜1929） ===== */
  {
    id: "h_consumer_boom_1925",
    since: 1922, until: 1930, category: "経済", scope: "market",
    title: "消費ブームに沸く街",
    body: "【速報】好景気で人々の財布がゆるみ、新しい商品が飛ぶように売れています。",
    citizen: "「今が買い時だ」と街は活気づく。",
    effect: {},
    historicalNote: "1920年代の好景気は大量生産・大量消費の時代を開いたが、過熱が後の暴落の伏線にもなった。",
    choices: [
      { id: "ride", label: "消費をさらに後押しする", description: "景気↑・過熱リスク", effect: { gdp: 8, happiness: 4, inflation: 0.5 }, explanation: "経済は活気づきますが、バブル的な過熱の芽も育ちます。" },
      { id: "prudent", label: "堅実な成長を促す", description: "安定だが地味", effect: { gdp: 4, budget: 3 }, explanation: "派手さはありませんが、足腰の強い成長を目指します。" },
    ],
  },
  {
    id: "h_automobile_1926",
    since: 1922, until: 1935, category: "技術", scope: "domestic",
    title: "自動車が一気に普及",
    body: "【速報】手の届く価格の自動車が広まり、人々の移動と暮らしが大きく変わっています。",
    citizen: "「うちにも車が来た」と家族は大喜び。",
    effect: {},
    historicalNote: "自動車の大衆化は道路・石油・関連産業を生み、20世紀の社会構造を一変させた。",
    choices: [
      { id: "roads", label: "道路網の整備を進める", description: "経済↑・出費", effect: { gdp: 7, technology: 3, budget: -12, environment: -2 }, explanation: "産業と物流が伸びますが、整備費と環境負荷が伴います。" },
      { id: "slow", label: "当面は静観する", description: "節約・好機損失", effect: { gdp: 2 }, explanation: "費用は抑えますが、成長の波に乗り遅れます。" },
    ],
  },
  {
    id: "h_radio_1924",
    since: 1922, until: 1938, category: "技術", scope: "domestic",
    title: "ラジオ放送が各家庭に",
    body: "【速報】茶の間にラジオが届き、ニュースや娯楽が一瞬で全国に広がる時代になりました。",
    citizen: "「世界の出来事が居間で聞ける」と驚きの声。",
    effect: {},
    historicalNote: "ラジオは世論形成の力を持ち、報道や政治宣伝に大きな影響を与えるメディアとなった。",
    choices: [
      { id: "public", label: "公共放送を整え情報を届ける", description: "結束↑・運用費", effect: { approval: 4, happiness: 3, budget: -6 }, explanation: "正確な情報が広まり国民が結束しますが、運用に費用がかかります。" },
      { id: "free", label: "民間に任せる", description: "多様だが質はまちまち", effect: { happiness: 2, technology: 2 }, explanation: "多彩な放送が生まれますが、内容の質は保証されません。" },
    ],
  },
  {
    id: "h_stockboom_1928",
    since: 1925, until: 1930, category: "市場", scope: "market",
    title: "株式投資ブームが過熱",
    body: "【速報】「株を買えば儲かる」と庶民まで投資に殺到。株価が実態以上に膨らんでいます。",
    citizen: "「みんな買っているから安心だ」と熱狂。",
    effect: {},
    historicalNote: "過度な投機と借金による株式ブームは、やがて歴史的な暴落（世界恐慌）の引き金となった。",
    voices: [
      { characterId: "business", stance: "support", text: "投資が経済を回しています。水を差すべきではありません。" },
      { characterId: "finance", stance: "oppose", text: "実態とかけ離れた高値です。いずれ大きく崩れます。" },
    ],
    choices: [
      { id: "warn", label: "過熱を冷ます規制をかける", description: "暴落予防・反発", effect: { gdp: -3, happiness: -2, trust: 2 }, explanation: "将来の大暴落を和らげますが、目先の景気と人気を損ないます。" },
      { id: "letgo", label: "好景気を楽しむ", description: "今は潤う・後で危険", effect: { gdp: 6, happiness: 3 }, explanation: "当面は潤いますが、崩れたときの反動が大きくなります。",
        },
    ],
    followups: [
      { afterDays: 60, title: "膨らんだ相場に不安の影", body: "値上がりを続けた相場に、そろそろ危ういという声が出始めました。", category: "市場", effect: { gdp: -4, happiness: -2 } },
    ],
  },

  /* ===== 世界恐慌（1929〜1934） ===== */
  {
    id: "h_crash_1929",
    since: 1929, until: 1933, category: "市場", scope: "crisis",
    title: "株価が大暴落",
    body: "【号外】株価暴落！主要企業の株が急落し、市民の間に不安が広がっています。銀行にも長蛇の列ができています。",
    citizen: "「財産が一夜で消えた」と投資家が呆然。",
    effect: {},
    historicalNote: "1929年の株価大暴落は『世界中でお金が回らなくなった大不況（世界恐慌）』の始まりとなった。",
    voices: [
      { characterId: "finance", stance: "support", text: "まず銀行を守り、混乱の連鎖を止めるべきです。" },
      { characterId: "business", stance: "neutral", text: "企業への資金が止まれば、倒産が一気に広がります。" },
    ],
    choices: [
      { id: "rescue", label: "銀行・企業を緊急支援する", description: "連鎖倒産を防ぐ・巨額の出費", effect: { gdp: 4, budget: -20, trust: 2, happiness: 2 }, explanation: "金融の崩壊を食い止めますが、莫大な財政出動が必要です。" },
      { id: "letfall", label: "市場の調整に任せる", description: "出費なし・大不況へ", effect: { gdp: -10, unemployment: 1.2, happiness: -6, approval: -6 }, explanation: "財政は守れますが、倒産と失業が雪崩のように広がります。" },
    ],
    followups: [
      { afterDays: 90, title: "不況が長引き失業者があふれる", body: "お金が回らず、仕事を失う人が街にあふれています。", category: "経済", effect: { unemployment: 1.0, happiness: -5, budget: -8 } },
    ],
  },
  {
    id: "h_bankrun_1930",
    since: 1929, until: 1934, category: "市場", scope: "crisis",
    title: "銀行が次々と破綻",
    body: "【緊急速報】預金を引き出そうとする人が殺到し、体力のない銀行から倒れています。",
    citizen: "「貯金は戻ってくるのか」と窓口で動揺。",
    effect: {},
    historicalNote: "取り付け騒ぎと銀行破綻の連鎖は信用を崩壊させ、不況をいっそう深刻にした。",
    choices: [
      { id: "guarantee", label: "預金を国が保証する", description: "信用回復・財政負担", effect: { trust: 4, happiness: 4, budget: -16 }, explanation: "人々の不安を鎮めますが、国が大きな保証を背負います。" },
      { id: "select", label: "健全な銀行だけ支える", description: "現実的だが痛みも", effect: { gdp: -3, trust: 1, budget: -8 }, explanation: "資源を絞って支えますが、見捨てられる銀行と預金者が出ます。" },
    ],
  },
  {
    id: "h_unemploy_1931",
    since: 1930, until: 1936, category: "経済", scope: "crisis",
    title: "失業者が急増する",
    body: "【号外】仕事を失う人が後を絶たず、街には職を求める長い列ができています。政府の対応が問われています。",
    citizen: "「仕事が見つかりません」「政府は何をしているんですか」と怒りの声。",
    effect: {},
    historicalNote: "大量失業は社会の絶望感を広げ、過激な思想や強い指導者を求める動きを各国で生んだ。",
    voices: [
      { characterId: "business", stance: "support", text: "今こそ大胆な公共投資で雇用を作るべきです。" },
      { characterId: "finance", stance: "oppose", text: "財政はもう限界です。これ以上の借金は危険です。" },
      { characterId: "citizen", stance: "support", text: "仕事をください。家族を養えないんです。" },
    ],
    choices: [
      { id: "publicworks", label: "公共事業で雇用を作る", description: "雇用改善・財政悪化", effect: { unemployment: -1.0, happiness: 5, approval: 5, budget: -22 }, explanation: "失業者に仕事を与え社会を支えますが、財政赤字が膨らみます。" },
      { id: "tax", label: "増税で財政を立て直す", description: "財政改善・支持低下", effect: { budget: 14, approval: -7, happiness: -5 }, explanation: "国の財布は守られますが、苦境の国民への増税は猛反発を招きます。" },
      { id: "market", label: "市場の回復を待つ", description: "財政負担なし・失業悪化", effect: { unemployment: 0.8, happiness: -6, approval: -6 }, explanation: "支出は避けられますが、失業と不満がさらに深刻化します。" },
    ],
  },
  {
    id: "h_taxrevenue_1932",
    since: 1930, until: 1936, category: "経済", scope: "domestic",
    title: "不況で税収が激減",
    body: "【速報】企業も家計も苦しく、国に入るお金が大きく減って、財政運営が行き詰まっています。",
    citizen: "「サービスが削られないか心配」と住民。",
    effect: {},
    historicalNote: "不況下の税収減は、緊縮か積極財政かという難しい選択を各国政府に突きつけた。",
    choices: [
      { id: "cut", label: "支出を切り詰める", description: "財政維持・不況深化", effect: { budget: 10, gdp: -5, happiness: -4 }, explanation: "帳尻は合わせられますが、緊縮がさらに景気を冷やします。" },
      { id: "borrow", label: "借金してでも経済を支える", description: "景気下支え・将来負担", effect: { gdp: 5, budget: -14, unemployment: -0.4 }, explanation: "景気を支えますが、将来に借金のツケを残します。" },
    ],
  },
  {
    id: "h_deflation_1932",
    since: 1930, until: 1936, category: "市場", scope: "market",
    title: "物価が下がり続ける",
    body: "【速報】売れないから値下げ、値下げするから給料も減る——「物価が下がり続ける状態」の悪循環です。",
    citizen: "「安くなっても買うお金がない」とため息。",
    effect: {},
    historicalNote: "デフレ（物価が下がり続ける状態）は借金の重みを増し、消費と投資を冷やして不況を長引かせた。",
    choices: [
      { id: "reflate", label: "お金を借りやすくして流れを作る", description: "悪循環を断つ・物価上昇も", effect: { inflation: 0.6, gdp: 6, unemployment: -0.4 }, explanation: "お金の流れを取り戻し景気を温めますが、物価高への転換に注意が要ります。" },
      { id: "wait", label: "自然な底打ちを待つ", description: "出費なし・低迷長引く", effect: { gdp: -4, happiness: -3 }, explanation: "財政は守れますが、低迷が長く続きます。" },
    ],
  },

  /* ===== 社会不安（1930年代） ===== */
  {
    id: "h_unrest_1932",
    since: 1930, until: 1939, category: "政治", scope: "citizen",
    title: "大規模デモと労働争議が頻発",
    body: "【速報】生活苦への怒りから、各地で大規模なデモやストライキが相次いでいます。",
    citizen: "「もう我慢の限界だ」と労働者が声を上げる。",
    effect: {},
    historicalNote: "経済危機による社会不安は、労働運動の激化と政治の急進化を各国で招いた。",
    voices: [
      { characterId: "citizen", stance: "support", text: "声に耳を傾け、生活を立て直してください。" },
      { characterId: "defense", stance: "oppose", text: "秩序の崩壊は防がねばなりません。毅然と対応を。" },
    ],
    choices: [
      { id: "dialogue", label: "対話と生活支援で応える", description: "沈静化・財政負担", effect: { happiness: 5, approval: 4, budget: -12 }, explanation: "不満を和らげ社会を落ち着かせますが、支援には費用がかかります。" },
      { id: "order", label: "治安維持を優先する", description: "秩序回復・反発残る", effect: { approval: -5, happiness: -4, military: 1 }, explanation: "表面の秩序は戻りますが、対立の火種が深く残ります。" },
    ],
  },
  {
    id: "h_crime_1933",
    since: 1930, until: 1939, category: "政治", scope: "crisis",
    title: "治安の悪化が深刻に",
    body: "【速報】困窮を背景に犯罪が増え、街の安全への不安が高まっています。",
    citizen: "「夜道が怖くて出歩けない」と住民。",
    effect: {},
    historicalNote: "長期不況は犯罪や社会の荒廃を招き、強い統制を求める世論を生む土壌となった。",
    choices: [
      { id: "welfarefirst", label: "貧困対策で根本から", description: "効果は遅いが本質的", effect: { happiness: 4, approval: 3, budget: -12 }, explanation: "困窮を減らし治安を根本改善しますが、効果が出るには時間がかかります。" },
      { id: "police", label: "取り締まりを強化する", description: "即効性・費用と反発", effect: { happiness: 1, approval: 2, budget: -8 }, explanation: "すぐに安全感は戻りますが、根本解決にはなりません。" },
    ],
  },
  {
    id: "h_extremism_1934",
    since: 1931, until: 1939, category: "政治", scope: "citizen",
    title: "過激な政治思想が勢いを増す",
    body: "【速報】混乱と不満を追い風に、「強い指導者が全てを解決する」と訴える過激な主張が支持を広げています。",
    citizen: "「もう誰でもいい、何とかしてほしい」と疲れた声も。",
    effect: {},
    historicalNote: "経済危機と社会不安は、民主主義への失望と独裁・全体主義の台頭を各国で招いた。中立的に学ぶべき教訓である。",
    voices: [
      { characterId: "chief", stance: "support", text: "今こそ民主的な手続きと自由を守り抜くべきです。" },
      { characterId: "defense", stance: "neutral", text: "強い指導を求める声も無視はできません。難しい局面です。" },
    ],
    choices: [
      { id: "democracy", label: "民主主義と自由を守る", description: "正道だが時間かかる", effect: { trust: 5, approval: -2, happiness: 1 }, explanation: "法と自由を守る姿勢は長期の安定につながりますが、即効性に欠けます。" },
      { id: "strongman", label: "強権で混乱を抑え込む", description: "短期安定・自由の犠牲", effect: { approval: 5, happiness: -3, trust: -6, military: 2 }, explanation: "目先の混乱は収まりますが、自由が失われ国際的な信用も傷つきます。" },
    ],
  },

  /* ===== 国際問題（保護貿易・通貨・軍縮） ===== */
  {
    id: "h_protectionism_1931",
    since: 1929, until: 1939, category: "外交", scope: "world",
    title: "各国が貿易の壁を高くする",
    body: "【速報】不況で各国が「外国製品を入りにくくする政策」に走り、世界の貿易が縮んでいます。",
    citizen: "「輸出が止まって工場が苦しい」と経営者。",
    effect: {},
    historicalNote: "保護貿易（外国製品を入りにくくする政策）の応酬は世界貿易を縮小させ、不況を世界中に広げた。",
    voices: [
      { characterId: "business", stance: "support", text: "国内産業を守るため、我が国も壁を作るべきです。" },
      { characterId: "foreign", stance: "oppose", text: "報復の連鎖になります。協調の道を残すべきです。" },
    ],
    choices: [
      { id: "tariff", label: "関税を上げて国内を守る", description: "国内産業保護・貿易縮小", effect: { gdp: 2, trust: -5, happiness: 2 }, explanation: "国内の雇用は一時守られますが、貿易が縮み外交関係も冷えます。" },
      { id: "open", label: "自由貿易の維持を呼びかける", description: "信用↑・国内に痛み", effect: { trust: 6, gdp: -3, approval: -2 }, explanation: "国際協調の担い手となりますが、国内産業は競争にさらされます。" },
    ],
  },
  {
    id: "h_currency_1933",
    since: 1929, until: 1938, category: "市場", scope: "market",
    title: "通貨の価値が揺れる",
    body: "【速報】各国が自国通貨を切り下げ合い、為替が大きく乱れています。輸出と輸入のどちらを取るか難しい局面です。",
    citizen: "「輸入品が高い」「いや輸出が伸びる」と評価が割れる。",
    effect: {},
    historicalNote: "通貨切り下げ競争は短期的な輸出増を狙ったが、国際金融の混乱と不信を深めた。",
    choices: [
      { id: "devalue", label: "通貨を切り下げ輸出を狙う", description: "輸出↑・物価と信用に難", effect: { gdp: 6, inflation: 0.6, trust: -3 }, explanation: "輸出企業には追い風ですが、物価高と国際的な不信を招きます。" },
      { id: "stable", label: "通貨の安定を守る", description: "信用↑・輸出は不利", effect: { trust: 4, gdp: -3, inflation: -0.3 }, explanation: "通貨の信用は保てますが、輸出競争では不利になります。" },
    ],
  },
  {
    id: "h_league_fail_1935",
    since: 1931, until: 1939, category: "外交", scope: "diplo",
    title: "国際協調の仕組みが機能しない",
    body: "【速報】ある国の侵略行為に対し、国際的な話し合いの場は有効な手を打てず、無力さが露呈しました。",
    citizen: "「話し合いだけでは止められないのか」と落胆。",
    effect: {},
    historicalNote: "強制力を欠いた国際協調の仕組みは侵略を止められず、各国の不信と再軍備を加速させた。",
    choices: [
      { id: "reform", label: "枠組みの強化を働きかける", description: "理想を追う・実りは不確実", effect: { trust: 4, budget: -4 }, explanation: "国際平和の仕組みを立て直そうとしますが、各国の足並みは揃いません。" },
      { id: "selfhelp", label: "自国の防衛を固める", description: "現実的・緊張も高まる", effect: { military: 5, trust: -2, budget: -10 }, explanation: "自衛を優先しますが、各国の軍拡競争に加わることになります。" },
    ],
  },
  {
    id: "h_disarm_1932",
    since: 1925, until: 1936, category: "外交", scope: "diplo",
    title: "軍縮会議が開かれる",
    body: "【速報】「軍備を減らして戦争を防ごう」という国際会議が開かれ、各国の本音が問われています。",
    citizen: "「軍縮で平和になるなら賛成」と多くの声。",
    effect: {},
    historicalNote: "戦間期の軍縮会議は一定の成果を上げたが、各国の不信から十分には進まなかった。",
    choices: [
      { id: "disarm", label: "率先して軍備を減らす", description: "信用↑・守りは薄く", effect: { military: -4, trust: 6, budget: 8, happiness: 3 }, explanation: "平和外交の担い手として信用を得て予算も浮きますが、守りは手薄になります。" },
      { id: "keep", label: "備えを残して様子を見る", description: "安全重視・冷ややかな目", effect: { military: 1, trust: -2 }, explanation: "万一に備えますが、軍縮に後ろ向きと見られます。" },
    ],
  },
  {
    id: "h_border_1936",
    since: 1933, until: 1939, category: "外交", scope: "diplo",
    title: "隣国との国境で緊張が高まる",
    body: "【緊急速報】国境付近で軍が増強され、にらみ合いが続いています。政府は難しい判断を迫られています。",
    citizen: "「また戦争になるのでは」と不安が広がる。",
    effect: {},
    historicalNote: "1930年代後半、各地で国境をめぐる緊張が高まり、世界は再び大戦へと近づいていった。",
    voices: [
      { characterId: "defense", stance: "support", text: "なめられれば押し込まれます。備えを固めるべきです。" },
      { characterId: "foreign", stance: "oppose", text: "まだ交渉の余地があります。衝突は避けるべきです。" },
    ],
    choices: [
      { id: "fortify", label: "国境の防衛を固める", description: "守り↑・緊張も↑", effect: { military: 6, trust: -3, budget: -12 }, explanation: "抑止力は高まりますが、相手を刺激し緊張がさらに高まります。" },
      { id: "negotiate", label: "外交交渉で緊張を下げる", description: "衝突回避・足元を見られる恐れ", effect: { trust: 4, military: -1, approval: -2 }, explanation: "衝突を避けますが、弱腰と見られ譲歩を迫られる危険もあります。" },
    ],
  },

  /* ===== 軍事・再軍備（1930年代後半） ===== */
  {
    id: "h_rearm_1935",
    since: 1933, until: 1939, category: "外交", scope: "domestic",
    title: "再軍備を求める声が強まる",
    body: "【速報】周辺国の軍拡を受け、「我が国も軍を立て直すべきだ」という声が高まっています。",
    citizen: "「身を守るためなら仕方ない」「暮らしが先だ」と割れる。",
    effect: {},
    historicalNote: "世界的な緊張の高まりは各国の再軍備を促し、軍拡競争と次の大戦への流れを作った。",
    voices: [
      { characterId: "defense", stance: "support", text: "軍備増強が必要です。後れれば取り返しがつきません。" },
      { characterId: "finance", stance: "oppose", text: "不況からの回復が先です。予算が限界です。" },
      { characterId: "citizen", stance: "neutral", text: "軍需で仕事が増えるなら…でも戦争は嫌です。" },
    ],
    choices: [
      { id: "rearm", label: "本格的に再軍備する", description: "守り↑・雇用↑・財政と緊張", effect: { military: 9, unemployment: -0.4, budget: -16, trust: -4 }, explanation: "守りと雇用は強まりますが、財政負担と周辺国の警戒を招きます。" },
      { id: "minimal", label: "最小限の防衛にとどめる", description: "節約・力不足", effect: { military: 3, budget: -5 }, explanation: "出費を抑えますが、いざという時の備えは心もとないです。" },
      { id: "diplomacy", label: "外交での安全確保を優先", description: "戦争回避狙い・失敗の危険", effect: { trust: 5, military: -1, approval: -1 }, explanation: "外交で安全を築こうとしますが、相手次第では危うさも残ります。" },
    ],
  },
  {
    id: "h_defensebudget_1937",
    since: 1934, until: 1940, category: "経済", scope: "domestic",
    title: "膨らむ防衛費に予算が悲鳴",
    body: "【速報】軍備拡張で国の財布が苦しく、暮らしの予算との取り合いになっています。",
    citizen: "「軍より学校や病院にお金を」との声も根強い。",
    effect: {},
    historicalNote: "再軍備の負担は財政を圧迫し、軍事と国民生活のどちらを取るかという難題を各国に突きつけた。",
    voices: [
      { characterId: "defense", stance: "support", text: "守りに妥協はできません。今は安全保障が最優先です。" },
      { characterId: "citizen", stance: "oppose", text: "暮らしを削ってまでの軍拡は受け入れられません。" },
    ],
    choices: [
      { id: "military", label: "防衛を優先する", description: "守り↑・暮らし犠牲", effect: { military: 6, happiness: -4, approval: -3, budget: -10 }, explanation: "安全保障は固まりますが、国民生活が圧迫され不満が募ります。" },
      { id: "balance", label: "暮らしとの両立を図る", description: "穏当・守りは控えめ", effect: { military: 2, happiness: 2, budget: -6 }, explanation: "生活に配慮しますが、軍備の強化は緩やかになります。" },
    ],
  },
  {
    id: "h_weapondev_1936",
    since: 1933, until: 1942, category: "技術", scope: "market",
    title: "新兵器・航空機の開発競争",
    body: "【速報】各国が最新の戦車や航空機の開発を競い、技術と軍需産業が一気に伸びています。",
    citizen: "「軍需で工場はフル稼働」と工員。",
    effect: {},
    historicalNote: "軍拡は皮肉にも航空・無線・機械工学などの技術革新を加速させ、戦後の産業にもつながった。",
    choices: [
      { id: "invest", label: "兵器開発に投資する", description: "技術と軍需↑・物価も", effect: { technology: 5, military: 4, gdp: 4, inflation: 0.4 }, explanation: "技術と軍需産業が伸びますが、軍事偏重と物価高の影も生まれます。" },
      { id: "civilian", label: "民生技術を優先する", description: "暮らし向上・軍は遅れる", effect: { technology: 4, happiness: 3, military: -1 }, explanation: "暮らしを豊かにする技術を育てますが、軍備では後れを取ります。" },
    ],
  },
  {
    id: "h_movies_1927",
    since: 1922, until: 1938, category: "技術", scope: "domestic",
    title: "映画産業が花開く",
    body: "【速報】映画館に人々が押し寄せ、銀幕のスターが時代の憧れになっています。",
    citizen: "「週末は家族で映画館へ」と娯楽が広がる。",
    effect: {},
    historicalNote: "映画は大衆娯楽として根づき、文化・広告・世論に大きな影響を持つ産業に成長した。",
    choices: [
      { id: "support", label: "文化産業として後押し", description: "暮らし・産業↑", effect: { gdp: 4, happiness: 4, technology: 1, budget: -4 }, explanation: "娯楽と産業が育ち国民の活気が増しますが、支援に少し費用がかかります。" },
      { id: "free", label: "民間に任せる", description: "自然に発展", effect: { happiness: 2, gdp: 2 }, explanation: "市場の力で自然に広がっていきます。" },
    ],
  },
  {
    id: "h_bankruptcy_1931",
    since: 1929, until: 1935, category: "経済", scope: "crisis",
    title: "企業の倒産が相次ぐ",
    body: "【号外】注文が消え、名の知れた会社まで次々と店をたたんでいます。下請けや商店も連鎖で苦境に。",
    citizen: "「取引先が倒れて、うちも危ない」と中小の経営者。",
    effect: {},
    historicalNote: "倒産の連鎖は雇用と地域経済を直撃し、不況の底をいっそう深くした。",
    choices: [
      { id: "support", label: "中小企業を支援する", description: "連鎖倒産を防ぐ・出費", effect: { gdp: 4, unemployment: -0.4, budget: -14 }, explanation: "倒産の連鎖を食い止めますが、財政の負担が増します。" },
      { id: "restructure", label: "淘汰を受け入れ立て直す", description: "痛みを伴う再編", effect: { gdp: -4, unemployment: 0.5, happiness: -3 }, explanation: "弱った企業は退場し、長期的には筋肉質になりますが当面は痛みます。" },
    ],
  },
  {
    id: "h_urbanize_1926",
    since: 1922, until: 1935, category: "政治", scope: "domestic",
    title: "都市化がさらに加速",
    body: "【速報】産業の中心地に人口が集まり、街は大きくなる一方、過密や格差も広がっています。",
    citizen: "「便利だけど、家賃も生活費も高い」と都市住民。",
    effect: {},
    historicalNote: "都市化の加速は経済の中心を移し、インフラ整備と社会政策の必要性を一段と高めた。",
    choices: [
      { id: "plan", label: "都市計画を整える", description: "暮らし改善・出費", effect: { happiness: 4, gdp: 4, budget: -12, environment: 2 }, explanation: "計画的な街づくりで暮らしと経済を底上げしますが、費用がかかります。" },
      { id: "laissez", label: "成り行きに任せる", description: "出費なし・過密進む", effect: { gdp: 3, happiness: -3, environment: -2 }, explanation: "費用は抑えますが、過密と環境悪化が進みます。" },
    ],
  },
];
