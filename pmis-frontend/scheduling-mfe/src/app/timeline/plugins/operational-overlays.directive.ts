import { Directive, effect, inject, input } from '@angular/core';
import { DataItem } from 'vis-timeline/standalone';
import { TimelineAdapter } from '@timeline/timeline.adapter';
import { GanttFacade } from '@state/gantt.facade';

/**
 * Input model for a scheduled maintenance overlay.
 * Renders as a red, non-interactive background span for a single row.
 */
export interface MaintenanceOverlayInput {
    /** Start time of maintenance window. */
    at: Date;
    /** Target row/group id (e.g., 'locks-a'). */
    groupId: string;
    /** Optional duration in minutes (default: 60). */
    durationMinutes?: number;
    /** Optional label shown inside the overlay (default: 'Lock maintenance'). */
    label?: string;
    /** Optional tooltip. */
    title?: string;
}

/**
 * Input model for a tide-sensitive window (muted background period).
 * Can span a single row (with groupId) or all rows (without).
 */
export interface TideWindowInput {
    start: Date;
    end: Date;
    /** Optional target row/group id; omit to span all rows. */
    groupId?: string;
    /** Visible label or icon text. */
    label?: string;
    /** Optional tooltip. */
    title?: string;
}

/**
 * Supported alert kinds for lane-level signals.
 */
export type AlertKind = 'capacity' | 'lowWater' | 'safety';

/**
 * Input model for a transient alert marker/range.
 * Use `type:'range'` to render as a normal item within a specific lane.
 */
export interface AlertOverlayInput {
    start: Date;
    end: Date;
    kind: AlertKind;
    /** Optional target row/group id; omit to place on a designated alerts lane. */
    groupId?: string;
    /** Optional label/icon content (kept non-interactive). */
    label?: string;
    /** Optional tooltip. */
    title?: string;
}

/**
 * Directive that translates **domain overlay inputs** into vis-timeline items,
 * using the TimelineAdapter’s DataSet. This replaces the earlier hour-stripe
 * generator; it does **not** listen to pan/zoom. Overlays are purely data-driven.
 *
 * Provide this directive on the same element as the timeline host.
 *
 * Example:
 * ```html
 * <div
 *   #timeline
 *   class="timeline-root"
 *   ganttOperationalOverlays
 *   [maintenance]="{ at: new Date('2025-09-25T13:00:00'), groupId: 'locks-a' }"
 *   [tides]="[]"
 *   [alerts]="[]">
 * </div>
 * ```
 */
@Directive({
    selector: '[ganttOperationalOverlays]',
    standalone: true,
})
export class OperationalOverlaysDirective {
    /** Adapter resolved from the timeline host scope; owns the shared DataSet. */
    private readonly adapter = inject(TimelineAdapter);
    private readonly facade = inject(GanttFacade);

    /**
     * Master toggle for all overlays.
     * When false, clears overlays and renders none.
     * Defaults to true.
     */
    readonly overlayEnabled = input<boolean>(true);

    /**
     * Single-row maintenance window (red background) like "Lock A maintenance".
     * If provided, an overlay will be rendered for `durationMinutes` (default 60).
     */
    public readonly maintenance = input<MaintenanceOverlayInput | null>(null);

    /**
     * Array of tide windows rendered as muted background spans (blue tint by CSS).
     * Omit `groupId` to span all rows; set `groupId` to constrain to a single row.
     */
    public readonly tides = input<TideWindowInput[]>([]);

    /**
     * Array of lane-level alerts (capacity, low water, safety). Typically rendered
     * as `type:'range'` items within a specific group/lane.
     */
    public readonly alerts = input<AlertOverlayInput[]>([]);

    /**
     * Sets up a reactive effect that regenerates overlays whenever the inputs change.
     * The effect:
     *  - Builds `DataItem[]` for maintenance/tide windows (as background items).
     *  - Builds `DataItem[]` for alerts (as range items).
     *  - Replaces existing overlays via `adapter.setOverlays(...)`.
     *
     * The effect’s lifetime is bound to the directive’s Angular destroy scope.
     */
    constructor() {
        effect(() => {
            const enabled = this.overlayEnabled();
            // Touch facade.items() so we re-apply overlays after item refreshes
            // (the value is unused; we only depend on identity changes).
            this.facade.items();

            if (!enabled) {
                this.adapter.clearOperationalOverlays?.();
                return;
            }

            const overlays: DataItem[] = [];

            // Maintenance window → red background on a specific row
            const m = this.maintenance();
            if (m) {
                const start = new Date(m.at);
                const minutes = m.durationMinutes ?? 60;
                const end = new Date(+start + minutes * 60_000);
                overlays.push({
                    id: `overlay:maint:${+start}:${m.groupId}`,
                    type: 'background',
                    group: m.groupId,
                    start,
                    end,
                    className: 'bg-maintenance',
                    content: m.label ?? 'Lock maintenance',
                    editable: false,
                    selectable: false,
                });
            }

            // Tide windows → soft blue background, optional per-row
            for (const t of this.tides()) {
                overlays.push({
                    id: `overlay:tide:${+t.start}:${t.groupId ?? 'all'}`,
                    type: 'background',
                    ...(t.groupId ? { group: t.groupId } : {}),
                    start: t.start,
                    end: t.end,
                    className: 'bg-tide',
                    content: '',
                    editable: false,
                    selectable: false,
                });
            }

            // Alerts → lane-level ranges with semantic class
            for (const a of this.alerts()) {
                overlays.push({
                    id: `overlay:${a.kind}:${+a.start}:${a.groupId ?? 'default'}`,
                    type: 'range',
                    ...(a.groupId ? { group: a.groupId } : {}),
                    start: a.start,
                    end: a.end,
                    className: `alert-${a.kind}`,
                    content: a.label ?? '',
                    editable: false,
                    selectable: false,
                });
            }

            this.adapter.setOperationalOverlays(overlays);
        });
    }
}
