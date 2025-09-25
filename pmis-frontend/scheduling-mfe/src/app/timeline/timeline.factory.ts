import { InjectionToken } from '@angular/core';
import { DataSet } from 'vis-data';
import { Timeline, TimelineOptions, DataGroup, DataItem } from 'vis-timeline/standalone';

/**
 * Factory interface for producing vis-timeline instances.
 *
 * @public
 * @remarks
 * Abstracting timeline creation makes the adapter trivial to test:
 * in tests, provide a stub factory that returns a spy/stub instead
 * of constructing the real vendor timeline.
 */
export interface TimelineFactory {
    /**
     * Create a timeline.
     *
     * @param el Host element to render into.
     * @param items Items DataSet.
     * @param groups Groups DataSet.
     * @param options vis-timeline options.
     */
    create(
        el: HTMLElement,
        items: DataSet<DataItem>,
        groups: DataSet<DataGroup>,
        options: TimelineOptions
    ): Timeline;
}

/**
 * DI token for resolving a {@link TimelineFactory}.
 *
 * @public
 */
export const TIMELINE_FACTORY = new InjectionToken<TimelineFactory>('TIMELINE_FACTORY');

/**
 * Default provider that constructs a real vis-timeline instance.
 *
 * @public
 * @remarks
 * Use this provider in production. In tests, override {@link TIMELINE_FACTORY}.
 */
export const DEFAULT_TIMELINE_FACTORY_PROVIDER = {
    provide: TIMELINE_FACTORY,
    useValue: {
        create: (el, items, groups, options) => new Timeline(el, items, groups, options),
    } as TimelineFactory,
};
