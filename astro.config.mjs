// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// User site: the repo is named UmmeKulsumTumpa.github.io, so it is served from the root
// and no `base` is needed.
export default defineConfig({
  site: 'https://ummekulsumtumpa.github.io',
  integrations: [react(), sitemap()],
  // Self-hosted Google Fonts (SPEC §3.1 families, same weights/styles and Latin subset the Google CSS served),
  // downloaded at build time and served from this origin: no render-blocking third-party stylesheet.
  // Fallback stacks match tokens.css exactly and optimizedFallbacks is off, so text renders as before.
  fonts: [
    { name: 'Instrument Serif', cssVariable: '--font-instrument-serif', provider: fontProviders.google(), weights: [400], styles: ['normal', 'italic'], subsets: ['latin'], fallbacks: ['Georgia', 'serif'], optimizedFallbacks: false, display: 'swap' },
    { name: 'IBM Plex Sans', cssVariable: '--font-plex-sans', provider: fontProviders.google(), weights: [400, 500, 600], styles: ['normal'], subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'], optimizedFallbacks: false, display: 'swap' },
    { name: 'IBM Plex Mono', cssVariable: '--font-plex-mono', provider: fontProviders.google(), weights: [400, 500], styles: ['normal'], subsets: ['latin'], fallbacks: ['ui-monospace', 'monospace'], optimizedFallbacks: false, display: 'swap' },
  ],
  // CSS build targets, so Lightning CSS keeps the plain url() fallback before each image-set() background
  // (background.css) and Safari <= 16 / Chromium < 113, which can't use image-set() with type(), still get
  // the background image. Lightning CSS only keeps that fallback when a target has no image-set() at all,
  // hence Firefox 80 in the list. Modern browsers render the built CSS exactly as before.
  vite: { build: { cssTarget: ['chrome100', 'edge100', 'firefox80', 'safari15', 'ios15'] } },
  // Code blocks are plain <pre><code>, styled by prose.css from the theme tokens. Shiki would inline
  // fixed hex colours (one theme for both light and dark) as style attributes.
  markdown: { syntaxHighlight: false },
});
