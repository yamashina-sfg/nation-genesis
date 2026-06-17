import businessImage from "../assets/characters/economy-leader.svg";
import citizenImage from "../assets/characters/citizen-representative.svg";
import defenseImage from "../assets/characters/defense-minister.svg";
import financeImage from "../assets/characters/finance-minister.svg";
import foreignImage from "../assets/characters/foreign-minister.svg";
import leaderImage from "../assets/characters/leader.svg";
import pressImage from "../assets/characters/journalist.svg";
import type { Character } from "../types/game";

/**
 * 閣僚・関係者のキャラクター情報。
 * image が読み込めない場合は fallbackColor と title でプレースホルダー表示する。
 */
export const characters: Character[] = [
  {
    id: "leader",
    name: "あなた",
    title: "国家元首",
    role: "国家方針・最終決定",
    personality: "矛盾する利害を束ねる決断者",
    color: "#f1c45b",
    fallbackColor: "#7a5b12",
    image: leaderImage,
    defaultComment: "国家方針を決め、矛盾する利害を束ねるのが私の仕事だ。",
    advice: "国家方針を決め、矛盾する利害を束ねる。",
  },
  {
    id: "finance",
    name: "ミラ",
    title: "財務大臣",
    role: "予算・税金・インフレ・政策金利",
    personality: "冷静沈着。常に資料を手に数字で語る",
    color: "#5bbf9d",
    fallbackColor: "#1f3a5f",
    image: financeImage,
    defaultComment: "予算と物価を同時に見ながら、無理のない成長軌道を作りましょう。",
    advice: "予算と物価を同時に見ながら、無理のない成長軌道を作りましょう。",
  },
  {
    id: "foreign",
    name: "レオン",
    title: "外務大臣",
    role: "外交・貿易・同盟・制裁",
    personality: "落ち着いた交渉役。国章バッジが目印",
    color: "#5f9ee6",
    fallbackColor: "#234e7a",
    image: foreignImage,
    defaultComment: "外交は信頼の積み立てです。一度の協定より、続く関係を重視します。",
    advice: "外交は信頼の積み立てです。一度の協定より、続く関係を重視します。",
  },
  {
    id: "defense",
    name: "ガレス",
    title: "防衛大臣",
    role: "軍事力・安全保障・周辺国緊張",
    personality: "厳格で実直。短髪の軍人気質",
    color: "#d56b72",
    fallbackColor: "#5a2a2e",
    image: defenseImage,
    defaultComment: "弱すぎる軍は交渉力を落とし、強すぎる軍は警戒を招きます。均衡が肝要です。",
    advice: "弱すぎる軍は交渉力を落とし、強すぎる軍は警戒を招きます。均衡が肝要です。",
  },
  {
    id: "business",
    name: "ソフィア",
    title: "経済界代表",
    role: "企業・株価・雇用・投資",
    personality: "明るく前向きなビジネスリーダー",
    color: "#dca35a",
    fallbackColor: "#6b4a16",
    image: businessImage,
    defaultComment: "金利と政策は市場心理へ即座に伝わります。投資家は先を読みますよ。",
    advice: "金利と政策は市場心理へ即座に伝わります。投資家は先を読みますよ。",
  },
  {
    id: "citizen",
    name: "ノア",
    title: "国民代表",
    role: "支持率・幸福度・生活不満",
    personality: "親しみやすい一般市民の声",
    color: "#86c76f",
    fallbackColor: "#33571f",
    image: citizenImage,
    defaultComment: "GDPが伸びても、暮らしが苦しければ支持は続きません。生活実感が大切です。",
    advice: "GDPが伸びても、暮らしが苦しければ支持は続きません。生活実感が大切です。",
  },
  {
    id: "press",
    name: "エマ",
    title: "記者",
    role: "ニュース・世論・スキャンダル",
    personality: "鋭い嗅覚。メモ帳を手放さない",
    color: "#b891df",
    fallbackColor: "#432a5e",
    image: pressImage,
    defaultComment: "読者が知りたいのは、数字が動いた“理由”です。すべて記録していきます。",
    advice: "読者が知りたいのは、数字が動いた“理由”です。すべて記録していきます。",
  },
];
