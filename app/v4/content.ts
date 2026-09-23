/**
 * Every user-visible string on the pre-launch teaser, in one place —
 * mirroring the convention in app/v3/content.ts.
 *
 * Copy is built around the five things a converting landing page needs:
 * a clear value proposition (`sub`), one unmistakable call to action
 * (`ctaLabel`), nothing else competing for attention (no nav), a visual
 * that carries emotion (the pet huddle), and proof that this is real
 * (`proof`).
 *
 * Social URLs are copied from app/v3/content.ts so the teaser and the
 * full site point at the same accounts.
 */
export const V4 = {
  // Replaces a dated timing line: no date to miss, and it frames the
  // page as an invitation to be early rather than an announcement.
  eyebrow: 'Coming soon',
  // Split so the design can render the tail in an italic accent
  // (Playfair Display), matching the live hero's treatment exactly.
  headlineLead: 'Be the first to build your',
  headlineAccent: 'whole company',
  // The value proposition: what Codepet actually is, in one line.
  sub: 'A macOS app where a team of AI specialists builds your product with you — engineering, product, finance.',
  emailPlaceholder: 'you@email.com',
  ctaLabel: 'Get early access',
  // Proof. Counts come from the canonical positioning in CLAUDE.md.
  // Deliberately NOT a signup count: we will not print a number we
  // cannot read from the real list.
  proof: '8 AI companions · 16 coding skills · Built by MURROR',
  bridgeLabel: "See what we're building",
  bridgeHref: '/v3',
  messages: {
    invalid: 'Please enter a valid email address.',
    success: "You're on the list. We'll be in touch.",
    duplicate: "You're already on the list.",
    error: 'Something went wrong. Try again?',
  },
  socials: [
    { label: 'X', href: 'https://x.com/codepetapp' },
    { label: 'Instagram', href: 'https://www.instagram.com/codepetapp/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/codepet/' },
    { label: 'GitHub', href: 'https://github.com/My-Outcasts' },
    { label: 'Discord', href: 'https://discord.gg/k6N2TdyTb' },
  ],
  /**
   * The cast, ordered for the huddle: smallest at the edges, byte in
   * the middle. These are the same sprites the live site's pet band
   * uses (public/v2/pets), NOT the taller public/characters set.
   */
  pets: [
    { src: '/v2/pets/7-blue-penguin.png', name: 'penguin' },
    { src: '/v2/pets/2-green-owl.png', name: 'owl' },
    { src: '/v2/pets/3-orange-fox.png', name: 'fox' },
    { src: '/v2/pets/4-purple-byte.png', name: 'byte' },
    { src: '/v2/pets/1-pink-bear.png', name: 'pink bear' },
    { src: '/v2/pets/5-yellow-bear.png', name: 'yellow bear' },
    { src: '/v2/pets/6-red-bear.png', name: 'red bear' },
  ],
} as const
