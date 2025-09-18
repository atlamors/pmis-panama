import 'zone.js';
import { initFederation } from '@angular-architects/module-federation';

initFederation({})
    .then(() => import('./main.bootstrap'))
    .catch(err => console.error('initFederation(remote) failed', err));
