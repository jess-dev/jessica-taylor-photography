import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Galleries.
 *
 * Adding a genre (Portraits, say) is one markdown file in src/content/galleries/
 * plus a folder of images in src/assets/galleries/<slug>/. No component changes.
 *
 * The site is the *curation* platform: only the strongest frames. Flickr stays the
 * *delivery* platform, so each gallery links out to its full album via flickrUrl.
 */
const galleries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galleries' }),
  schema: z.object({
    title: z.string(),
    /** Groups galleries on the homepage: 'football' | 'gigs' | 'portraits' | … */
    genre: z.string(),
    blurb: z.string(),
    /** Filename within this gallery's image folder, e.g. 'corner-kick.jpg'. */
    cover: z.string(),
    /** Full match album on Flickr, if there is one. */
    flickrUrl: z.string().url().optional(),
    /** Lower sorts first on the homepage and the work index. */
    order: z.number().default(100),
    /** Drafts are excluded from getStaticPaths, so they never build a page. */
    draft: z.boolean().default(false),
    /**
     * Per-image display hints, keyed by filename. Everything is optional;
     * dimensions come from the image metadata at build time.
     *   focal:   object-position for cropped contexts, e.g. '35% 40%'
     *   caption: overrides the generated caption
     *   feature: surfaces this frame on the homepage
     */
    photos: z
      .record(
        z.string(),
        z.object({
          focal: z.string().optional(),
          caption: z.string().optional(),
          feature: z.boolean().default(false),
        }),
      )
      .default({}),
  }),
});

export const collections = { galleries };
