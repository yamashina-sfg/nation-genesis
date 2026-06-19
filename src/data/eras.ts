/**
 * 時代区分（1850年〜現代）。
 * 「歴史の勉強」ではなく、国家運営の結果として近代史を追体験するための区分。
 * 名前・説明はやさしい言葉にする（専門用語をそのまま出さない）。
 */
export type Era = {
  id: string;
  start: number; // 開始年（この年から）
  end: number; // 終了年（この年まで）
  /** 時代名（やさしい） */
  name: string;
  /** 短い見出し用 */
  short: string;
  /** 一言の雰囲気説明 */
  blurb: string;
};

export const eras: Era[] = [
  {
    id: "foundation",
    start: 1850,
    end: 1899,
    name: "近代国家づくりの時代",
    short: "近代国家づくり",
    blurb: "工場と鉄道で国が一気に変わっていく時代。",
  },
  {
    id: "war",
    start: 1900,
    end: 1945,
    name: "戦争と世界危機の時代",
    short: "戦争と世界危機",
    blurb: "二度の大戦と大不況が世界を揺るがす時代。",
  },
  {
    id: "cold",
    start: 1946,
    end: 1990,
    name: "冷戦と復興の時代",
    short: "冷戦と復興",
    blurb: "焼け跡からの復興と、大国どうしがにらみ合う時代。",
  },
  {
    id: "global",
    start: 1991,
    end: 2019,
    name: "グローバル化の時代",
    short: "グローバル化",
    blurb: "世界中でモノ・お金・人が動きまわる時代。",
  },
  {
    id: "modern",
    start: 2020,
    end: 9999,
    name: "現代課題の時代",
    short: "現代の課題",
    blurb: "感染症・AI・脱炭素…新しい難題に向き合う時代。",
  },
];

export function eraForYear(year: number): Era {
  return eras.find((e) => year >= e.start && year <= e.end) ?? eras[eras.length - 1];
}

/** その年に「解放されている」か（since/until で時代制限を判定） */
export function isUnlocked(year: number, since?: number, until?: number): boolean {
  if (since != null && year < since) return false;
  if (until != null && year > until) return false;
  return true;
}
