import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { Component } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { loadRemoteRoutes } from './utils/load-remote-routes';


// Main app component
import { AppComponent } from './app/app.component';

// Icons
import {
    heroHome,
    heroBookmark,
    heroUsers,
    heroEnvelope,
    heroCalendar,
    heroBell,
    heroBars3,
    heroViewfinderCircle
} from '@ng-icons/heroicons/outline';

// Routes
const routes: Routes = [
    // Default route
    { path: '', pathMatch: 'full', redirectTo: 'scheduling' },
    // Local routes

    // Remote routes
    {
        path: 'scheduling',
        loadChildren: () =>
            loadRemoteRoutes({
                remoteEntryUrl: 'http://localhost:4201/remoteEntry.js',
                exposedModule: './Module',
                cssManifestPath: 'assets/assets.json',
                cssDevFallback: 'assets/style.css',
                timeoutMs: 8000,
            }),
    },
    // Wildcard route
    { path: '**', redirectTo: '' },
];

// Bootstrap the application
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(
            routes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
        ),
        provideIcons({
            heroHome,
            heroBookmark,
            heroUsers,
            heroEnvelope,
            heroCalendar,
            heroBell,
            heroBars3,
            heroViewfinderCircle,
        }),
    ],
}).catch(err => console.error(err));
