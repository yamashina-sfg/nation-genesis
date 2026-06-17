import type { GameMode } from "../types/game";

type ModeTab = {
  id: GameMode;
  label: string;
};

const tabs: ModeTab[] = [
  { id: "status", label: "国家" },
  { id: "policies", label: "政策" },
  { id: "map", label: "外交" },
  { id: "market", label: "市場" },
  { id: "ranking", label: "順位" },
  { id: "news", label: "ニュース" },
];

type ModeTabsProps = {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
};

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <nav className="mode-tabs" aria-label="画面切り替え">
      {tabs.map((tab) => (
        <button
          className={mode === tab.id ? "active" : ""}
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
