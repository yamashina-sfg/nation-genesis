export type LegendId = "beowulf" | "hamlet" | "macbeth";

export type CompanionMood = {
  activity: string;
  line: string;
  condition: "arrival" | "reading" | "rescued";
};

export type LegendWork = {
  id: LegendId;
  title: string;
  subtitle: string;
  year: string;
  period: string;
  theme: string;
  intro: string;
  companion: string;
  color: string;
  shadow: string;
  chapters: string[];
  chapterNotes: string[];
  trophy: string;
  artifact: string;
  codex: string;
  moods: CompanionMood[];
};

export type LegendAchievement = {
  id: string;
  title: string;
  detail: string;
  requires: {
    restored?: number;
    codexRate?: number;
    complete?: boolean;
  };
};

export type MetaFeature = {
  id: string;
  label: string;
  status: "foundation" | "ready";
  detail: string;
};

export const legendWorks: LegendWork[] = [
  {
    id: "beowulf",
    title: "Beowulf",
    subtitle: "The Hall Against the Dark",
    year: "c. 700-1000",
    period: "Old English / Anglo-Saxon",
    theme: "Heroism, Kinship, Mortality",
    intro: "A mead-hall waits beyond the page. Restore the song before its name is swallowed.",
    companion: "Beowulf",
    color: "#d7b35a",
    shadow: "#4b2d17",
    chapters: ["Heorot's Silence", "Grendel's Footsteps", "The Dragon's Ash"],
    chapterNotes: [
      "The hall remembers laughter, but the benches are cold.",
      "A shadow claws at the song before dawn can name it.",
      "Old glory meets the fire that waits for every hero.",
    ],
    trophy: "Golden Mead-Horn",
    artifact: "weathered sword hilt",
    codex:
      "An Old English epic of courage and doom, where glory is bright because it does not last.",
    moods: [
      { condition: "arrival", activity: "polishing a sword near the hearth", line: "英雄とは力だけではない。" },
      { condition: "reading", activity: "testing the edge of an old blade", line: "名は歌われてこそ残る。" },
      { condition: "rescued", activity: "standing watch by the trophy shelf", line: "宴の灯を守ろう。夜はまだ深い。" },
    ],
  },
  {
    id: "hamlet",
    title: "Hamlet",
    subtitle: "A Crown of Questions",
    year: "c. 1600",
    period: "Elizabethan / Jacobean Drama",
    theme: "Choice, Doubt, Revenge",
    intro: "A prince lingers between thought and action. Bring his words back from the margin.",
    companion: "Hamlet",
    color: "#8fb4d9",
    shadow: "#1d2d4d",
    chapters: ["Elsinore's Whisper", "The Play Within", "The Poisoned Hall"],
    chapterNotes: [
      "A corridor listens while a prince weighs every step.",
      "A staged murder turns memory into evidence.",
      "The court's polished floor reflects a poisoned truth.",
    ],
    trophy: "Silver Theatre Mask",
    artifact: "annotated playbook",
    codex:
      "Shakespeare's tragedy of a mind too awake to move easily through a corrupted court.",
    moods: [
      { condition: "arrival", activity: "reading in the window light", line: "決断とは、時に苦しみを伴う。" },
      { condition: "reading", activity: "turning one page, then turning back", line: "問いは刃より深く刺さる。" },
      { condition: "rescued", activity: "marking a passage with quiet relief", line: "言葉が戻れば、沈黙も意味を持つ。" },
    ],
  },
  {
    id: "macbeth",
    title: "Macbeth",
    subtitle: "Embers of Ambition",
    year: "1606",
    period: "Jacobean Tragedy",
    theme: "Ambition, Fate, Guilt",
    intro: "Smoke curls through a Scottish night. Read carefully; every promise has a price.",
    companion: "Macbeth",
    color: "#b46b5b",
    shadow: "#301a25",
    chapters: ["The Heath's Prophecy", "The Sleepless Crown", "Birnam's March"],
    chapterNotes: [
      "Thunder opens a road that should never be trusted.",
      "A crown sits heavily on a sleepless head.",
      "The forest moves, and a borrowed fate comes due.",
    ],
    trophy: "Soot-Dark Crown",
    artifact: "smoke-stained dagger",
    codex:
      "A tragedy of prophecy, violence, and the terrible speed with which ambition can hollow a soul.",
    moods: [
      { condition: "arrival", activity: "watching the fireplace without blinking", line: "野心は、人を変えてしまう。" },
      { condition: "reading", activity: "warming his hands at a low flame", line: "予言は道ではない。罠にもなる。" },
      { condition: "rescued", activity: "keeping distance from the brightest light", line: "戻った言葉が、罪を照らす。" },
    ],
  },
];

export const legendAchievements: LegendAchievement[] = [
  { id: "first-page", title: "First Page Returned", detail: "Restore any chapter.", requires: { codexRate: 1 } },
  { id: "hearth-lit", title: "Hearth Lit", detail: "Restore one complete work.", requires: { restored: 1 } },
  { id: "shelf-sings", title: "The Shelf Sings", detail: "Restore two complete works.", requires: { restored: 2 } },
  { id: "bibliotheca-whole", title: "Bibliotheca Restored", detail: "Restore all three works.", requires: { complete: true } },
  { id: "codex-keeper", title: "Codex Keeper", detail: "Reach 100% codex completion.", requires: { codexRate: 100 } },
];

export const metaFeatures: MetaFeature[] = [
  { id: "achievements", label: "Achievements", status: "ready", detail: "story rescue and codex milestones" },
  { id: "codex-rate", label: "Codex Rate", status: "ready", detail: "per-work and total completion tracked" },
  { id: "complete-rate", label: "Complete Rate", status: "ready", detail: "all three restored works measured" },
  { id: "titles", label: "Titles", status: "foundation", detail: "reader titles can unlock from milestones" },
  { id: "new-game-plus", label: "New Game+", status: "foundation", detail: "save schema can carry restored-library flags" },
  { id: "challenge", label: "Challenge Mode", status: "foundation", detail: "future ruleset slot reserved" },
];

export const saveKey = "british-legends-save-v1";
