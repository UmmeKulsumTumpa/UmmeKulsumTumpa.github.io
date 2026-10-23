// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// User site: the repo is named UmmeKulsumTumpa.github.io, so it is served from the root
// and no `base` is needed.
export default defineConfig({
  site: 'https://ummekulsumtumpa.github.io',
  integrations: [react(), sitemap()],
  // Code blocks are plain <pre><code>, styled by prose.css from the theme tokens. Shiki would inline
  // fixed hex colours (one theme for both light and dark) as style attributes.
  markdown: { syntaxHighlight: false },
});
