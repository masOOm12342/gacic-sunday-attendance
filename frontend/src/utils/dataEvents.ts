/**
 * Lightweight event bus for cross-component data synchronization.
 *
 * When any component mutates data (add/delete/transfer a visitor, register a member,
 * record attendance), it calls the appropriate `emit*` function.
 *
 * Other components that display that data subscribe via `on*` and re-fetch when
 * the event fires — ensuring all tabs stay in sync without polling.
 */

export type DataEvent =
  | 'visitors:changed'   // visitor added, deleted, or transferred
  | 'members:changed'    // member registered or modified
  | 'attendance:changed' // attendance scanned
  | 'dashboard:refresh'; // generic "refresh everything"

// ── Fire ─────────────────────────────────────────────────────
export function emitDataEvent(event: DataEvent) {
  window.dispatchEvent(new CustomEvent(event));
  // Also always fire a dashboard refresh so the overview KPIs stay current
  if (event !== 'dashboard:refresh') {
    window.dispatchEvent(new CustomEvent('dashboard:refresh'));
  }
}

// ── Subscribe / Unsubscribe ──────────────────────────────────
export function onDataEvent(event: DataEvent, handler: () => void) {
  window.addEventListener(event, handler);
  return () => window.removeEventListener(event, handler);
}
