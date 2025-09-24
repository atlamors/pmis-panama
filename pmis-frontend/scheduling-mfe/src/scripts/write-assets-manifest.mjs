// scripts/write-assets-manifest.mjs
import { readdir, writeFile, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'dist/scheduling-mfe/browser');
const assetsDir = join(outDir, 'assets');

async function exists(p) {
    try { await stat(p); return true; } catch { return false; }
}

const filesRoot = await readdir(outDir);
const filesAsset = (await exists(assetsDir)) ? await readdir(assetsDir) : [];

// Prefer Tailwind watcher output in /assets
let cssList = [];
if (filesAsset.includes('style.css')) cssList = ['assets/style.css'];
else {
    // fallback to any top-level CSS like styles.[hash].css
    const topCss = filesRoot.filter(f => f.endsWith('.css'));
    // prefer style*.css then styles*.css, else first css
    let mainCss =
        topCss.find(f => /^style(\.[a-f0-9]+)?\.css$/i.test(f)) ||
        topCss.find(f => /^styles(\.[a-f0-9]+)?\.css$/i.test(f)) || 1
    topCss[0];
    cssList = mainCss ? [mainCss] : [];
}

await mkdir(assetsDir, { recursive: true });
const manifest = { css: cssList };
await writeFile(join(assetsDir, 'assets.json'), JSON.stringify(manifest, null, 2));

console.log('Wrote assets/assets.json:', manifest);
