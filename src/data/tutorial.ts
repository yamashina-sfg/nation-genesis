import type { GameMode } from "../types/game";

/**
 * 初回プレイ時のチュートリアル。
 * 秘書役のキャラクターが執務室→政策→ニュース→市場→外交→翌年へを案内する。
 * 「この端末で一度クリアしたら二度と出さない」ようにlocalStorageで記録。
 */
const KEY = "kokka-tutorial-v1";

export function tutorialDone(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markTutorialDone(): void {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* noop */
  }
}

export type TutorialStep = {
  /** 案内役キャラクターのID（characters.ts） */
  speaker: string;
  /** 表示する画面（この画面に切り替えてから説明する） */
  mode: GameMode;
  /** 吹き出しの見出し */
  title: string;
  /** セリフ本文 */
  text: string;
  /** どの要素に注目してほしいか（任意のヒント文。null可） */
  focus?: string;
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    speaker: "finance",
    mode: "status",
    title: "ご就任おめでとうございます",
    text: "おはようございます、大統領。財務大臣のミラです。ここは執務室——あなたの一日はこの部屋から始まります。国の調子はこの画面で一目で分かりますよ。",
  },
  {
    speaker: "finance",
    mode: "status",
    title: "まずは「本日の課題」",
    text: "画面の『本日の課題』が、今日やるべきことです。迷ったらまずこれをこなしてみてください。達成すると経験値がもらえて、大統領としてのレベルが上がります。",
    focus: "本日の課題パネルを見てみましょう",
  },
  {
    speaker: "finance",
    mode: "policies",
    title: "政策で国を動かす",
    text: "ここが政策の間です。減税・教育・インフラ……カードを選んで実行すれば、国が変わります。実行前に効果の予測が出るので、安心して選んでください。",
    focus: "政策カードを選ぶと結果を予測できます",
  },
  {
    speaker: "press",
    mode: "news",
    title: "結果はニュースで分かる",
    text: "記者のエマです。あなたが打った手も、世界で起きた出来事も、すべてここニュースに流れます。数字が動いた“理由”はここを読めば分かりますよ。",
  },
  {
    speaker: "business",
    mode: "market",
    title: "経済の体温は市場で",
    text: "経済界のソフィアです。景気の良し悪しは、この市場画面の株価に表れます。政策や金利を変えると、投資家がすぐ反応しますよ。",
  },
  {
    speaker: "foreign",
    mode: "map",
    title: "世界と渡り合う",
    text: "外務大臣のレオンです。外交の間では、世界中の国と関係を築けます。会談を重ね、同盟を結べば、心強い味方になります。",
    focus: "国を選んでアクションを実行してみましょう",
  },
  {
    speaker: "finance",
    mode: "status",
    title: "そして時代を進める",
    text: "ひと通り手を打ったら『翌年へ進む』で時間を進めます。1年が経ち、政策の効果が表れ、新たな出来事も起こります。やがて時代そのものが移り変わっていきます。",
    focus: "右下の『翌年へ進む』で1年進みます",
  },
  {
    speaker: "finance",
    mode: "status",
    title: "1850年から、歴史を動かそう",
    text: "ここは1850年。鉄道も工場もこれからの時代です。あなたの決断の積み重ねが、やがて近代から現代へと続く歴史になります。さあ、始めましょう——大統領。",
  },
];
