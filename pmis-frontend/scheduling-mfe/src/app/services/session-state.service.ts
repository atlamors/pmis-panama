import { Injectable } from '@angular/core';
import { ViewState } from '@domain/gantt.models';

/**
 * `sessionStorage` key for persisted operator view state.
 * @internal Prefer using {@link SessionStateService} instead of referencing this directly.
 */
const SS_KEY = 'scheduling:gantt:viewstate';

/**
 * Thin, resilient persistence wrapper for operator view state using `sessionStorage`.
 *
 * @public
 * @remarks
 * - Invalid JSON or quota/security issues are swallowed; callers get `null` (read)
 *   or the write is ignored (no throw).
 * - This service stores **view** state only; app state remains server-sourced.
 */
@Injectable({ providedIn: 'root' })
export class SessionStateService {
  /**
   * Read the most recent {@link ViewState} from sessionStorage.
   *
   * @returns `ViewState` if present and well-formed; otherwise `null`.
   */
  read(): ViewState | null {
    try {
      const raw = sessionStorage.getItem(SS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as ViewState;
      if (!parsed.startISO || !parsed.endISO) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Write a {@link ViewState} to sessionStorage.
   *
   * @remarks
   * Errors are swallowed to keep UI responsive in restricted environments.
   */
  write(state: ViewState): void {
    try {
      sessionStorage.setItem(SS_KEY, JSON.stringify(state));
    } catch {
      // ignore storage failures
    }
  }
}
