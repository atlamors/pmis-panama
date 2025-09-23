import 'zone.js';
import { initFederation } from '@angular-architects/module-federation/runtime';

(async () => {
    try {
        await initFederation('/assets/router.manifest.json');
        await import('./bootstrap');
    } catch (err) {
        console.error('initFederation(host) failed', err);
    }
})();
