import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';

/**
 * Bootstraps the Scheduling MFE when running standalone (without the host shell).
 */
export function bootstrap() {
    // Minimal bootstrap for running the remote by itself
    return bootstrapApplication(AppComponent, {
        providers: [provideRouter(routes)],
    });
}