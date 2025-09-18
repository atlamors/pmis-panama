import 'zone.js';
import { initFederation } from '@angular-architects/module-federation/runtime';

const manifestUrl = '/assets/mf.manifest.json';

initFederation(manifestUrl)
    .then(() => import('./main.bootstrap'))
    .catch(err => console.error('initFederation(host) failed', err));
