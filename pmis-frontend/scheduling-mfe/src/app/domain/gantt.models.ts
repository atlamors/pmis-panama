/**
 * Domain models used by the Scheduling MFE.
 *
 * @remarks
 * Keep these simple and vendor-agnostic. They define the contract shared
 * by UI, state (facade), and adapter layers. Do not include vis-timeline
 * or backend-specific shapes here.
 */

/** Canonical identifier for any entity on the timeline. */
export type GanttId = string;

/**
 * A logical row on the Gantt chart.
 *
 * @public
 */
export interface GanttGroup {
    /** Unique group (row) identifier (e.g., 'LOCK_A', 'CONVOYS'). */
    id: GanttId;
    /** Label rendered in the left label column. */
    content: string;
}

/**
 * A schedulable item (range or point) on the timeline.
 *
 * @public
 * @remarks
 * - `start`/`end` accept `Date` or ISO string.
 * - Omit `end` for point/instant items.
 * - `className` enables CSS hooks (e.g., `.vessel`).
 */
export interface GanttItem {
    /** Stable unique identifier (e.g., 'vessel:demo-1'). */
    id: GanttId;
    /** Human-readable label shown inside the item. */
    content: string;
    /** Start instant (inclusive). */
    start: Date | string;
    /** End instant (exclusive). Omit for point items. */
    end?: Date | string;
    /** Group (row) id. Items without a group render ungrouped. */
    group?: GanttId;
    /** Optional CSS class for styling (e.g., 'vessel'). */
    className?: string;
}

/**
 * Operator view state persisted per session.
 *
 * @remarks
 * View state is strictly client-side (sessionStorage). Domain data comes from the server.
 */
export interface ViewState {
    /** Visible window start in ISO 8601 format. */
    startISO: string;
    /** Visible window end in ISO 8601 format. */
    endISO: string;
    /** Optional selected item id. */
    focusId?: GanttId;
}
