import {
    DestroyRef,
    ElementRef,
    Inject,
    Injectable,
    Injector,
    NgZone,
    effect,
    inject,
} from '@angular/core';
import { DataSet } from 'vis-data';
import { DataGroup, DataItem, IdType, Timeline, TimelineOptions } from 'vis-timeline/standalone';
import { GanttFacade } from '../state/gantt.facade';
import { TIMELINE_FACTORY, TimelineFactory } from './timeline.factory';

/**
 * TimelineAdapter — boundary to the vis-timeline library.
 *
 * @public
 * @remarks
 * Responsibilities:
 * - Own vis-timeline creation/destruction and its DataSets.
 * - Mirror façade state → vendor timeline (groups/items/window/focus).
 * - Mirror vendor events → façade (range changes, selection).
 * - Provide background column management for alternating time bands.
 *
 * Lifecycle & perf:
 * - Run vendor work in `runOutsideAngular()` to avoid extra change detection;
 *   re-enter Angular only when pushing back into the façade.
 * - Scope this adapter at the page (component `providers`) so cleanup is deterministic.
 */
@Injectable()
export class TimelineAdapter {
    /** Angular zone for running vendor code outside change detection. */
    private readonly zone = inject(NgZone);
    /** Teardown hook to destroy the vendor timeline on component destroy. */
    private readonly destroyRef = inject(DestroyRef);
    /** Injector for scoping signal `effect`s to this instance. */
    private readonly injector = inject(Injector);

    /** Underlying vis-timeline instance created in {@link init}. */
    private timeline?: Timeline;

    /** DataSets passed to the timeline. */
    private items = new DataSet<DataItem>([]);
    private groups = new DataSet<DataGroup>([]);

    /** IDs of background items we manage (alternating columns). */
    private bgIds: IdType[] = [];

    /**
     * Wire façade ↔ vendor state reactively.
     *
     * @param facade Gantt feature façade (source of truth).
     * @param factory Factory for creating timelines (overridable in tests).
     */
    constructor(
        private facade: GanttFacade,
        @Inject(TIMELINE_FACTORY) private factory: TimelineFactory
    ) {
        // ---- façade → vis ----

        effect(() => {
            const gs = this.facade.groups();
            if (!gs) return;
            this.groups.clear();
            this.groups.add(gs as any);
        }, { injector: this.injector });

        effect(() => {
            const is = this.facade.items();
            if (!is) return;
            // Note: this resets all items; background columns will be re-applied by the plugin.
            this.items.clear();
            this.items.add(is as any);
        }, { injector: this.injector });

        effect(() => {
            const w = this.facade.window();
            if (this.timeline && w) this.timeline.setWindow(w.start, w.end);
        }, { injector: this.injector });

        effect(() => {
            const id = this.facade.focusId();
            if (this.timeline && id) {
                this.timeline.setSelection(id as IdType);
                this.timeline.focus(id as IdType);
            }
        }, { injector: this.injector });
    }

    /**
     * Initialize the vis timeline and wire vendor events → façade.
     *
     * @param el ElementRef of the timeline host element.
     */
    init(el: ElementRef<HTMLDivElement>): void {
        this.zone.runOutsideAngular(() => {
            const options: TimelineOptions = {
                stack: false,
                selectable: true,
                editable: { add: false, updateTime: true, updateGroup: true, remove: false },
                orientation: 'top',
                zoomable: true,
                moveable: true,
                minHeight: '480px',
                maxHeight: '70vh',
                margin: { item: 8, axis: 16 },
            };

            this.timeline = this.factory.create(el.nativeElement, this.items, this.groups, options);

            // ---- vis → façade ----
            this.timeline.on('rangechanged', (e: any) =>
                this.facade.setWindow(e.start as Date, e.end as Date)
            );
            this.timeline.on('select', (e: any) =>
                this.facade.setFocus((e.items?.[0] as string) ?? null)
            );
        });

        this.destroyRef.onDestroy(() => this.timeline?.destroy());
    }

    /**
     * Replace the set of alternating background columns.
     *
     * @param items New background items (must specify `type: 'background'`).
     *
     * @remarks
     * - Previously managed background items are removed before adding the new set.
     * - Foreground items are not affected.
     */
    setBackgroundColumns(items: DataItem[]): void {
        if (this.bgIds.length) {
            this.items.remove(this.bgIds);
            this.bgIds = [];
        }
        if (!items.length) return;
        this.items.add(items);
        this.bgIds = items.map(i => i.id!) as IdType[];
    }
}
