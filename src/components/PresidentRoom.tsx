import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "./room/room.css";
import { TileMap } from "./room/TileMap";
import { Player } from "./room/Player";
import { NPC } from "./room/NPC";
import { DialogBox, type DialogExtra } from "./room/DialogBox";
import { VirtualDPad } from "./room/VirtualDPad";
import { RoomStatusBar } from "./room/RoomStatusBar";
import { PixelSprite } from "./room/PixelSprite";
import {
  COLS, ROWS, DIR_VEC, WALL_MAP, furniture, npcSpots, ambientSpots, playerStart,
  roomAt, cellStyle, type Dir, type Furniture,
} from "../data/roomLayout";
import { getTheme } from "../data/roomThemes";
import { getMinister } from "../data/ministers";
import { clearSave } from "../utils/save";
import { legacyScore, rankFor } from "../utils/score";
import type { GameMode, NationStats, PlayerNation, Policy } from "../types/game";
import type { Mission } from "../data/missions";

type Props = {
  countryId: string;
  nation: PlayerNation;
  stats: NationStats;
  policies: Policy[];
  year: number;
  eraName: string;
  eraShort: string;
  dayCount: number;
  level: number;
  missions: Mission[];
  onRequestPolicy: (policy: Policy) => void;
  onNavigate: (mode: GameMode) => void;
  onNextTurn: () => void;
};

const KEY_DIR: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
};

export function PresidentRoom({
  countryId, nation, stats, policies, year, eraName, eraShort, dayCount, level,
  missions, onRequestPolicy, onNavigate, onNextTurn,
}: Props) {
  const theme = getTheme(countryId);
  const [pos, setPos] = useState(playerStart);
  const [dir, setDir] = useState<Dir>("down");
  const [activeMinisterId, setActiveMinisterId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMsg, setMenuMsg] = useState<string | null>(null);
  const pressed = useRef<Dir[]>([]);
  const blockedUi = activeMinisterId !== null || menuOpen;

  // 通行不可タイル（壁＋家具＋NPC）と、操作対象の索引
  const { blocked, npcAt, objAt } = useMemo(() => {
    const blocked = new Set<string>();
    const npcAt = new Map<string, string>();
    const objAt = new Map<string, Furniture>();
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) if (WALL_MAP[y][x] === "#") blocked.add(`${x},${y}`);
    for (const f of furniture) {
      for (let dx = 0; dx < (f.w ?? 1); dx++)
        for (let dy = 0; dy < (f.h ?? 1); dy++) {
          const key = `${f.x + dx},${f.y + dy}`;
          if (f.solid !== false) blocked.add(key);
          if (f.interact) objAt.set(key, f);
        }
    }
    for (const n of npcSpots) { blocked.add(`${n.x},${n.y}`); npcAt.set(`${n.x},${n.y}`, n.ministerId); }
    for (const a of ambientSpots) blocked.add(`${a.x},${a.y}`);
    return { blocked, npcAt, objAt };
  }, []);

  function interactAt(p: { x: number; y: number }, d: Dir) {
    const fx = p.x + DIR_VEC[d].dx, fy = p.y + DIR_VEC[d].dy;
    const key = `${fx},${fy}`;
    const npcId = npcAt.get(key);
    if (npcId) { setActiveMinisterId(npcId); return; }
    const obj = objAt.get(key);
    if (obj?.interact) onNavigate(obj.interact.mode);
  }

  // キーボード操作
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (blockedUi) return;
      const k = e.key;
      if (k === "Enter" || k === " " || k === "z" || k === "Z") { e.preventDefault(); interactAt(pos, dir); return; }
      const nd = KEY_DIR[k];
      if (nd) { e.preventDefault(); if (!pressed.current.includes(nd)) pressed.current.push(nd); }
    };
    const onUp = (e: KeyboardEvent) => {
      const nd = KEY_DIR[e.key];
      if (nd) pressed.current = pressed.current.filter((x) => x !== nd);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [pos, dir, blockedUi]);

  // 移動ステッパー
  useEffect(() => {
    const id = setInterval(() => {
      if (blockedUi) return;
      const d = pressed.current[pressed.current.length - 1];
      if (!d) return;
      setDir(d);
      setPos((p) => {
        const t = { x: p.x + DIR_VEC[d].dx, y: p.y + DIR_VEC[d].dy };
        if (blocked.has(`${t.x},${t.y}`)) return p;
        return t;
      });
    }, 140);
    return () => clearInterval(id);
  }, [blocked, blockedUi]);

  const padPress = (d: Dir) => { if (!pressed.current.includes(d)) pressed.current.push(d); };
  const padRelease = (d: Dir) => { pressed.current = pressed.current.filter((x) => x !== d); };
  const padAction = () => { if (!blockedUi) interactAt(pos, dir); };

  const score = legacyScore(stats, dayCount);
  const rank = rankFor(score);

  // 「次に話すべき人物」＝最も緊急の課題の担当大臣
  const advisor = useMemo(() => {
    if (stats.budget < 20) return { id: "finance", text: "財政が危険水域です", urgent: true };
    if (stats.approval < 35) return { id: "chief", text: "支持率が低下しています", urgent: true };
    if (stats.trust < 35) return { id: "foreign", text: "外交信用が落ちています", urgent: true };
    if (stats.happiness < 40) return { id: "welfare", text: "国民の暮らしに不満", urgent: true };
    if (stats.military < 30) return { id: "defense", text: "国防が手薄です", urgent: false };
    if (stats.technology < 40) return { id: "education", text: "技術で後れ気味", urgent: false };
    return { id: "chief", text: "政権は安定しています", urgent: false };
  }, [stats.budget, stats.approval, stats.trust, stats.happiness, stats.military, stats.technology]);

  // 雰囲気オーバーレイ
  const dim = stats.budget < 25 || stats.approval < 35;
  const tense = stats.military >= 65;

  // いまプレイヤーが向いている先に操作できる対象があるか（行動プロンプト）
  const frontKey = `${pos.x + DIR_VEC[dir].dx},${pos.y + DIR_VEC[dir].dy}`;
  const frontNpc = npcAt.get(frontKey);
  const frontObj = objAt.get(frontKey);
  const prompt = frontNpc
    ? `${getMinister(frontNpc)?.title ?? "大臣"}と話す`
    : frontObj?.interact?.prompt ?? null;

  const boardStyle = {
    aspectRatio: `${COLS} / ${ROWS}`,
    ["--room-wall" as string]: theme.wall,
    ["--room-accent" as string]: theme.accent,
    ["--flag-grad" as string]: `linear-gradient(150deg, ${nation.flagPrimary} 0 45%, #f4f1e8 45% 55%, ${nation.flagAccent} 55% 100%)`,
  } as CSSProperties;

  const activeMinister = activeMinisterId ? getMinister(activeMinisterId) : null;
  const dialogPolicies = activeMinister ? policies.filter((p) => activeMinister.fields.includes(p.field)) : [];
  const dialogExtras: DialogExtra[] = [];
  let dialogLine = activeMinister ? activeMinister.line(stats, year) : "";
  if (activeMinister?.id === "foreign") {
    dialogExtras.push({ label: "外交画面を開く", sub: "首脳会談・貿易・制裁・支援", onClick: () => { setActiveMinisterId(null); onNavigate("map"); } });
  }
  if (activeMinister?.id === "chief") {
    const done = missions.filter((m) => m.done).length;
    const next = missions.find((m) => !m.done);
    dialogLine = `${activeMinister.line(stats, year)} 本日の課題は ${done}/${missions.length} 達成。${next ? `次は「${next.label}」。` : ""}`;
    dialogExtras.push({ label: "翌年へ進む", sub: "1年すすめる", primary: true, onClick: () => { setActiveMinisterId(null); onNextTurn(); } });
    dialogExtras.push({ label: "順位を見る", sub: "各国とくらべる", onClick: () => { setActiveMinisterId(null); onNavigate("ranking"); } });
  }

  const goal = missions.find((m) => !m.done)?.label ?? "国を安定させ、現代を目指す";
  const advisorMinister = getMinister(advisor.id);

  return (
    <div className="room-screen">
      <RoomStatusBar year={year} eraShort={eraShort} dayCount={dayCount} level={level} stats={stats} score={score} rank={rank} />

      <div className="room-board-wrap">
        <div className="room-board" style={boardStyle}>
          {/* HUD：現在地・目標・次に話す人物 */}
          <div className="room-hud">
            <div className="room-hud-line"><span className="room-hud-k">現在地</span>大統領府 1F ・ {roomAt(pos.x, pos.y).name}</div>
            <div className="room-hud-line"><span className="room-hud-k">目標</span>{goal}</div>
            <button type="button" className={`room-hud-next ${advisor.urgent ? "urgent" : ""}`} onClick={() => setActiveMinisterId(advisor.id)}>
              <span className="room-hud-k">次に話す</span>
              {advisorMinister?.title}（{advisor.text}）▶
            </button>
          </div>

          <div className="room-actions">
            <button type="button" className="room-next-btn" onClick={onNextTurn}>▶ 翌年へ進む</button>
            <button type="button" className="room-menu-btn" onClick={() => setMenuOpen(true)}>☰ メニュー</button>
          </div>

          <TileMap wallColor={theme.wall} onInteract={(f) => f.interact && onNavigate(f.interact.mode)} />

          <div className="room-layer">
            {/* 雰囲気づくりの非操作NPC */}
            {ambientSpots.map((a, i) => (
              <div key={`amb-${i}`} className="room-npc ambient" style={cellStyle(a.x, a.y)}>
                <PixelSprite role={a.role} />
              </div>
            ))}
            {/* 大臣NPC */}
            {npcSpots.map((n) => {
              const m = getMinister(n.ministerId);
              if (!m) return null;
              const near = Math.abs(n.x - pos.x) + Math.abs(n.y - pos.y) === 1;
              return (
                <NPC key={n.ministerId} minister={m} role={n.role} x={n.x} y={n.y} near={near}
                  onTalk={() => setActiveMinisterId(n.ministerId)} />
              );
            })}
            <Player x={pos.x} y={pos.y} dir={dir} />
          </div>

          <div className={`room-mood ${dim ? "dim" : ""} ${tense ? "tense" : ""}`} />

          {!blockedUi && prompt && <div className="room-prompt">▶ {prompt}（Enter）</div>}
          {!blockedUi && !prompt && <div className="room-hint">矢印キー / WASD で移動・Enterで調べる</div>}
        </div>
      </div>

      {activeMinister && (
        <DialogBox
          minister={activeMinister}
          line={dialogLine}
          policies={dialogPolicies}
          extras={dialogExtras}
          onPickPolicy={(p) => { setActiveMinisterId(null); onRequestPolicy(p); }}
          onClose={() => setActiveMinisterId(null)}
        />
      )}

      {!blockedUi && <VirtualDPad onPress={padPress} onRelease={padRelease} onAction={padAction} />}

      {menuOpen && (
        <div className="room-menu-modal" onClick={() => { setMenuOpen(false); setMenuMsg(null); }}>
          <div className="room-menu-card" onClick={(e) => e.stopPropagation()}>
            <h3>メニュー</h3>
            <div className="mission-mini">
              <b>本日の課題</b>
              {missions.length === 0 && <div>（なし）</div>}
              {missions.map((m) => (<div key={m.id}>{m.done ? "✔" : "□"} {m.label}</div>))}
            </div>
            {menuMsg && <div className="mission-mini" style={{ color: "#6fe3a0" }}>{menuMsg}</div>}
            <button type="button" className="dialog-btn" onClick={() => setMenuMsg("この端末に自動保存されています。")}>セーブ（自動保存中）</button>
            <button type="button" className="dialog-btn" onClick={() => onNavigate("ranking")}>順位を見る</button>
            <button type="button" className="dialog-btn close"
              onClick={() => { if (confirm("最初からやり直しますか？（この端末の進行が消えます）")) { clearSave(); location.reload(); } }}>
              はじめからやり直す
            </button>
            <button type="button" className="dialog-btn close" onClick={() => { setMenuOpen(false); setMenuMsg(null); }}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}
