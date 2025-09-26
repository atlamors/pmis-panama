import { Directive, Input, effect, inject, numberAttribute } from '@angular/core';
import { DataItem } from 'vis-timeline/standalone';
import { GanttFacade } from '@state/gantt.facade';
import { TimelineAdapter } from '@timeline/timeline.adapter';

/**
 * Attribute directive that renders **alternating background time columns**.
 *
 * @public
 * @example
 * <div
 *   #timeline
 *   class="timeline-root"
 *   ganttBackgroundColumns
 *   [stepHours]="1">
 * </div>
 *
 * @remarks
 * - Background bands are created as vis `DataItem`s with `type: 'background'`.
 * - Class names alternate between `bg-col-odd` and `bg-col-even` for CSS styling.
 * - The set is rebuilt whenever the façade window changes.
 */
@Directive({
    selector: '[ganttBackgroundColumns]',
    standalone: true,
})
export class BackgroundColumnsDirective {
    /**
     * Column width in hours — preferred binding via the selector alias:
     *
     *   <div [ganttBackgroundColumns]="2">
     *
     * Also supported for ergonomics:
     *
     *   <div [stepHours]="2">
     *
     * Notes:
     * - Both inputs are optional; when neither is provided, the effective value defaults to 1.
     * - Values are coerced to numbers via Angular’s input transform and validated to be > 0.
     */
    @Input({ alias: 'ganttBackgroundColumns', transform: numberAttribute })
    ganttBackgroundColumns: number | null = null;

    /**
     * Alternative input name for the same concept as {@link ganttBackgroundColumns}.
     * Use either `[stepHours]` or `[ganttBackgroundColumns]` — whichever reads better at call sites.
     */
    @Input({ transform: numberAttribute })
    stepHours: number = 1;

    /**
     * The validated, effective column width in hours used by the directive’s logic.
     *
     * Resolution order:
     *  1) `stepHours` when defined and valid
     *  2) `ganttBackgroundColumns` when defined and valid
     *  3) Fallback to `1`
     */
    private get effectiveStepHours(): number {
        const pick = this.stepHours ?? this.ganttBackgroundColumns ?? 1;
        const n = typeof pick === 'number' ? pick : Number(pick);
        return Number.isFinite(n) && n > 0 ? n : 1;
    }

    private readonly facade = inject(GanttFacade);
    private readonly adapter = inject(TimelineAdapter);

    /** Reactively rebuild columns whenever the visible window changes. */
    constructor() {
        effect(() => {
            const w = this.facade.window();
            if (!w) return;
            const items = this.buildColumns(w.start, w.end, this.stepHours);
            this.adapter.setBackgroundColumns(items);
        });
    }

    /**
     * Build background column items spanning `[start, end)`.
     *
     * @param start Inclusive window start.
     * @param end Exclusive window end.
     * @param stepHours Column width in hours.
     * @returns Array of vis `DataItem`s with `type: 'background'`.
     */
    private buildColumns(start: Date, end: Date, stepHours: number): DataItem[] {
        const out: DataItem[] = [];
        return out;
        /**
         * Temporary disable background columns until we can refacor into opererational overlays.
         */
        
        // Align to the hour boundary for crisp banding.
        const s = new Date(start);
        s.setMinutes(0, 0, 0);

        const step = stepHours * 3_600_000; // hours → ms
        let idx = 0;

        for (let t = +s; t < +end; t += step) {
            const colStart = new Date(t);
            const colEnd = new Date(Math.min(t + step, +end));
            out.push({
                id: `bgcol:${colStart.toISOString()}`,
                start: colStart,
                end: colEnd,
                type: 'background',
                className: idx % 2 === 0 ? 'bg-col-odd' : 'bg-col-even',
                /** Required by vis DataItem; empty content is fine for background bands. */
                content: '',
                selectable: false,
                editable: false,
                
            });
            idx++;
        }

        return out;
    }
}
