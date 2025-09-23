import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-gantt-page',
    standalone: true,
    templateUrl: './gantt.page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttPageComponent { }