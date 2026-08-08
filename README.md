# Jessica Taylor Photography

Portfolio site for a Bristol sports and live music photographer.
Astro 5, static output, no client-side framework.

The site is the **curation** platform — a selected edit meant to win enquiries.
Flickr stays the **delivery** platform, where full match galleries live for
players and clubs to browse and download. Each gallery links out to its Flickr
album.

## Running it

```bash
npm install
cp .env.example .env     # then paste in a Web3Forms key
npm run dev              # http://localhost:4321
```

| Command | Purpose |
|---|---|
| `npm run dev` | Development server, hot reload |
| `npm run build` | Production build into `dist/`, then prunes unreferenced originals |
| `npm run preview` | Serves the built `dist/` — the honest performance test |
| `npm run check` | TypeScript and Astro diagnostics |

`npm run dev` optimises images on demand, so galleries feel slower there than in
production. Judge performance against `npm run preview`, never `dev`.

## Adding photographs

1. Drop files into `src/assets/galleries/<slug>/`
2. Create or edit `src/content/galleries/<slug>.md`

Adding a whole new genre is those two steps and nothing else — no component
changes. The schema lives in `src/content.config.ts`; `draft: true` keeps a
gallery out of the build entirely.

Per-photo hints go in the `photos` map, keyed by filename:

```yaml
photos:
  CheddarVsBath22ndFeb-12.jpg:
    caption: Cheddar vs Bath — 22 February
    focal: 35% 40%      # object-position where the image is cropped
    feature: true       # surfaces it on the homepage
```

## Layout notes

**Justified rows.** Each figure's `flex-grow` is its aspect ratio, so widths come
out proportional to shape and every height in a row resolves to the same value —
aligned rows with no cropping and no JavaScript. See `packRows` in
`src/lib/gallery.ts`.

**Art-directed hero.** A wide frame on desktop, a portrait frame on mobile — two
different photographs chosen for their shape, not one image cropped twice. Set
both in `src/site.config.ts`.

**One script.** The lightbox is the only client-side JavaScript.

## Configuration

Everything identifying the site lives in `src/site.config.ts` — name, tagline,
socials, nav, location, hero, portrait. Everything visual lives in the `:root`
token block in `src/styles/global.css`. Reskinning for another photographer
should mean editing those two places and swapping the images.

`site.email` is `null` on purpose: enquiries arrive through the form, whose
destination inbox lives in the Web3Forms account rather than in the page source,
so no personal address is published.

## Deployment

Cloudflare, building from this repo.

- Build command `npm run build`, output directory `dist`
- Environment variable `PUBLIC_WEB3FORMS_KEY`

**If deployed as a Worker rather than a classic Pages project**, that variable
must be set as a **build variable**, not a runtime one. Astro reads it through
`import.meta.env` at build time and bakes it into the HTML; a runtime variable is
invisible to the build, and the result is a silently disabled contact form. The
contact page renders a visible note when the key is missing — that note is the
signal the variable landed in the wrong place.

## Why `scripts/prune-originals.mjs`

`import.meta.glob(..., { eager: true })` imports every curated photo so Astro has
its dimensions at build time. Vite emits each imported asset whether or not
anything references it, which for a photography site means tens of megabytes of
full-resolution JPEG shipped beside the optimised AVIF that visitors actually
receive. The prune step deletes only files nothing references — around 31 MB per
build at present.
