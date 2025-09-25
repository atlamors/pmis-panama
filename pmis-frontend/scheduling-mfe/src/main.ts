import 'zone.js';
import { initFederation } from '@angular-architects/module-federation';

/**
 * Entry point for the remote. Initializes module federation, then bootstraps the app.
 */
initFederation({})
    .then(() => import('./bootstrap'))
    .catch(err => console.error(err));
