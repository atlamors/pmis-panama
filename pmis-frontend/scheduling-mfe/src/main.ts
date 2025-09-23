import 'zone.js';
import { initFederation } from '@angular-architects/module-federation';

initFederation({})
    .then(() => import('./bootstrap'))
    .catch(err => console.error(err));
