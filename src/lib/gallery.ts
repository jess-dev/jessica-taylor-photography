import type { ImageMetadata } from 'astro';

/**
 * Every curated image, eagerly imported so Astro has the ImageMetadata
 * (width/height) it needs to reserve aspect ratios and generate srcsets at
 * build time. The glob pattern must be a literal — Vite resolves it statically.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/galleries/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true },
);

export interface Photo {
  /** Filename, e.g. 'CheddarVsBath22ndFeb-12.jpg' — the key used in frontmatter. */
  name: string;
  image: ImageMetadata;
  /** width / height. 1.5 is 3:2 landscape, 0.8 is 4:5 portrait. */
  ratio: number;
}

/** Photos belonging to one gallery, in filename order. */
export function galleryPhotos(slug: string): Photo[] {
  const prefix = `/src/assets/galleries/${slug}/`;

  return Object.entries(files)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, mod]) => {
      const image = mod.default;
      return {
        name: path.slice(prefix.length),
        image,
        ratio: image.width / image.height,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
}

/** A single photo by 'slug/filename', for heroes and covers. */
export function findPhoto(ref: string): Photo | undefined {
  const slash = ref.lastIndexOf('/');
  if (slash < 0) return undefined;
  return galleryPhotos(ref.slice(0, slash)).find((p) => p.name === ref.slice(slash + 1));
}

/**
 * Pack photos into justified rows.
 *
 * Within a row each photo's flex-grow is its aspect ratio, so widths come out
 * proportional to shape and every height resolves to the same value — aligned
 * rows with no cropping. A row closes once its ratios sum past `target`, so
 * wide frames naturally sit fewer-to-a-row than portraits do.
 *
 * target ≈ 2.6 gives two 5:4 frames, or three where one is portrait.
 */
export function packRows(photos: Photo[], target = 2.6): Photo[][] {
  const rows: Photo[][] = [];
  let row: Photo[] = [];
  let sum = 0;

  for (const photo of photos) {
    row.push(photo);
    sum += photo.ratio;

    if (sum >= target) {
      rows.push(row);
      row = [];
      sum = 0;
    }
  }

  // Trailing photos that never reached the target still get their own row.
  if (row.length) rows.push(row);

  return rows;
}
