/**
 * Site identity. Components read from this object rather than hardcoding a
 * name, address or URL, so this file plus styles/global.css covers a rebrand.
 */

export interface SocialLink {
  label: string;
  href: string;
  /** Included in the Person JSON-LD `sameAs` array for SEO. */
  sameAs?: boolean;
}

export const site = {
  /** Used in the wordmark, <title> suffix, copyright and JSON-LD. */
  name: 'Jessica Taylor',
  discipline: 'Photography',

  /** Falls back to the origin in astro.config.mjs. */
  url: 'https://jessicataylorphotography.co.uk',

  /** Shown under the hero and used as the default meta description. */
  tagline: 'Football and live music, Bristol',
  description:
    'Football and live music photographer in Bristol. Grassroots match days, ' +
    'athletics and gigs across the South West, shot by someone who plays.',

  /**
   * Public enquiry address for the footer and contact page. Null routes
   * enquiries through the form instead, keeping no address in the page source.
   */
  email: null as string | null,

  location: {
    city: 'Bristol',
    region: 'South West of England',
    country: 'GB',
  },

  socials: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/jessica_taylor.photography/',
      sameAs: true,
    },
    {
      label: 'Flickr, full galleries',
      href: 'https://www.flickr.com/photos/203458112@N05/',
      sameAs: true,
    },
  ] satisfies SocialLink[],

  /* Trailing slashes are deliberate: directory-format output means /work
     301s to /work/, costing a round trip per click. */
  nav: [
    { label: 'Work', href: '/work/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],

  /**
   * About page portrait, referenced as '<gallery-slug>/<filename>'.
   * Null renders a single prose column instead of the side-by-side layout.
   */
  portrait: null as string | null,

  /** Full-bleed band on the About page. Null omits it. */
  aboutImage: null as { src: string; focal: string; alt: string } | null,

  /**
   * Homepage hero. Two photographs rather than one crop: a wide frame for
   * desktop, a portrait frame for phones. '<gallery-slug>/<filename>'.
   */
  hero: {
    desktop: 'sport/CheddarVsBath22ndFeb-12.jpg',
    mobile: 'sport/BristolRun-8.jpg',
    focal: '35% 40%',
    headline: 'Gone in a tenth of a second.',
    /* <picture> carries one alt, and the two frames differ, so this has to
       describe both. */
    alt: 'Grassroots sport in and around Bristol',
  },

  /**
   * Web3Forms access key. Read from the environment so it is never committed.
   * Set PUBLIC_WEB3FORMS_KEY locally in .env and in the Cloudflare Pages
   * dashboard for production.
   */
  formKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
} as const;

export type Site = typeof site;
