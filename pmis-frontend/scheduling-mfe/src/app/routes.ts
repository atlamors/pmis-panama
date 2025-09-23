import { Routes } from '@angular/router';
import { GanttPageComponent } from './pages/views/gantt/gantt.page';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'pages/views/gantt' },
    { path: 'pages/views/gantt', component: GanttPageComponent },
    // Add more routes here
];