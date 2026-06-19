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
    title: "ようこそ、執務室へ",
    text: "おはようございます、大統領。財務大臣のミラです。ここは1850年のあなたの執務室。まずは——矢印キーやWASD（スマホは画面下の十字キー）で、部屋を自由に歩いてみてください。",
    focus: "矢印キー / WASD / 画面下の十字キーで移動",
  },
  {
    speaker: "foreign",
    mode: "status",
    title: "大臣に相談しよう",
    text: "外務大臣のレオンです。私たち大臣に近づいてEnterキー、または大臣を直接タップで話しかけられます。相談すれば、その分野の政策をその場で決められますよ。",
    focus: "大臣に近づいてEnter、またはタップで会話",
  },
  {
    speaker: "press",
    mode: "status",
    title: "結果はニュースで分かる",
    text: "記者のエマです。あなたの決断も、世界で起きた出来事も、すべて速報ニュースに流れます。下のタブからいつでも確認できますよ。",
  },
  {
    speaker: "business",
    mode: "status",
    title: "そして時代を進める",
    text: "経済界のソフィアです。手を打ったら右上の『翌年へ進む』で1年すすめます。世界が動き、政策の効果が表れ、やがて時代そのものが移り変わっていきます。",
    focus: "右上の『翌年へ進む』で1年すすむ",
  },
  {
    speaker: "finance",
    mode: "status",
    title: "目標は、現代へ到達すること",
    text: "1850年から現代（2025年）まで国を導きましょう。在任が長いほど『歴史的評価』が高まります。ただし——支持率がゼロになる、または財政が破綻すると、あなたは退陣です。さあ、歴史を始めましょう、大統領。",
  },
];
