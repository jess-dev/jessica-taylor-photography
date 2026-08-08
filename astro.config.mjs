// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` must be the real production origin — the sitemap, canonical URLs and
// OpenGraph tags are all built from it.
export default defineConfig({
  site: 'https://jessicataylorphotography.co.uk',
  output: 'static',
  integrations: [sitemap()],
  // Image formats are chosen per-component (<Picture formats=…>), not globally.
  build: {
    inlineStylesheets: 'auto',
  },
});
