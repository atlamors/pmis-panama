import { initFederation } from '@angular-architects/module-federation';

initFederation({})
    .then(() => import('./bootstrap'))
    .catch(err => console.error('initFederation(remote) failed', err));
