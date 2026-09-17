import type { GenerationRequest, GenerationResult, StoredSession } from "@/types";

/**
 * Sessions are persisted to localStorage for now so results are shareable
 * within the same browser via /generate/[sessionId]. Swapping this for a
 * real database later only means replacing these two functions with fetch
 * calls to a `sessions` table/collection keyed by sessionId — no callers
 * would need to change.
 */

const STORAGE_PREFIX = "bearai:session:";

export function saveSession(
  sessionId: string,
  request: GenerationRequest,
  result: GenerationResult,
): void {
  if (typeof window === "undefined") return;
  const session: StoredSession = {
    sessionId,
    createdAt: new Date().toISOString(),
    request,
    result,
  };
  try {
    window.localStorage.setItem(STORAGE_PREFIX + sessionId, JSON.stringify(session));
  } catch {
    // localStorage unavailable or full — non-fatal, sharing simply won't persist.
  }
}

export function loadSession(sessionId: string): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + sessionId);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}
