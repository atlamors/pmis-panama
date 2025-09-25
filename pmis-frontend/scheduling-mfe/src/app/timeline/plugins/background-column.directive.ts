import { Directive, Input, effect, inject } from '@angular/core';
import { DataItem } from 'vis-timeline/standalone';
import { GanttFacade } from '../../state/gantt.facade';
import { TimelineAdapter } from '../timeline.adapter';

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
     * Column width in **hours**.
     * @defaultValue 1
     */
    @Input() stepHours = 1;

    private readonly facade = inject(GanttFacade);
    private readonly adapter = inject(TimelineAdapter);

    /**
     * Reactively rebuild columns whenever the visible window changes.
     */
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
            });
            idx++;
        }

        return out;
    }
}
