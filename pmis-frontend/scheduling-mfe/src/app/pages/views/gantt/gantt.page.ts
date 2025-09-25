// pmis-frontend/scheduling-mfe/src/app/pages/views/gantt/gantt.page.ts

/**
 * GanttPage
 * ----------
 * Minimal vis-timeline integration for the Scheduling MFE.
 *
 * State model:
 * - Operator view state (visible window + focused item) persists in `sessionStorage`.
 * - Deep links are **opt-in** (for collaboration) via `getShareUrl()`; we do not
 *   continuously write URL params during normal use.
 *
 * URL hydration on load:
 * - If `?start&end` (ISO) are present, use them as the visible window.
 * - Else if `?date=YYYY-MM-DD` is present, use a default day window (06:00–18:00).
 * - Else hydrate from `sessionStorage` (if available), otherwise fall back to today 06:00–18:00.
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    ViewChild,
    inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DataSet } from 'vis-data';
import {
    Timeline,
    TimelineOptions,
    DataItem,
    DataGroup,
    IdType,
} from 'vis-timeline/standalone';

/**
 * Persisted operator view state for the Gantt page.
 */
type ViewState = {
    /** Visible window start (ISO string). */
    startISO: string;
    /** Visible window end (ISO string). */
    endISO: string;
    /** Optional selected item id (e.g., 'vessel:123'). */
    focusId?: string;
};

/** sessionStorage key for per-session operator view state. */
const SS_KEY = 'scheduling:gantt:viewstate';

@Component({
    selector: 'app-gantt-page',
    standalone: true,
    templateUrl: './gantt.page.html',
    styleUrls: ['./gantt.page.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttPageComponent implements AfterViewInit, OnDestroy {
    /**
     * Root container element for vis-timeline.
     * Bound in template: `<div #timeline class="timeline-root"></div>`
     */
    @ViewChild('timeline', { static: true }) private timelineEl!: ElementRef<HTMLDivElement>;

    /** Activated route for reading deep-link query params when present. */
    private readonly route = inject(ActivatedRoute);
    /** Router for building collaboration/share URLs. */
    private readonly router = inject(Router);
    /** Zone for any cross-boundary callbacks (not heavily used here). */
    private readonly zone = inject(NgZone);

    /** vis-timeline instance, created in `ngAfterViewInit`. */
    private timeline?: Timeline;
    /** Items dataset used by vis-timeline (both ranges and points). */
    private items = new DataSet<DataItem>([]);
    /** Groups dataset (rows) used by vis-timeline. */
    private groups = new DataSet<DataGroup>([]);

    // --- lifecycle ---

    /**
     * Initialize vis-timeline, hydrate from URL/session, and wire minimal persistence.
     */
    ngAfterViewInit(): void {
        this.seedData();

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

        this.timeline = new Timeline(
            this.timelineEl.nativeElement,
            this.items,
            this.groups,
            options
        );

        // 1) Apply shared link (query) if present; else hydrate from session; else default
        this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((q) => {
            const startQ = q.get('start'); // ISO
            const endQ = q.get('end');   // ISO
            const dateQ = q.get('date');  // YYYY-MM-DD (fallback window)
            const focusQ = q.get('focus'); // e.g. 'vessel:demo-1'

            if (startQ && endQ) {
                this.applyWindow(new Date(startQ), new Date(endQ));
            } else if (dateQ) {
                const [s, e] = this.computeWindow(dateQ);
                this.applyWindow(s, e);
            } else {
                const ss = this.readSession();
                if (ss) {
                    this.applyWindow(new Date(ss.startISO), new Date(ss.endISO));
                    if (ss.focusId && this.items.get(ss.focusId as IdType)) {
                        this.timeline!.setSelection(ss.focusId as IdType);
                        this.timeline!.focus(ss.focusId as IdType);
                    }
                } else {
                    const [s, e] = this.computeWindow(null);
                    this.applyWindow(s, e);
                }
            }

            // Optional focus from query (if provided)
            if (focusQ && this.items.get(focusQ as IdType)) {
                this.timeline!.setSelection(focusQ as IdType);
                this.timeline!.focus(focusQ as IdType);
                this.saveSession({ ...this.currentSession(), focusId: focusQ });
            }
        });

        // 2) Persist user actions to sessionStorage (not URL)
        this.timeline.on('rangechanged', (ev: any) => {
            const startISO = (ev.start as Date).toISOString();
            const endISO = (ev.end as Date).toISOString();
            const prev = this.currentSession();
            this.saveSession({ ...prev, startISO, endISO });
        });

        this.timeline.on('select', (ev: any) => {
            const id = (ev.items?.[0] as IdType | undefined) ?? null;
            const prev = this.currentSession();
            this.saveSession({ ...prev, focusId: (id ?? undefined) as string | undefined });
            // No URL writes — deep links are on-demand only.
        });
    }

    /**
     * Clean up the vis-timeline instance.
     */
    ngOnDestroy(): void {
        this.timeline?.destroy();
    }

    // --- public: build a collab/share URL for the current view ---

    /**
     * Build a shareable deep link for the current view (start/end ISO + optional focus).
     * @returns Absolute URL suitable for sharing with another operator.
     *
     * @example
     * const url = this.getShareUrl();
     * await navigator.clipboard.writeText(url);
     */
    getShareUrl(): string {
        if (!this.timeline) return location.href;

        const range = this.timeline.getWindow();
        const start = (range.start as Date).toISOString();
        const end = (range.end as Date).toISOString();

        const sel = this.timeline.getSelection();
        const focus = sel && sel.length ? String(sel[0]) : undefined;

        const tree = this.router.createUrlTree([], {
            relativeTo: this.route, // under /scheduling/gantt
            queryParams: { start, end, ...(focus ? { focus } : {}) },
            queryParamsHandling: '',
        });
        return location.origin + this.router.serializeUrl(tree);
    }

    // --- helpers ---

    /**
     * Apply a new visible window to the timeline and persist to session state.
     * @param start Window start.
     * @param end Window end.
     */
    private applyWindow(start: Date, end: Date) {
        this.timeline!.setWindow(start, end); // no animation options
        const prev = this.currentSession();
        this.saveSession({ ...prev, startISO: start.toISOString(), endISO: end.toISOString() });
    }

    /**
     * Compute a default window for a given date string.
     * If `dateStr` is provided, returns that day from 06:00–18:00,
     * otherwise computes the same window for today.
     * @param dateStr 'YYYY-MM-DD' or null.
     * @returns Tuple of [start, end] Dates.
     */
    private computeWindow(dateStr: string | null): [Date, Date] {
        const base = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
        const start = new Date(base); start.setHours(6, 0, 0, 0);
        const end = new Date(base); end.setHours(18, 0, 0, 0);
        return [start, end];
    }

    /**
     * Read persisted operator view state from sessionStorage.
     * @returns ViewState or null if absent/invalid.
     */
    private readSession(): ViewState | null {
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
     * Persist operator view state to sessionStorage.
     * @param state The state to save.
     */
    private saveSession(state: ViewState) {
        try {
            sessionStorage.setItem(SS_KEY, JSON.stringify(state));
        } catch {
            /* ignore storage errors */
        }
    }

    /**
     * Return the current session state, or a default if not yet present.
     * @returns Current or default ViewState.
     */
    private currentSession(): ViewState {
        return this.readSession() ?? {
            startISO: this.computeWindow(null)[0].toISOString(),
            endISO: this.computeWindow(null)[1].toISOString(),
        };
    }

    /**
     * Seed initial mock groups/items into the vis DataSets.
     * In Phase 2.2 this is replaced by real entity data (first: Vessel).
     */
    private seedData(): void {
        this.groups.update([
            { id: 'LOCK_A', content: 'Locks A' } as DataGroup,
            { id: 'LOCK_B', content: 'Locks B' } as DataGroup,
            { id: 'CONVOYS', content: 'Convoys' } as DataGroup,
        ]);

        const today = new Date();
        const range = (h1: number, h2: number) => ({
            start: new Date(
                today.getFullYear(), today.getMonth(), today.getDate(),
                Math.floor(h1), (h1 % 1) * 60
            ),
            end: new Date(
                today.getFullYear(), today.getMonth(), today.getDate(),
                Math.floor(h2), (h2 % 1) * 60
            ),
        });

        this.items.update([
            {
                id: 'vessel:demo-1',
                content: 'Ever Nova · 07:00–09:00',
                group: 'LOCK_A',
                className: 'vessel',
                ...range(7, 9),
            } as DataItem,
            {
                id: 'vessel:demo-2',
                content: 'Ocean Star · 10:00–12:30',
                group: 'LOCK_B',
                className: 'vessel',
                ...range(10, 12.5),
            } as DataItem,
        ]);
    }

    /**
     * Copy the current share URL to the clipboard.
     * Falls back to logging if Clipboard API is unavailable.
     */
    async copyShareUrl() {
        const url = this.getShareUrl();
        try {
            await navigator.clipboard.writeText(url);
            // optional: replace with a toast/notification
            console.log('Share URL copied:', url);
        } catch {
            console.log('Share URL:', url); // fallback
        }
    }
}
