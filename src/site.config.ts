/**
 * Every piece of site identity lives here.
 *
 * Components must never hardcode a name, address or URL — they read from this
 * object. That keeps the door open to reusing the whole site as a template for
 * another photographer: change this file, swap the images, adjust the tokens in
 * styles/global.css, and nothing else needs touching.
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
  tagline: 'Sports photography — Bristol',
  description:
    'Sports and live music photographer based in Bristol, covering grassroots ' +
    'football, athletics and gigs across the South West.',

  /**
   * Public enquiry address, printed in the footer and on the contact page.
   *
   * Null on purpose: enquiries arrive through the form, whose destination lives
   * in the Web3Forms account rather than in the page source — so no personal
   * address is published. Set this to 'hello@jessicataylorphotography.co.uk'
   * once the Zoho mailbox exists.
   */
  email: null as string | null,

  location: {
    city: 'Bristol',
    region: 'South West England',
    country: 'GB',
  },

  socials: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/jessica_taylor.photography/',
      sameAs: true,
    },
    {
      label: 'Flickr — full match galleries',
      href: 'https://www.flickr.com/photos/203458112@N05/',
      sameAs: true,
    },
  ] satisfies SocialLink[],

  nav: [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  /**
   * About page portrait, referenced as '<gallery-slug>/<filename>'.
   * Null until a real photograph of Jess working exists — the page drops to a
   * single prose column rather than standing in a football frame for a person.
   */
  portrait: null as string | null,

  /**
   * Homepage hero. Two separate photographs chosen for their shape, not one
   * image cropped twice — a wide frame owns the desktop, a portrait frame fills
   * a phone. Referenced as '<gallery-slug>/<filename>'.
   */
  hero: {
    desktop: 'sport/CheddarVsBath22ndFeb-12.jpg',
    mobile: 'sport/BristolRun-8.jpg',
    focal: '35% 40%',
    headline: 'The whole picture.',
    alt:
      'A player rises to meet the ball at a corner as defenders and the ' +
      'goalkeeper converge on the six-yard box',
  },

  /**
   * Web3Forms access key. Read from the environment so it is never committed.
   * Set PUBLIC_WEB3FORMS_KEY locally in .env and in the Cloudflare Pages
   * dashboard for production.
   */
  formKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
} as const;

export type Site = typeof site;
