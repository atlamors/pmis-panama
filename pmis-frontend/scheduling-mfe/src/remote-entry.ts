import { Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { GanttPageComponent } from './app/pages/views/gantt/gantt.page';

/**
 * Exposes the remote routes for the host to consume via Module Federation.
 * Default path renders the `AppComponent` shell with nested routes.
 */
export const RemoteRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./app/app.component').then(m => m.AppComponent), // your shell with <router-outlet>
        children: [
            // Default route:
            { path: '', pathMatch: 'full', redirectTo: 'gantt' },
      
            // Preferred, clean path used by host deep links:
            { path: 'gantt', component: GanttPageComponent },
      
            // Safety net so refreshes never 404:
            { path: '**', redirectTo: '' },
          ],
    },
];
