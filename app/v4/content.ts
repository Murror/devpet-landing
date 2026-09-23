/**
 * Every user-visible string on the pre-launch teaser, in one place —
 * mirroring the convention in app/v3/content.ts.
 *
 * The page is stripped to one job. It carries a clear value proposition
 * (`sub`), one unmistakable call to action (`ctaLabel`), a visual that
 * carries the emotion (the pet huddle), and nothing at all competing for
 * attention — no nav, no proof line, and no link back into the site.
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
  // Six words under a big headline. Earlier drafts explained the idea
  // (departments, payroll, macOS) and read like a spec sheet for it.
  // This states it and stops; the cast above already says what Codepet
  // is, so the line does not have to.
  sub: 'Build a company without hiring one.',
  emailPlaceholder: 'you@email.com',
  ctaLabel: 'Get early access',
  messages: {
    invalid: 'Please enter a valid email address.',
    success: "You're on the list. We'll be in touch.",
    duplicate: "You're already on the list.",
    error: 'Something went wrong. Try again?',
  },
  // The five stages, lifted verbatim from JOURNEY.phases in
  // app/v3/content.ts so the teaser and the site tell the same story.
  // Stages rather than departments: they show where a founder is going,
  // not just who is along for the ride.
  stagesHeadingLead: 'From the first spark',
  stagesHeadingAccent: 'to a company that runs.',
  stagesSub: 'Codepet maps the whole path and walks it beside you, one unlocked step at a time.',
  stages: [
    { n: '01', label: 'Find', note: 'Validate the idea' },
    { n: '02', label: 'Build', note: 'Shape the product' },
    { n: '03', label: 'Ship', note: 'Make it shippable' },
    { n: '04', label: 'Launch', note: 'Run the closed beta' },
    { n: '05', label: 'Run & grow', note: 'Distribute & scale' },
  ],

  // The objections a pre-launch page cannot dodge. Pricing figures come
  // from the locked spec already published on /pricing, so this states
  // nothing new.
  faqHeading: 'Before you sign up',
  faq: [
    {
      q: 'When does it launch?',
      a: "Soon. Everyone on this list hears first, before it goes public.",
    },
    {
      q: 'What will it cost?',
      a: 'A 7-day trial to start, then $20 a month. Credits cover the work your team does, and extra credits are $0.05 each.',
    },
    {
      q: 'Do I need to know how to code?',
      a: 'No. Codepet does the work and shows you every step in plain language, so you approve it rather than write it.',
    },
    {
      q: 'Do I need a Mac?',
      a: 'Yes, for now. Codepet is a macOS app.',
    },
  ],

  closingHeading: 'Be first in line.',
  closingSub: 'Leave your email and you will hear the moment it opens.',

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
