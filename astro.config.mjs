// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// User site: the repo is named UmmeKulsumTumpa.github.io, so it is served from the root
// and no `base` is needed.
export default defineConfig({
  site: 'https://ummekulsumtumpa.github.io',
  integrations: [react()],
});
