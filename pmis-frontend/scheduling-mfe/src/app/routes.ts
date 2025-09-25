import { Routes } from '@angular/router';
import { GanttPageComponent } from './pages/views/gantt/gantt.page';

/**
 * Standalone routes used when running the remote independently (no host shell).
 */
export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'pages/views/gantt' },
    { path: 'pages/views/gantt', component: GanttPageComponent },
    // Add more routes here
];