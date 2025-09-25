import { loadRemoteModule } from '@angular-architects/module-federation';

/**
 * Options for dynamically loading a remote Angular MF module's routes
 * **and** its CSS by URL. This approach does NOT require a webpack `remotes`
 * map in the host; everything is discovered at runtime using the remoteEntry URL.
 */
type Options = {
    /**
     * Full URL to the remote’s `remoteEntry.js`.
     * Example: "http://localhost:4201/remoteEntry.js"
     *
     * Used to:
     *  - Initialize the Module Federation container (via URL)
     *  - Compute the base path for CSS assets and manifest
     */
    remoteEntryUrl: string;

    /**
     * The exact "expose key" from the remote’s `webpack.config.cjs` `exposes` block.
     * ⚠️ This is NOT a package name. It’s typically a relative key like "./Module".
     *
     * For example, with:
     *   exposes: { './Module': './src/remote-entry.ts' }
     * pass: exposedModule = "./Module"
     */
    exposedModule: string;

    /**
     * Path (relative to remote base) to a JSON manifest that lists CSS files.
     * Default: "assets/assets.json"
     *
     * In prod, this lets the remote publish hashed CSS filenames for cache-busting.
     * In dev, this often won’t exist; the util will fall back to `cssDevFallback`.
     */
    cssManifestPath?: string;

    /**
     * Path (relative to remote base) to a stable CSS file for dev fallback.
     * Default: "assets/style.css"
     *
     * We add a cache-buster query param when using this fallback to avoid stale CSS.
     */
    cssDevFallback?: string;

    /**
     * Max time (ms) to wait for the remote module to load before giving up.
     * Default: 8000
     *
     * Prevents the host router from hanging if the remote is offline or misconfigured.
     */
    timeoutMs?: number;
};

/**
 * Normalize a remoteEntry URL to its base directory (ending in "/").
 *
 * @example
 * normalizeBase("http://localhost:4201/remoteEntry.js")
 *   -> "http://localhost:4201/"
 */
function normalizeBase(url: string): string {
    const base = url.replace(/remoteEntry\.m?js(?:[?#].*)?$/i, '');
    return base.endsWith('/') ? base : base + '/';
}

/**
 * Inject a <link rel="stylesheet"> once for a given absolute CSS URL.
 * A stable data attribute is used to prevent duplicates across repeated calls.
 *
 * @param absHref Absolute URL to a CSS file
 * @param bust If true, append a cache-busting timestamp
 */
function ensureCssLinkOnce(absHref: string, bust = false): Promise<void> {
    const u = new URL(absHref);
    const key = u.origin + u.pathname; // dedupe key does NOT include querystring
    if (document.querySelector(`link[data-remote-style="${key}"]`)) {
        return Promise.resolve();
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = bust ? `${u.toString()}?v=${Date.now()}` : u.toString();
    link.dataset.remoteStyle = key;

    return new Promise((resolve, reject) => {
        link.addEventListener('load', () => resolve());
        link.addEventListener('error', () => reject(new Error(`CSS load failed: ${link.href}`)));
        document.head.appendChild(link);
    });
}

/**
 * Load remote CSS with a robust flow:
 * 1) Try a manifest at `cssManifestPath` containing `{ css: string[] }`
 *    and append each stylesheet to <head>.
 * 2) If manifest fails or is empty, fall back to a single stable file
 *    (`cssDevFallback`) with a cache-buster.
 */
async function loadRemoteStylesWithFallback(
    remoteEntryUrl: string,
    cssManifestPath = 'assets/assets.json',
    cssDevFallback = 'assets/style.css'
): Promise<void> {
    const base = normalizeBase(remoteEntryUrl);
    const manifestUrl = new URL(cssManifestPath, base).toString();

    try {
        const res = await fetch(manifestUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`manifest ${res.status}`);
        const { css = [] } = await res.json();
        if (!Array.isArray(css) || !css.length) throw new Error('empty css array');

        await Promise.all(
            css.map((file: string) => ensureCssLinkOnce(new URL(file, base).toString()))
        );
    } catch (err) {
        console.warn('[mfe:css] manifest missing → fallback', err);
        await ensureCssLinkOnce(new URL(cssDevFallback, base).toString(), true);
    }
}

/**
 * Wrap a promise with a timeout. If it neither resolves nor rejects within `ms`,
 * reject with a timeout error that includes `label` for debugging.
 */
function withTimeout<T>(p: Promise<T>, ms: number, label = 'operation'): Promise<T> {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
        p.then(
            v => { clearTimeout(t); resolve(v); },
            e => { clearTimeout(t); reject(e); }
        );
    });
}

/**
 * Load a remote’s CSS (non-blocking) and its Angular routes (blocking with timeout).
 * - CSS errors are logged but do not break routing.
 * - Route load failures return a blank child route (`[{ path: '' }]`) so the
 *   host shell remains visible and functional.
 *
 * This uses **URL-based loading** for Module Federation via
 * `loadRemoteModule({ remoteEntry, exposedModule })`, which means:
 *  - No host webpack `remotes` mapping is required.
 *  - `exposedModule` MUST be the MF expose key (e.g., "./Module").
 */
export async function loadRemoteRoutes(opts: Options) {
    const {
        remoteEntryUrl,
        exposedModule, // e.g. './Module' (NOT 'scheduling/Module')
        cssManifestPath = 'assets/assets.json',
        cssDevFallback = 'assets/style.css',
        timeoutMs = 8000,
    } = opts;

    // Start CSS fetch in the background (do not block routing)
    loadRemoteStylesWithFallback(remoteEntryUrl, cssManifestPath, cssDevFallback)
        .catch(err => console.warn('[mfe:css] non-fatal', err));

    try {
        // Load remote module by URL; this initializes the MF container on demand
        const modPromise = loadRemoteModule({
            type: 'module',
            remoteEntry: remoteEntryUrl,
            exposedModule, // './Module'
        }) as Promise<{ RemoteRoutes: unknown }>;

        // Guard against hangs
        const { RemoteRoutes } = await withTimeout(modPromise, timeoutMs, 'remote routes import');

        if (!Array.isArray(RemoteRoutes)) throw new Error('invalid routes export');
        return RemoteRoutes as any[];
    } catch (err) {
        console.warn('[mfe:routes] remote unavailable → blank fallback', err);
        return [{ path: '' }]; // keep shell up; empty outlet
    }
}
