import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "./room/room.css";
import { TileMap } from "./room/TileMap";
import { Player } from "./room/Player";
import { NPC } from "./room/NPC";
import { DialogBox, type DialogExtra } from "./room/DialogBox";
import { VirtualDPad } from "./room/VirtualDPad";
import { RoomStatusBar } from "./room/RoomStatusBar";
import {
  COLS, ROWS, DIR_VEC, baseObjects, npcSpots, playerStart, decorSlots,
  type Dir,
} from "../data/roomLayout";
import { getTheme } from "../data/roomThemes";
import type { ThemeDecor } from "../data/roomThemes";
import { getMinister } from "../data/ministers";
import { clearSave } from "../utils/save";
import { legacyScore, rankFor } from "../utils/score";
import type { GameMode, NationStats, PlayerNation, Policy } from "../types/game";
import type { Mission } from "../data/missions";

type Props = {
  countryId: string;
  nation: PlayerNation;
  stats: NationStats;
  /** その時代に実行できる政策（時代フィルタ済み） */
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
  const [dir, setDir] = useState<Dir>("up");
  const [activeMinisterId, setActiveMinisterId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMsg, setMenuMsg] = useState<string | null>(null);
  const pressed = useRef<Dir[]>([]);

  const blockedUi = activeMinisterId !== null || menuOpen;

  // 通行不可タイル（壁＋家具＋NPC）
  const blocked = useMemo(() => {
    const s = new Set<string>();
    for (let x = 0; x < COLS; x++) { s.add(`${x},0`); s.add(`${x},${ROWS - 1}`); }
    for (let y = 0; y < ROWS; y++) { s.add(`0,${y}`); s.add(`${COLS - 1},${y}`); }
    for (const o of baseObjects) {
      if (o.solid === false) continue;
      for (let dx = 0; dx < (o.w ?? 1); dx++)
        for (let dy = 0; dy < (o.h ?? 1); dy++) s.add(`${o.x + dx},${o.y + dy}`);
    }
    for (const n of npcSpots) s.add(`${n.x},${n.y}`);
    return s;
  }, []);

  // 会話処理（目の前のNPCに話しかける）
  function interactAt(p: { x: number; y: number }, d: Dir) {
    const f = { x: p.x + DIR_VEC[d].dx, y: p.y + DIR_VEC[d].dy };
    const spot = npcSpots.find((n) => n.x === f.x && n.y === f.y);
    if (spot) setActiveMinisterId(spot.ministerId);
  }

  // キーボード操作
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (blockedUi) return;
      const k = e.key;
      if (k === "Enter" || k === " " || k === "z" || k === "Z") {
        e.preventDefault();
        interactAt(pos, dir);
        return;
      }
      const nd = KEY_DIR[k];
      if (nd) {
        e.preventDefault();
        if (!pressed.current.includes(nd)) pressed.current.push(nd);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const nd = KEY_DIR[e.key];
      if (nd) pressed.current = pressed.current.filter((x) => x !== nd);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [pos, dir, blockedUi]);

  // 移動ステッパー（ポケモン風のグリッド移動）
  useEffect(() => {
    const id = setInterval(() => {
      if (blockedUi) return;
      const d = pressed.current[pressed.current.length - 1];
      if (!d) return;
      setDir(d);
      setPos((p) => {
        const t = { x: p.x + DIR_VEC[d].dx, y: p.y + DIR_VEC[d].dy };
        if (t.x < 1 || t.x > COLS - 2 || t.y < 1 || t.y > ROWS - 2) return p;
        if (blocked.has(`${t.x},${t.y}`)) return p;
        return t;
      });
    }, 145);
    return () => clearInterval(id);
  }, [blocked, blockedUi]);

  // 仮想パッド
  const padPress = (d: Dir) => { if (!pressed.current.includes(d)) pressed.current.push(d); };
  const padRelease = (d: Dir) => { pressed.current = pressed.current.filter((x) => x !== d); };
  const padAction = () => { if (!blockedUi) interactAt(pos, dir); };

  // 国家状態に応じた動的装飾
  const dynamicDecor = useMemo<ThemeDecor[]>(() => {
    const out: ThemeDecor[] = [];
    const [s0, s1, s2] = decorSlots;
    if (stats.approval >= 65) out.push({ label: "祝いの花", emoji: "🌷", ...s0 });
    else if (stats.approval < 35) out.push({ label: "抗議の張り紙", emoji: "✊", ...s0 });
    if (stats.budget < 25) out.push({ label: "古びた設備", emoji: "📦", ...s1 });
    else if (stats.approval >= 65) out.push({ label: "勲章", emoji: "🎖️", ...s1 });
    if (stats.military >= 65) out.push({ label: "作戦地図", emoji: "🗺️", ...s2 });
    else if (stats.happiness < 40) out.push({ label: "散らかった新聞", emoji: "📰", ...s2 });
    return out;
  }, [stats.approval, stats.budget, stats.military, stats.happiness]);

  const decor = useMemo(() => [...theme.decor, ...dynamicDecor], [theme, dynamicDecor]);

  const dim = stats.budget < 25 || stats.approval < 35;
  const tense = stats.military >= 65;

  const score = legacyScore(stats, dayCount);
  const rank = rankFor(score);

  // 「次の一手」アドバイザー：最も緊急の課題を提示し、担当大臣へ誘導
  const advisor = useMemo(() => {
    if (stats.budget < 20) return { ministerId: "finance", text: "財政が危険水域です。財務大臣に相談を。", urgent: true };
    if (stats.approval < 35) return { ministerId: "chief", text: "支持率が低下しています。打開策が必要です。", urgent: true };
    if (stats.trust < 35) return { ministerId: "foreign", text: "外交信用が落ちています。関係修復を。", urgent: true };
    if (stats.happiness < 40) return { ministerId: "welfare", text: "国民の暮らしに不満。生活を支える政策を。", urgent: true };
    if (stats.military < 30) return { ministerId: "defense", text: "国防が手薄です。守りの強化を検討。", urgent: false };
    if (stats.technology < 40) return { ministerId: "education", text: "技術で後れ気味。教育・研究への投資を。", urgent: false };
    return null;
  }, [stats.budget, stats.approval, stats.trust, stats.happiness, stats.military, stats.technology]);
  const advisorMinister = advisor ? getMinister(advisor.ministerId) : null;

  const boardStyle = {
    aspectRatio: `${COLS} / ${ROWS}`,
    ["--room-wall" as string]: theme.wall,
    ["--room-floor" as string]: theme.floor,
    ["--room-floorAlt" as string]: theme.floorAlt,
    ["--room-accent" as string]: theme.accent,
    ["--room-furniture" as string]: theme.furniture,
    ["--flag-grad" as string]: `linear-gradient(135deg, ${nation.flagPrimary} 0 45%, #f4f1e8 45% 55%, ${nation.flagAccent} 55% 100%)`,
  } as CSSProperties;

  const activeMinister = activeMinisterId ? getMinister(activeMinisterId) : null;

  // 会話の内容（政策＋特別アクション）
  const dialogPolicies = activeMinister
    ? policies.filter((p) => activeMinister.fields.includes(p.field))
    : [];
  const dialogExtras: DialogExtra[] = [];
  let dialogLine = activeMinister ? activeMinister.line(stats, year) : "";
  if (activeMinister?.id === "foreign") {
    dialogExtras.push({
      label: "外交画面を開く", sub: "首脳会談・貿易・制裁・支援",
      onClick: () => { setActiveMinisterId(null); onNavigate("map"); },
    });
  }
  if (activeMinister?.id === "chief") {
    const done = missions.filter((m) => m.done).length;
    const next = missions.find((m) => !m.done);
    dialogLine = `${activeMinister.line(stats, year)} 本日の課題は ${done}/${missions.length} 達成。${next ? `次は「${next.label}」。` : ""}`;
    dialogExtras.push({ label: "翌年へ進む", sub: "1年すすめる", primary: true, onClick: () => { setActiveMinisterId(null); onNextTurn(); } });
    dialogExtras.push({ label: "順位を見る", sub: "各国とくらべる", onClick: () => { setActiveMinisterId(null); onNavigate("ranking"); } });
  }

  return (
    <div className="room-screen">
      <RoomStatusBar year={year} eraShort={eraShort} dayCount={dayCount} level={level} stats={stats} score={score} rank={rank} />

      {advisor && advisorMinister && (
        <button
          type="button"
          className={`room-advisor ${advisor.urgent ? "urgent" : ""}`}
          onClick={() => setActiveMinisterId(advisor.ministerId)}
        >
          <span className="room-advisor-emoji">{advisor.urgent ? "⚠️" : "💡"}</span>
          <span className="room-advisor-text">{advisor.text}</span>
          <span className="room-advisor-go">{advisorMinister.title}へ ▶</span>
        </button>
      )}

      <div className="room-board-wrap">
        <div className="room-board" style={boardStyle}>
          <div className="room-actions">
            <button type="button" className="room-next-btn" onClick={onNextTurn}>▶ 翌年へ進む</button>
            <button type="button" className="room-menu-btn" onClick={() => setMenuOpen(true)}>☰ メニュー</button>
          </div>
          <TileMap objects={baseObjects} decor={decor} />

          <div className="room-layer">
            {npcSpots.map((n) => {
              const m = getMinister(n.ministerId);
              if (!m) return null;
              const near = Math.abs(n.x - pos.x) + Math.abs(n.y - pos.y) === 1;
              return (
                <NPC key={n.ministerId} minister={m} x={n.x} y={n.y} near={near}
                  onTalk={() => setActiveMinisterId(n.ministerId)} />
              );
            })}
            <Player x={pos.x} y={pos.y} dir={dir} />
          </div>

          <div className={`room-mood ${dim ? "dim" : ""} ${tense ? "tense" : ""}`} />

          {!blockedUi && (
            <div className="room-hint">矢印キー / WASD で移動、Enter または大臣をタップで会話</div>
          )}
        </div>
      </div>

      {/* 会話ウィンドウ */}
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

      {/* 仮想十字キー（スマホ） */}
      {!blockedUi && (
        <VirtualDPad onPress={padPress} onRelease={padRelease} onAction={padAction} />
      )}

      {/* メニュー */}
      {menuOpen && (
        <div className="room-menu-modal" onClick={() => { setMenuOpen(false); setMenuMsg(null); }}>
          <div className="room-menu-card" onClick={(e) => e.stopPropagation()}>
            <h3>メニュー</h3>
            <div className="mission-mini">
              <b>本日の課題</b>
              {missions.length === 0 && <div>（なし）</div>}
              {missions.map((m) => (
                <div key={m.id}>{m.done ? "✔" : "□"} {m.label}</div>
              ))}
            </div>
            {menuMsg && <div className="mission-mini" style={{ color: "#6fe3a0" }}>{menuMsg}</div>}
            <button type="button" className="dialog-btn" onClick={() => setMenuMsg("この端末に自動保存されています。")}>セーブ（自動保存中）</button>
            <button type="button" className="dialog-btn" onClick={() => onNavigate("market")}>市場を見る</button>
            <button type="button" className="dialog-btn" onClick={() => onNavigate("news")}>ニュースを見る</button>
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
