// Visual check: screenshot the built site so it can be compared with docs/design/screenshots/.
//
// Usage:
//   npm run build && npm run preview      (in one terminal; serves http://localhost:4321)
//   npm run shots                         (in another; writes to .shots/, which is git-ignored)
//   npm run shots -- /education/          (only one page)
//
// Desktop shots use the same viewport as the design captures (1375x732), so the
// files can be laid side by side with the matching docs/design/screenshots/*.jpg.
// Each page is captured top-to-bottom in viewport-sized steps, after the entrance
// animations have settled.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.SHOTS_BASE ?? 'http://localhost:4321';
const OUT = '.shots';
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/education/', '/experience/', '/research/', '/writing/', '/reading/'];

const VIEWPORTS = [
  { name: 'desktop', width: 1375, height: 732 },
  { name: 'mobile', width: 390, height: 844 },
];
const THEMES = ['dark', 'light'];
const SETTLE_MS = 1600; // longest entrance animation + stagger

const slug = (p) => (p === '/' ? 'home' : p.replaceAll('/', '')).replace(/[^a-z0-9-]/gi, '');

await mkdir(OUT, { recursive: true });
// CHROMIUM_PATH lets you reuse an installed Chrome/Chromium instead of `npx playwright install chromium`.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    await context.addInitScript((t) => {
      try { localStorage.setItem('theme', t); } catch {}
    }, theme);
    const page = await context.newPage();

    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      let i = 1;
      for (let y = 0; y < total; y += vp.height, i++) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(SETTLE_MS);
        const file = `${OUT}/${slug(path)}-${vp.name}-${theme}-${String(i).padStart(2, '0')}.png`;
        await page.screenshot({ path: file });
        console.log('saved', file);
      }
    }
    await context.close();
  }
}

await browser.close();
