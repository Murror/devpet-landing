/**
 * Every user-visible string on the pre-launch teaser, in one place —
 * mirroring the convention in app/v3/content.ts.
 *
 * Social URLs are copied from app/v3/content.ts so the teaser and the
 * full site point at the same accounts.
 */
export const V4 = {
  eyebrow: 'Codepet · by Murror',
  // The headline is split so the design can render the tail in an
  // italic accent (Playfair Display), matching v3's hero treatment.
  headlineLead: "Let's build your",
  headlineAccent: 'whole company',
  sub: 'Building something of your own means being the whole team at once. Codepet is the AI cofounder who carries it with you.',
  emailPlaceholder: 'you@email.com',
  ctaLabel: 'Join the waitlist',
  timing: 'Launching this autumn',
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
  // The eight companion SVGs in public/characters/, used by the ring.
  companions: ['byte', 'luna', 'nova', 'sage', 'crash', 'glitch', 'null', 'zero'],
} as const
