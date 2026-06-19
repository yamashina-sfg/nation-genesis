import type { NationStats } from "../types/game";
import type { SpriteRole } from "../components/room/PixelSprite";

/**
 * 大臣NPCの定義。
 * fields = この大臣が担当する政策ジャンル（policies.ts の field と対応）。
 * 会話は国家状況に応じてセリフが変わる。
 */
export type Minister = {
  id: string;
  name: string;
  title: string;
  emoji: string;
  color: string;
  /** ドット絵スプライトの役職 */
  role: SpriteRole;
  fields: string[];
  /** 国家状況に応じた一言 */
  line: (s: NationStats, year: number) => string;
};

export const ministers: Minister[] = [
  {
    id: "finance",
    name: "ミラ",
    title: "財務大臣",
    emoji: "👩‍💼",
    color: "#2f6f57",
    role: "finance",
    fields: ["財政", "投資"],
    line: (s) =>
      s.budget < 0
        ? "大統領、国庫は火の車です…。歳出の見直しか、税収の確保を急ぎましょう。"
        : s.budget < 40
          ? "予算に余裕がありません。大きな支出は慎重にお願いします。"
          : "財政は落ち着いています。今のうちに将来への投資を考えましょう。",
  },
  {
    id: "foreign",
    name: "レオン",
    title: "外務大臣",
    emoji: "🧑‍✈️",
    color: "#3a6ea5",
    role: "foreign",
    fields: ["外交"],
    line: (s) =>
      s.trust < 40
        ? "各国からの信用が下がっています。関係修復の手を打つべきです。"
        : "世界は刻々と動いています。今こそ外交で存在感を示しましょう。",
  },
  {
    id: "defense",
    name: "ガレス",
    title: "防衛大臣",
    emoji: "🪖",
    color: "#a4555c",
    role: "defense",
    fields: ["安全保障"],
    line: (s) =>
      s.military < 35
        ? "大統領、我が国の守りは手薄です。抑止力の強化を検討すべきかと。"
        : "備えは整いつつあります。やりすぎは周辺国を刺激しますのでご注意を。",
  },
  {
    id: "welfare",
    name: "ノア",
    title: "厚生大臣",
    emoji: "🧑‍⚕️",
    color: "#5a9a4a",
    role: "citizen",
    fields: ["社会", "人口", "環境"],
    line: (s) =>
      s.happiness < 45
        ? "国民の暮らしに不満がたまっています。生活を支える政策が必要です。"
        : "暮らしは安定しています。次の世代への備えも考えたいところです。",
  },
  {
    id: "education",
    name: "ソフィア",
    title: "教育・科学大臣",
    emoji: "🧑‍🏫",
    color: "#9a7b3a",
    role: "business",
    fields: ["産業"],
    line: (s) =>
      s.technology < 45
        ? "技術で後れを取っています。教育と研究への投資が国の未来を決めます。"
        : "技術立国の芽が育っています。さらに産業を伸ばしましょう。",
  },
  {
    id: "chief",
    name: "ハル",
    title: "官房長官",
    emoji: "🧑‍💼",
    color: "#6a6f7a",
    role: "secretary",
    fields: ["政治"],
    line: (s) =>
      s.approval < 40
        ? "支持率が厳しい状況です。国民に響く決断が求められています。"
        : "政権は安定しています。腰を据えて国づくりを進めましょう。",
  },
];

export function getMinister(id: string): Minister | undefined {
  return ministers.find((m) => m.id === id);
}
