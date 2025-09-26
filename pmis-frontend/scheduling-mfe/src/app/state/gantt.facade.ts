import { Injectable, computed, effect, signal } from '@angular/core';
import { GanttGroup, GanttItem } from '@domain/gantt.models';
import { SessionStateService } from '@services/session-state.service';

/**
 * GanttFacade — single public API for the Scheduling Gantt feature.
 *
 * @public
 * @remarks
 * Responsibilities:
 * - Own domain state (groups/items) and view state (window/focus) via Angular signals.
 * - Hydrate/persist operator view state via {@link SessionStateService}.
 * - Provide minimal, vendor-agnostic actions: {@link setWindow}, {@link setFocus}, {@link setData}.
 *
 * Keep vendor specifics (vis-timeline) out of this layer.
 */
@Injectable({ providedIn: 'root' })
export class GanttFacade {
  /** Current Gantt groups (rows). */
  readonly groups = signal<GanttGroup[]>([]);
  /** Current Gantt items (ranges/points). */
  readonly items = signal<GanttItem[]>([]);

  /** Visible window start; `null` until initialized. */
  readonly windowStart = signal<Date | null>(null);
  /** Visible window end; `null` until initialized. */
  readonly windowEnd = signal<Date | null>(null);
  /** Selected (focused) item id; `null` if none. */
  readonly focusId = signal<string | null>(null);

  /** Derived `{ start, end }` once both ends exist; else `null`. */
  readonly window = computed(() => {
    const s = this.windowStart();
    const e = this.windowEnd();
    return s && e ? { start: s, end: e } : null;
  });

  /**
   * Construct the façade; hydrates view state and wires persistence.
   *
   * @param ss Session persistence service for operator view state.
   */
  constructor(private ss: SessionStateService) {
    // Hydrate (once) from session.
    const vs = ss.read();
    if (vs) {
      this.windowStart.set(new Date(vs.startISO));
      this.windowEnd.set(new Date(vs.endISO));
      this.focusId.set(vs.focusId ?? null);
    }

    // Persist on change.
    effect(() => {
      const s = this.windowStart();
      const e = this.windowEnd();
      const f = this.focusId();
      if (s && e) {
        this.ss.write({
          startISO: s.toISOString(),
          endISO: e.toISOString(),
          focusId: f ?? undefined,
        });
      }
    });
  }

  /** Set the visible time window. */
  setWindow(start: Date, end: Date): void {
    this.windowStart.set(start);
    this.windowEnd.set(end);
  }

  /** Focus a specific item or clear focus. */
  setFocus(id: string | null): void {
    this.focusId.set(id);
  }

  /** Replace the current groups and items (prefer full replacement to mutation). */
  setData(groups: GanttGroup[], items: GanttItem[]): void {
    this.groups.set(groups);
    this.items.set(items);
  }
}
