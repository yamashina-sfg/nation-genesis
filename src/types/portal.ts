export type AppStatus = "開発中" | "β版" | "公開中" | "改修中";

export type AppCategory = "ゲーム" | "学習" | "生活" | "AI" | "クリエイティブ" | "開発ツール";

export type Developer = {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  bio: string;
  links: {
    label: string;
    url: string;
  }[];
};

export type PortalApp = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  thumbnail: {
    background: string;
    accent: string;
    motif: "grid" | "orbital" | "cards" | "terminal" | "chart";
  };
  category: AppCategory;
  tags: string[];
  developerId: string;
  status: AppStatus;
  url: string;
  recommended: boolean;
  updatedAt: string;
};
