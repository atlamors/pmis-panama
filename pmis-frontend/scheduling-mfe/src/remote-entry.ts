import { Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { GanttPageComponent } from './app/pages/views/gantt/gantt.page';

export const RemoteRoutes: Routes = [
    {
        path: '',
        component: AppComponent, // your shell with <router-outlet>
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'pages/views/gantt' },
            { path: 'pages/views/gantt', component: GanttPageComponent },
        ],
    },
];
