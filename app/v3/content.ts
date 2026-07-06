// Copy + data for the /v3 cinematic-dark rebuild.
//
// Draft is English-first: we're nailing the design/feel before
// wiring it through the i18n JSON. Strings live here (not in
// lib/i18n) so they're easy to iterate on without touching the
// production bilingual bundle. Localisation is a later pass.

export const NAV = {
  brand: 'Codepet',
  links: [
    { label: 'How it works', href: '#loop' },
    { label: 'Setup', href: '#environment' },
    { label: 'Departments', href: '#departments' },
    { label: 'Journey', href: '#journey' },
    { label: 'Blog', href: '/blog' },
  ],
  cta: 'Open the web app',
}

export const HERO = {
  // The headline is split so the design can render the tail in an
  // italic accent (Playfair Display) against the pixel lead.
  headlineLead: 'Let’s build your',
  headlineAccent: 'second brain',
  sub: 'Building something of your own means being the whole team at once. Codepet is the AI cofounder who carries it with you — so the dream never rests on you alone.',
  // Web app isn't live yet, so the primary CTA collects waitlist emails
  // and the secondary offers early access to the current web app.
  ctaPrimary: 'Join the waitlist',
  ctaSecondary: 'Sign Up',
  ctaNote: 'The web app will be launched soon',
  scrollHint: 'scroll to explore',
}

// How byte works — the trust loop. Speed, but you stay in the loop.
export const LOOP = {
  eyebrow: 'HOW CODEPET WORKS',
  headlineLead: 'Codepet does the work.',
  headlineAccent: 'You stay in control.',
  sub: 'See every step in plain language, steer it with a sentence, and approve before anything goes live. All the speed of AI — without ever losing the thread of what your company is doing.',
  steps: [
    {
      key: 'execute',
      label: 'Execute',
      desc: 'Codepet gets to work and shows you everything — a live log, in plain language, as it goes.',
      image: '/v3/covers/loop-execute.jpg',
    },
    {
      key: 'deliver',
      label: 'Deliver',
      desc: 'Out comes something real — a site, a post, a pull request, a plan — ready for your eyes.',
      image: '/v3/covers/loop-deliver.jpg',
    },
    {
      key: 'approve',
      label: 'Approve',
      desc: 'Love it? Ship it. Want it different? Just say so. Nothing goes live until it’s truly yours.',
      image: '/v3/covers/loop-approve.jpg',
    },
  ],
}

// Environment — byte's guided Claude Code setup (skills, connectors,
// agents). The "this is wired into your real tools" proof.
export const ENVIRONMENT = {
  eyebrow: 'BUILT ON CLAUDE CODE',
  headlineLead: 'Plugged into the tools',
  headlineAccent: 'you already build with.',
  sub: 'Codepet works inside Claude Code. It recommends the right skills, connectors and agents — and switches them on with you — so your cofounder is wired into your real workflow from the very first run. No blank config, no dread.',
  panelTitle: 'Codepet’s recommended setup',
  // Alternating (zigzag) rows: each capability pairs an image with the option.
  // `image` values are PLACEHOLDERS — swap each for a real screenshot.
  items: [
    { name: 'Project skills', desc: 'Abilities tuned to what you’re building',   color: '#3B82F6', image: '/v3/covers/env-portrait.jpg' },
    { name: 'Connectors',     desc: 'Your services, where Codepet already works', color: '#2DD4BF', image: '/v3/covers/env-cubes.jpg'    },
    { name: 'Subagents',      desc: 'Specialists Codepet hands the right job to',  color: '#A855F7', image: '/v3/covers/env-cd.jpg'       },
    { name: 'Guardrails',     desc: 'Limits you set — Codepet stays inside them',  color: '#FF6B9D', image: '/v3/covers/env-hand.jpg'     },
  ],
}

// Eight departments — names, one-line needs, accent colour + cover.
// Covers + colours mirror the product app (public/v3/covers).
export const DEPARTMENTS = {
  eyebrow: 'ONE COMPANY · EIGHT DEPARTMENTS',
  headlineLead: 'Every job a company needs —',
  headlineAccent: 'covered, together.',
  sub: 'Engineering to legal, marketing to finance. Codepet walks into each one knowing what it needs next — and which calls are still yours to make.',
  items: [
    { key: 'eng',     name: 'Engineering', need: 'Ship the work and verify every change.',        color: '#2563EB', cover: '/v3/covers/code-pyramid.jpg',     photo: true, pet: '/v2/pets/4-purple-byte.png'  },
    { key: 'mkt',     name: 'Marketing',   need: 'Find the words and the launch sequence.',        color: '#FF8C42', cover: '/v3/covers/code-drummer.jpg',     photo: true, pet: '/v2/pets/3-orange-fox.png'   },
    { key: 'ops',     name: 'Operations',  need: 'Stand up the machinery behind the scenes.',      color: '#2DD4BF', cover: '/v3/coder-burst.jpg',            photo: true, pet: '/v2/pets/2-green-owl.png'    },
    { key: 'fin',     name: 'Finance',     need: 'Model the numbers, price with confidence.',      color: '#FDB022', cover: '/v3/covers/code-chess.jpg',      photo: true, pet: '/v2/pets/5-yellow-bear.png'  },
    { key: 'legal',   name: 'Legal',       need: 'Cover the basics from sensible templates.',      color: '#9333EA', cover: '/v3/covers/code-observatory.jpg', photo: true, pet: '/v2/pets/7-blue-penguin.png' },
    { key: 'design',  name: 'Design',      need: 'Make the first run feel like magic.',            color: '#A855F7', cover: '/v3/covers/code-book.jpg',       photo: true, pet: '/v2/pets/1-pink-bear.png'    },
    { key: 'sales',   name: 'Sales',       need: 'Land your first real users, personally.',        color: '#7C3AED', cover: '/v3/covers/code-guitar.jpg',     photo: true, pet: '/v2/pets/6-red-bear.png'     },
    { key: 'support', name: 'Support',     need: 'Answer once, then keep triage running quietly.', color: '#FF6B9D', cover: '/v3/covers/code-ghibli.jpg',     photo: true, pet: '/v2/pets/1-pink-bear.png'    },
  ],
}

// The roadmap as a luminous path.
export const JOURNEY = {
  eyebrow: 'YOUR ROADMAP',
  headlineLead: 'From the first spark',
  headlineAccent: 'to a company that runs.',
  sub: 'Codepet maps the whole path — find, build, ship, launch, grow — and walks it beside you, one unlocked step at a time.',
  phases: [
    { key: 'find',   label: 'Find',         note: 'Validate the idea' },
    { key: 'build',  label: 'Build',        note: 'Shape the product' },
    { key: 'ship',   label: 'Ship',         note: 'Make it shippable' },
    { key: 'launch', label: 'Launch',       note: 'Run the closed beta' },
    { key: 'grow',   label: 'Run & grow',   note: 'Distribute & scale' },
  ],
}

export const FINAL = {
  headlineLead: 'You don’t have to',
  headlineAccent: 'build it alone.',
  sub: 'Codepet runs free in your browser. byte is ready whenever you are.',
  ctaPrimary: 'Join our Discord',
  ctaPrimaryHref: 'https://discord.gg/k6N2TdyTb',
  ctaSecondary: 'Read the Build Log',
}

export const FOOTER = {
  tagline: 'Your AI cofounder, in your browser.',
  links: [
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Web app', href: '/app' },
  ],
  social: [
    { label: 'X', href: 'https://x.com/codepetapp' },
    { label: 'Instagram', href: 'https://www.instagram.com/codepetapp/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/codepet/' },
    { label: 'GitHub', href: 'https://github.com/My-Outcasts' },
    { label: 'Discord', href: 'https://discord.gg/k6N2TdyTb' },
  ],
  copyright: '© 2026 Codepet — built by Outcasts.',
}

// Setup subpages — one focused page per ENVIRONMENT card, reached from the
// "Discover" affordance in the pinned gallery. Each page is carried by a
// signature hero effect + image; copy stays deliberately tight (a short
// intro + three compact beats). Title / tagline / colour / image are pulled
// from ENVIRONMENT.items[idx] so the card and its page never drift apart.
export const SETUP_ORDER = ['project-skills', 'connectors', 'subagents', 'guardrails'] as const

export const SETUP: Record<
  (typeof SETUP_ORDER)[number],
  { idx: number; intro: string; features: { t: string; d: string }[] }
> = {
  'project-skills': {
    idx: 0,
    intro:
      'Codepet reads what you’re actually building and switches on only the abilities that fit — no blank config, no scrolling a menu of a hundred tools you’ll never touch.',
    features: [
      { t: 'Reads the project first', d: 'It scans your repo, your stack and your goal before it suggests a single thing.' },
      { t: 'Turns on what fits', d: 'Only the skills your build actually needs — the rest stay out of the way.' },
      { t: 'Grows as you do', d: 'New phase, new needs: the skill set shifts quietly with the work.' },
    ],
  },
  connectors: {
    idx: 1,
    intro:
      'Your services, already wired in. Codepet works where your work lives — and turns each connection on with you, one confirmed step at a time.',
    features: [
      { t: 'Where you already work', d: 'GitHub, your docs, your deploys — met on their own turf, not a copy.' },
      { t: 'On with a nod', d: 'Nothing connects until you say yes. Every switch stays yours to flip.' },
      { t: 'Context that carries', d: 'Once linked, your cofounder keeps the thread across every tool.' },
    ],
  },
  subagents: {
    idx: 2,
    intro:
      'Big jobs get handed to specialists. Codepet routes each task to the agent built for it — then brings the result back to one place: you.',
    features: [
      { t: 'The right hands', d: 'Each job goes to the agent shaped for exactly that kind of work.' },
      { t: 'Runs in parallel', d: 'Specialists work at once, then report back to you in order.' },
      { t: 'You stay the lead', d: 'Every handoff is visible, and the final call is always yours.' },
    ],
  },
  guardrails: {
    idx: 3,
    intro:
      'You draw the lines; Codepet stays inside them. Set the limits once and your cofounder moves fast without ever crossing what matters to you.',
    features: [
      { t: 'Limits you set', d: 'Budget, scope, tone — the boundaries are yours to define up front.' },
      { t: 'Held automatically', d: 'Codepet checks itself against your rules before it ever acts.' },
      { t: 'Nothing risky, quietly', d: 'Anything close to a line comes back to you first, every time.' },
    ],
  },
}
