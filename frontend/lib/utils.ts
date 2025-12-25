/**
 * Session Management Utilities
 * Handles session_id generation and localStorage persistence
 */

const SESSION_KEY = 'session_id';
const SESSION_CREATED_KEY = 'session_created_at';

/**
 * Get or create session ID
 * - Checks localStorage first
 * - Generates new UUID if not found
 * - Stores in localStorage for reuse
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return empty (will be set on client)
    return '';
  }

  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(SESSION_CREATED_KEY, new Date().toISOString());
  }
  
  return sessionId;
}

/**
 * Reset session and reload page
 * Creates a new session ID and clears all session data
 */
export function resetSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_CREATED_KEY);
    window.location.reload();
  }
}

/**
 * Get session metadata
 */
export function getSessionInfo(): { sessionId: string; createdAt: string | null } {
  if (typeof window === 'undefined') {
    return { sessionId: '', createdAt: null };
  }

  return {
    sessionId: getSessionId(),
    createdAt: localStorage.getItem(SESSION_CREATED_KEY),
  };
}

/**
 * Clear session (for testing/reset)
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_CREATED_KEY);
  }
}
