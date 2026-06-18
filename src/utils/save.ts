/**
 * ゲームの進行状況を「この端末のブラウザ」に保存・復元する。
 * バックエンド不要。リロードしても続きから遊べる。
 * （アカウントで端末をまたいで保存したい場合は将来Supabase等を追加）
 */
const KEY = "kokka-save-v1";

export type SaveData = Record<string, unknown>;

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SaveData) : null;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* 容量超過やプライベートモード等では黙って無視 */
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(KEY) != null;
  } catch {
    return false;
  }
}
