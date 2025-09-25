import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GanttFacade } from '../../../state/gantt.facade';
import { GanttGroup, GanttItem } from '../../../domain/gantt.models';

import { TimelineAdapter } from '../../../timeline/timeline.adapter';
import { DEFAULT_TIMELINE_FACTORY_PROVIDER } from '../../../timeline/timeline.factory';
import { BackgroundColumnsDirective } from '../../../timeline/plugins/background-columns.directive';

/**
 * GanttPageComponent — thin container for the Scheduling Gantt view.
 *
 * @public
 * @remarks
 * - Delegates state to {@link GanttFacade}, vendor lifecycle to {@link TimelineAdapter},
 *   and composable visual behavior to directives (e.g., {@link BackgroundColumnsDirective}).
 * - Deep links are generated **on demand** (Share action); normal interactions do not churn the URL.
 * - Operator view state is persisted to `sessionStorage` by the façade.
 */
@Component({
    selector: 'app-gantt-page',
    standalone: true,
    templateUrl: './gantt.page.html',
    styleUrls: ['./gantt.page.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BackgroundColumnsDirective],
    providers: [
        TimelineAdapter,                   // Adapter scoped to the page lifecycle
        DEFAULT_TIMELINE_FACTORY_PROVIDER, // Real vis Timeline factory; override in tests if needed
    ],
})
export class GanttPageComponent implements AfterViewInit {
    /**
     * Host element for the vis timeline; initialized by the adapter.
     */
    @ViewChild('timeline', { static: true }) private timelineEl!: ElementRef<HTMLDivElement>;

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly facade = inject(GanttFacade);
    private readonly adapter = inject(TimelineAdapter);

    /**
     * Initialize the timeline, seed demo data, and hydrate view state from deep link if present.
     */
    ngAfterViewInit(): void {
        // Initialize vis via the adapter.
        this.adapter.init(this.timelineEl);

        // Seed temporary demo data. Replace with real data loading in Phase 2.2.
        const groups: GanttGroup[] = [
            { id: 'LOCK_A', content: 'Locks A' },
            { id: 'LOCK_B', content: 'Locks B' },
            { id: 'CONVOYS', content: 'Convoys' },
        ];
        const today = new Date();
        const range = (h1: number, h2: number) => ({
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), Math.floor(h1), (h1 % 1) * 60),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), Math.floor(h2), (h2 % 1) * 60),
        });
        const items: GanttItem[] = [
            { id: 'vessel:demo-1', content: 'Ever Nova · 07:00–09:00', group: 'LOCK_A', className: 'vessel', ...range(7, 9) },
            { id: 'vessel:demo-2', content: 'Ocean Star · 10:00–12:30', group: 'LOCK_B', className: 'vessel', ...range(10, 12.5) },
        ];
        this.facade.setData(groups, items);

        // Hydrate from deep link (?start&end or ?date) or fall back to default 06:00–18:00 window.
        this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((q) => {
            const startQ = q.get('start'); // ISO
            const endQ = q.get('end');   // ISO
            const dateQ = q.get('date');  // YYYY-MM-DD
            const focusQ = q.get('focus'); // optional item id

            if (startQ && endQ) {
                this.facade.setWindow(new Date(startQ), new Date(endQ));
            } else if (dateQ) {
                const [s, e] = this.computeWindow(dateQ);
                this.facade.setWindow(s, e);
            } else if (!this.facade.window()) {
                const [s, e] = this.computeWindow(null);
                this.facade.setWindow(s, e);
            }

            if (focusQ) this.facade.setFocus(focusQ);
        });
    }

    /**
     * Build a shareable deep link for the current view (start/end/focus).
     *
     * @returns Absolute URL that reproduces the same visible window and selection.
     */
    getShareUrl(): string {
        const w = this.facade.window();
        const f = this.facade.focusId();
        const start = w?.start.toISOString();
        const end = w?.end.toISOString();

        const tree = this.router.createUrlTree([], {
            relativeTo: this.route,
            queryParams: { ...(start && end ? { start, end } : {}), ...(f ? { focus: f } : {}) },
            queryParamsHandling: '',
        });
        return location.origin + this.router.serializeUrl(tree);
    }

    /**
     * Copy the current share URL to the clipboard.
     * Falls back to logging when the Clipboard API is unavailable.
     */
    async copyShareUrl(): Promise<void> {
        const url = this.getShareUrl();
        try {
            await navigator.clipboard.writeText(url);
            console.log('Share URL copied:', url);
        } catch {
            console.log('Share URL:', url);
        }
    }

    /**
     * Compute a default visible window for a given date or for today.
     *
     * @param dateStr `'YYYY-MM-DD'` or `null` for today.
     * @returns A tuple `[start, end]` covering 06:00–18:00 local time.
     */
    private computeWindow(dateStr: string | null): [Date, Date] {
        const base = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
        const start = new Date(base); start.setHours(6, 0, 0, 0);
        const end = new Date(base); end.setHours(18, 0, 0, 0);
        return [start, end];
    }
}
