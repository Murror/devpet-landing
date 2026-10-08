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

  // What a founder weighing an "AI cofounder" actually wants to know.
  // The first question is the one the rest of the page dodges: everyone
  // reading this is already comparing it to a tool they use.
  faqHeading: 'Before you sign up',
  faq: [
    {
      q: 'How is this different from ChatGPT or Cursor?',
      a: 'Those help you write code. Codepet runs the company around it: a roadmap from finding an idea to growing the thing, a specialist for each department, and every step shown in plain language for you to approve before it goes live.',
    },
    {
      q: 'What can it actually build for me?',
      a: 'Real work, not advice. A site, a post, a pull request, a plan. Each one arrives finished and waiting for your approval.',
    },
    {
      // The page opens with eight characters and otherwise never says
      // what they are. Without this they are decoration.
      q: 'Who are the pets?',
      a: 'Your team. Each one runs a department — engineering, marketing, design, finance, sales, support, legal and operations — and takes the work that belongs to it. The newest is Vega, a frog who runs sales: finding your first real users and talking to them one by one.',
    },
    {
      q: 'Do I need an idea already?',
      a: 'Not a finished one. The first stage is Find, where the work is shaping a rough notion into something worth building.',
    },
    {
      q: 'Who owns what it makes?',
      a: 'You do. Codepet runs on your Mac and works inside your own project, so what it makes lands in your repo like anything else you write.',
    },
    {
      // Last, immediately before the closing CTA: it answers the
      // question being asked at the exact moment it is asked.
      q: 'What happens after I sign up?',
      a: 'You get one email when early access opens, and nothing else.',
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
   * The cast, ordered for the huddle: smallest at the edges, byte and vega in
   * the middle. These are the same sprites the live site's pet band
   * uses (public/v2/pets), NOT the taller public/characters set.
   */
  pets: [
    { src: '/v2/pets/7-blue-penguin.png', name: 'penguin' },
    { src: '/v2/pets/2-green-owl.png', name: 'owl' },
    { src: '/v2/pets/3-orange-fox.png', name: 'fox' },
    { src: '/v2/pets/4-purple-byte.png', name: 'byte' },
    { src: '/v2/pets/8-green-vega.png', name: 'vega' },
    { src: '/v2/pets/1-pink-bear.png', name: 'pink bear' },
    { src: '/v2/pets/5-yellow-bear.png', name: 'yellow bear' },
    { src: '/v2/pets/6-red-bear.png', name: 'red bear' },
  ],
} as const
