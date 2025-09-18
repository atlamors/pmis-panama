import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { Component } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'settings' },
  { path: 'settings', loadComponent: () => import('./pages/settings.component').then(m => m.SettingsPageComponent) },
  { path: 'scheduling', loadChildren: () => import('scheduling/Module').then(m => m.RemoteRoutes) },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './shell/app.component.html',
  styleUrls: ['./shell/app.component.css'],
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
  ],
}).catch(err => console.error(err));
