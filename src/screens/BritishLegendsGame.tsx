import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  legendAchievements,
  legendWorks,
  metaFeatures,
  saveKey,
  type LegendId,
  type LegendWork,
} from "../data/britishLegends";
import { IntroScreen } from "./IntroScreen";

type View = "title" | "opening" | "lodge" | "codex" | "world";
type TimeTone = "morning" | "evening" | "night";
type SoundKind = "page" | "clear" | "fire" | "wind" | "battle" | "boss";
type Toast = { title: string; body: string; tone: "chapter" | "clear" | "home" };

type BritishSave = {
  activeWork: LegendId;
  restored: LegendId[];
  chapterProgress: Record<LegendId, number>;
  titleSeen: boolean;
  openingWatched: boolean;
  sound: boolean;
};

const initialProgress: Record<LegendId, number> = {
  beowulf: 0,
  hamlet: 0,
  macbeth: 0,
};

const titleLodgeArt = `${import.meta.env.BASE_URL}assets/opening/opening-lodge.png`;

function freshBritishSave(sound = false): BritishSave {
  return {
    activeWork: "beowulf",
    restored: [],
    chapterProgress: initialProgress,
    titleSeen: false,
    openingWatched: false,
    sound,
  };
}

function loadBritishSave(): BritishSave {
  try {
    const raw = localStorage.getItem(saveKey);
    if (!raw) {
      return freshBritishSave();
    }
    const parsed = JSON.parse(raw) as Partial<BritishSave>;
    const validIds = new Set<LegendId>(legendWorks.map((work) => work.id));
    const parsedActive = parsed.activeWork;
    const activeWork = parsedActive && validIds.has(parsedActive) ? parsedActive : "beowulf";
    return {
      activeWork,
      restored: Array.isArray(parsed.restored)
        ? parsed.restored.filter((id): id is LegendId => validIds.has(id))
        : [],
      chapterProgress: { ...initialProgress, ...parsed.chapterProgress },
      titleSeen: Boolean(parsed.titleSeen),
      openingWatched: Boolean(parsed.openingWatched ?? parsed.titleSeen),
      sound: Boolean(parsed.sound),
    };
  } catch {
    localStorage.removeItem(saveKey);
    return freshBritishSave();
  }
}

function timeTone(): TimeTone {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 16) return "morning";
  if (hour >= 16 && hour < 20) return "evening";
  return "night";
}

function makeTone(kind: SoundKind) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const audio = new AudioContextClass();
  const now = audio.currentTime;
  const gain = audio.createGain();
  const osc = audio.createOscillator();
  gain.connect(audio.destination);
  osc.connect(gain);

  if (kind === "page") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.16);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.stop(now + 0.24);
  } else if (kind === "clear") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.setValueAtTime(659, now + 0.12);
    osc.frequency.setValueAtTime(784, now + 0.24);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
    osc.stop(now + 0.66);
  } else {
    osc.type = kind === "battle" ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(kind === "fire" ? 96 : kind === "wind" ? 142 : kind === "boss" ? 84 : 180, now);
    if (kind === "boss") {
      osc.frequency.setValueAtTime(84, now);
      osc.frequency.setValueAtTime(126, now + 0.14);
      osc.frequency.setValueAtTime(72, now + 0.28);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "battle" || kind === "boss" ? 0.055 : 0.035, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc.stop(now + 0.5);
  }
  osc.start(now);
}

function workById(id: LegendId): LegendWork {
  return legendWorks.find((work) => work.id === id) ?? legendWorks[0];
}

function PixelPortrait({ work, restored }: { work: LegendWork; restored: boolean }) {
  return (
    <span
      className={`bl-pixel-portrait bl-pixel-portrait--${work.id} ${restored ? "restored" : ""}`}
      style={{ "--tone": work.color, "--shade": work.shadow } as CSSProperties}
      aria-hidden="true"
    >
      <i />
      <b />
      <em />
    </span>
  );
}

function BritishSound({ sound, view }: { sound: boolean; view: View }) {
  return (
    <div className={`bl-soundscape ${sound ? "on" : ""}`} aria-hidden="true">
      <span className={`bl-sound-chip ${view === "lodge" ? "active" : ""}`}>Hearth</span>
      <span className={`bl-sound-chip ${view === "world" ? "active" : ""}`}>Wind</span>
      <span className={`bl-sound-chip ${view === "world" ? "active" : ""}`}>Battle</span>
      <span className={`bl-sound-chip ${view === "world" ? "active" : ""}`}>Boss</span>
      <span className="bl-sound-chip">Clear</span>
    </div>
  );
}

export function BritishLegendsGame() {
  const [save, setSave] = useState<BritishSave>(() => loadBritishSave());
  const [view, setView] = useState<View>("title");
  const [tone, setTone] = useState<TimeTone>(() => timeTone());
  const [toast, setToast] = useState<Toast | null>(null);
  const [companionMoment, setCompanionMoment] = useState<{ name: string; line: string } | null>(null);
  const hasStarted = save.titleSeen || save.openingWatched || save.restored.length > 0 || Object.values(save.chapterProgress).some((progress) => progress > 0);
  const active = workById(save.activeWork);
  const restoredSet = useMemo(() => new Set(save.restored), [save.restored]);
  const totalChapters = legendWorks.reduce((sum, work) => sum + work.chapters.length, 0);
  const restoredChapters = legendWorks.reduce((sum, work) => {
    return sum + Math.min(save.chapterProgress[work.id] ?? 0, work.chapters.length);
  }, 0);
  const codexRate = Math.round((restoredChapters / totalChapters) * 100);
  const completeRate = Math.round((save.restored.length / legendWorks.length) * 100);
  const worldLevel = save.restored.length;
  const unlockedAchievements = legendAchievements.filter((achievement) => {
    const { requires } = achievement;
    if (requires.complete && completeRate < 100) return false;
    if (requires.restored !== undefined && save.restored.length < requires.restored) return false;
    if (requires.codexRate !== undefined && codexRate < requires.codexRate) return false;
    return true;
  });
  const nextAchievement = legendAchievements.find((achievement) => !unlockedAchievements.includes(achievement));
  const activeProgress = save.chapterProgress[active.id] ?? 0;
  const activeNextChapter = active.chapters[Math.min(activeProgress, active.chapters.length - 1)];
  const activeNextNote = active.chapterNotes[Math.min(activeProgress, active.chapterNotes.length - 1)];
  const title =
    completeRate === 100 ? "Keeper of the Restored Shelf" :
    completeRate >= 67 ? "Lantern-Bound Reader" :
    completeRate >= 34 ? "Story Restorer" :
    "Apprentice Reader";

  useEffect(() => {
    localStorage.setItem(saveKey, JSON.stringify(save));
  }, [save]);

  useEffect(() => {
    const timer = window.setInterval(() => setTone(timeTone()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!save.sound || view === "title" || view === "opening") return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const master = audio.createGain();
    const low = audio.createOscillator();
    const high = audio.createOscillator();
    const filter = audio.createBiquadFilter();

    const profile =
      view === "lodge" ? { low: 98, high: 196, gain: 0.018, type: "sine" as OscillatorType } :
      view === "world" ? { low: 74, high: 148, gain: 0.015, type: "triangle" as OscillatorType } :
      { low: 132, high: 264, gain: 0.012, type: "sine" as OscillatorType };

    low.type = profile.type;
    high.type = profile.type;
    low.frequency.value = profile.low;
    high.frequency.value = profile.high;
    filter.type = "lowpass";
    filter.frequency.value = view === "world" ? 420 : 620;
    master.gain.value = profile.gain;

    low.connect(filter);
    high.connect(filter);
    filter.connect(master);
    master.connect(audio.destination);
    low.start();
    high.start();

    return () => {
      master.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.08);
      low.stop(audio.currentTime + 0.1);
      high.stop(audio.currentTime + 0.1);
      window.setTimeout(() => void audio.close(), 140);
    };
  }, [save.sound, view]);

  function patchSave(patch: Partial<BritishSave>) {
    setSave((current) => ({ ...current, ...patch }));
  }

  function setActiveWork(id: LegendId) {
    const work = workById(id);
    const progress = save.chapterProgress[id] ?? 0;
    const restored = restoredSet.has(id);
    const mood = restored ? work.moods[2] : progress > 0 ? work.moods[1] : work.moods[0];
    patchSave({ activeWork: id });
    setCompanionMoment({ name: work.companion, line: mood.line });
    makeTone("page");
  }

  function startGame() {
    setSave(freshBritishSave(true));
    setView("opening");
    makeTone("page");
  }

  function continueGame() {
    patchSave({ titleSeen: true });
    setView("lodge");
    makeTone("clear");
  }

  function completeOpening() {
    patchSave({ titleSeen: true, openingWatched: true, sound: true });
    setView("lodge");
    makeTone("clear");
  }

  function replayOpening() {
    setView("opening");
    makeTone("page");
  }

  function restoreChapter(work: LegendWork) {
    const current = save.chapterProgress[work.id] ?? 0;
    if (current >= work.chapters.length) {
      setActiveWork(work.id);
      setToast({
        title: "Story Revisited",
        body: `${work.companion} returns to the ${work.artifact}.`,
        tone: "home",
      });
      return;
    }
    const next = Math.min(current + 1, work.chapters.length);
    const isFinalChapter = next >= work.chapters.length;
    const restored = next >= work.chapters.length && !restoredSet.has(work.id)
      ? [...save.restored, work.id]
      : save.restored;
    setSave({
      ...save,
      activeWork: work.id,
      chapterProgress: { ...save.chapterProgress, [work.id]: next },
      restored,
    });
    setToast({
      title: isFinalChapter ? `${work.title} Restored` : "Chapter Restored",
      body: isFinalChapter
        ? `${work.trophy} has appeared in the Lodge.`
        : `${work.chapters[current]} returned to the shelf.`,
      tone: isFinalChapter ? "clear" : "chapter",
    });
    makeTone(isFinalChapter ? "clear" : current === work.chapters.length - 2 ? "boss" : "battle");
  }

  function resetDemo() {
    const fresh = {
      activeWork: "beowulf" as LegendId,
      restored: [],
      chapterProgress: initialProgress,
      titleSeen: true,
      openingWatched: true,
      sound: save.sound,
    };
    setSave(fresh);
    setView("lodge");
  }

  return (
    <main className={`bl-game bl-game--${view} bl-time--${tone} bl-revival-${worldLevel}`}>
      <BritishSound sound={save.sound} view={view} />
      {toast && (
        <button type="button" className={`bl-toast bl-toast--${toast.tone}`} onClick={() => setToast(null)}>
          <span>{toast.title}</span>
          <strong>{toast.body}</strong>
        </button>
      )}

      {view === "opening" ? (
        <IntroScreen onComplete={completeOpening} />
      ) : view === "title" ? (
        <section className="bl-title">
          <img className="bl-title__art" src={titleLodgeArt} alt="" />
          <div className="bl-title__keyart" aria-hidden="true">
            <span className="bl-title__book" />
            <span className="bl-title__blade" />
            <span className="bl-title__crown" />
            <span className="bl-title__flame" />
          </div>
          <div className="bl-title__copy">
            <p>Restore the Lost Stories.</p>
            <h1>British Legends</h1>
            <span>A dark fantasy RPG about reclaiming stories erased from memory.</span>
            <div className="bl-title__actions">
              <button type="button" onClick={startGame}>New Game</button>
              <button type="button" onClick={continueGame} disabled={!hasStarted}>Continue</button>
              <button type="button" onClick={replayOpening} disabled={!save.openingWatched}>Replay Opening</button>
            </div>
          </div>
          <div className="bl-title__loading">
            <i />
            <span>{hasStarted ? "Save data found." : "No restored stories yet."}</span>
          </div>
        </section>
      ) : (
        <>
          <header className="bl-hud">
            <button type="button" className={view === "lodge" ? "active" : ""} onClick={() => setView("lodge")}>
              Lodge
            </button>
            <button type="button" className={view === "world" ? "active" : ""} onClick={() => { setView("world"); makeTone("wind"); }}>
              Stories
            </button>
            <button type="button" className={view === "codex" ? "active" : ""} onClick={() => { setView("codex"); makeTone("page"); }}>
              Codex
            </button>
            <div className="bl-hud__progress">
              <span>{title}</span>
              <strong>{completeRate}% Restored</strong>
            </div>
            <button type="button" className="bl-hud__sound" onClick={() => patchSave({ sound: !save.sound })}>
              {save.sound ? "Sound On" : "Sound Off"}
            </button>
            <button type="button" className="bl-hud__replay" onClick={replayOpening}>
              Replay Opening
            </button>
          </header>

          {view === "lodge" && (
            <section className="bl-lodge">
              <div className="bl-lodge__room">
                <div className="bl-window"><i /></div>
                <div className="bl-shelves">
                  {legendWorks.map((work) => (
                    <button
                      type="button"
                      key={work.id}
                      className={`bl-book ${restoredSet.has(work.id) ? "restored" : ""} ${save.activeWork === work.id ? "active" : ""}`}
                      onClick={() => setActiveWork(work.id)}
                      style={{ "--tone": work.color } as CSSProperties}
                    >
                      {work.title}
                    </button>
                  ))}
                </div>
                <div className="bl-trophies">
                  {legendWorks.map((work) => (
                    <span key={work.id} className={restoredSet.has(work.id) ? "won" : ""}>{work.title.slice(0, 1)}</span>
                  ))}
                </div>
                <div className="bl-fireplace" onMouseEnter={() => makeTone("fire")}>
                  <span className="flame a" />
                  <span className="flame b" />
                  <span className="flame c" />
                  <i />
                </div>
                <div className={`bl-plant bl-plant--${worldLevel}`}><i /><b /><em /></div>
                <div className="bl-rug" aria-hidden="true" />
                <div className="bl-candles" aria-hidden="true"><i /><b /><em /></div>
                <div className="bl-wall-map" aria-hidden="true">
                  <span>Routes</span>
                  <b>{completeRate}%</b>
                </div>
                <div className="bl-desk">
                  <span>Now Reading</span>
                  <strong>{active.title}</strong>
                  <small>{active.subtitle}</small>
                  <em>{active.artifact}</em>
                </div>

                {legendWorks.map((work, index) => {
                  const progress = save.chapterProgress[work.id] ?? 0;
                  const restored = restoredSet.has(work.id);
                  const mood = restored ? work.moods[2] : save.activeWork === work.id && progress > 0 ? work.moods[1] : work.moods[0];
                  return (
                    <button
                      type="button"
                      key={work.id}
                      className={`bl-companion bl-companion--${work.id} ${save.activeWork === work.id ? "active" : ""}`}
                      onClick={() => setActiveWork(work.id)}
                      style={{ "--i": index, "--tone": work.color } as CSSProperties}
                    >
                      <PixelPortrait work={work} restored={restored} />
                      <span>{work.companion}</span>
                      <small>{mood.activity}</small>
                      <b>{mood.line}</b>
                    </button>
                  );
                })}
                {companionMoment && (
                  <button type="button" className="bl-moment" onClick={() => setCompanionMoment(null)}>
                    <span>{companionMoment.name}</span>
                    <strong>{companionMoment.line}</strong>
                  </button>
                )}
              </div>
              <aside className="bl-lodge__panel">
                <span>Bibliotheca Lodge</span>
                <h2>Recovered light: {worldLevel}/3</h2>
                <p>{active.intro}</p>
                <div className="bl-next-card">
                  <strong>{activeNextChapter}</strong>
                  <p>{activeNextNote}</p>
                  <small>{activeProgress}/{active.chapters.length} chapters restored</small>
                  <button type="button" onClick={() => { setView("world"); makeTone("wind"); }}>Open Story Map</button>
                </div>
                <div className="bl-home-log">
                  <strong>Lodge Memory</strong>
                  <span>{save.restored.length === 0 ? "The shelves are waiting for their first complete story." : `${save.restored.length} trophy pieces glow by the hearth.`}</span>
                  <span>{nextAchievement ? `Next title: ${nextAchievement.title}` : "All current titles unlocked."}</span>
                </div>
              </aside>
            </section>
          )}

          {view === "world" && (
            <section className="bl-world">
              <div className="bl-world__map">
                {legendWorks.map((work) => {
                  const progress = save.chapterProgress[work.id] ?? 0;
                  const restored = restoredSet.has(work.id);
                  return (
                    <article key={work.id} className={`bl-story-card ${restored ? "restored" : ""}`}>
                      <PixelPortrait work={work} restored={restored} />
                      <span>{work.period}</span>
                      <h2>{work.title}</h2>
                      <p>{work.intro}</p>
                      <small>{progress}/{work.chapters.length} chapters restored</small>
                      <meter min={0} max={work.chapters.length} value={progress} />
                      <ol className="bl-chapter-list">
                        {work.chapters.map((chapter, index) => (
                          <li key={chapter} className={index < progress ? "done" : index === progress ? "next" : ""}>
                            <span>{chapter}</span>
                            <small>{work.chapterNotes[index]}</small>
                          </li>
                        ))}
                      </ol>
                      <button type="button" onClick={() => restoreChapter(work)}>
                        {restored ? "Revisit" : "Restore Chapter"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {view === "codex" && (
            <section className="bl-codex">
              <div className="bl-codex__summary">
                <span>Codex Completion</span>
                <strong>{codexRate}%</strong>
                <meter min={0} max={100} value={codexRate} />
              </div>
              <div className="bl-codex__grid">
                {legendWorks.map((work) => {
                  const progress = save.chapterProgress[work.id] ?? 0;
                  const unlockRate = Math.round((progress / work.chapters.length) * 100);
                  const restored = restoredSet.has(work.id);
                  return (
                    <article key={work.id} className={`bl-codex-card ${restored ? "restored" : ""}`}>
                      <PixelPortrait work={work} restored={restored} />
                      <div>
                        <span>{work.year}</span>
                        <h2>{work.title}</h2>
                        <p>{work.codex}</p>
                      </div>
                      <dl>
                        <dt>Theme</dt><dd>{work.theme}</dd>
                        <dt>Period</dt><dd>{work.period}</dd>
                        <dt>Unlocked</dt><dd>{unlockRate}%</dd>
                      </dl>
                    </article>
                  );
                })}
              </div>
              <div className="bl-achievements">
                {legendAchievements.map((achievement) => {
                  const unlocked = unlockedAchievements.includes(achievement);
                  return (
                    <span key={achievement.id} className={unlocked ? "unlocked" : ""}>
                      <b>{achievement.title}</b>
                      <small>{achievement.detail}</small>
                    </span>
                  );
                })}
              </div>
              <div className="bl-meta">
                {metaFeatures.map((feature) => (
                  <span key={feature.id} className={feature.status}>
                    <b>{feature.label}</b>
                    <small>{feature.detail}</small>
                  </span>
                ))}
              </div>
              <button type="button" className="bl-reset" onClick={resetDemo}>Reset Progress Preview</button>
            </section>
          )}
        </>
      )}
    </main>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
