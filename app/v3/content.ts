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
  cta: 'Download for macOS',
}

export const HERO = {
  // The headline is split so the design can render the tail in an
  // italic accent (Playfair Display) against the pixel lead.
  headlineLead: 'Let’s build your',
  headlineAccent: 'second brand',
  sub: 'Building something of your own means being the whole team at once. Codepet is the AI cofounder who carries it with you — so the dream never rests on you alone.',
  ctaPrimary: 'Download for macOS',
  ctaSecondary: 'Meet byte',
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
    },
    {
      key: 'deliver',
      label: 'Deliver',
      desc: 'Out comes something real — a site, a post, a pull request, a plan — ready for your eyes.',
    },
    {
      key: 'approve',
      label: 'Approve',
      desc: 'Love it? Ship it. Want it different? Just say so. Nothing goes live until it’s truly yours.',
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
  items: [
    { name: 'Project skills', desc: 'Abilities tuned to what you’re building' },
    { name: 'Connectors',     desc: 'Your services, where Codepet already works' },
    { name: 'Subagents',      desc: 'Specialists Codepet hands the right job to' },
    { name: 'Guardrails',     desc: 'Limits you set — Codepet stays inside them' },
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
    { key: 'eng',     name: 'Engineering', need: 'Ship the work and verify every change.',        color: '#2563EB', cover: '/v3/covers/code-pyramid.jpg', photo: true },
    { key: 'mkt',     name: 'Marketing',   need: 'Find the words and the launch sequence.',        color: '#FF8C42', cover: '/v3/covers/code-drummer.jpg', photo: true },
    { key: 'ops',     name: 'Operations',  need: 'Stand up the machinery behind the scenes.',      color: '#2DD4BF', cover: '/v3/coder-burst.jpg', photo: true },
    { key: 'fin',     name: 'Finance',     need: 'Model the numbers, price with confidence.',      color: '#FDB022', cover: '/v3/covers/code-chess.jpg', photo: true },
    { key: 'legal',   name: 'Legal',       need: 'Cover the basics from sensible templates.',      color: '#9333EA', cover: '/v3/covers/legal.png' },
    { key: 'design',  name: 'Design',      need: 'Make the first run feel like magic.',            color: '#A855F7', cover: '/v3/covers/code-book.jpg', photo: true },
    { key: 'sales',   name: 'Sales',       need: 'Land your first real users, personally.',        color: '#7C3AED', cover: '/v3/covers/code-guitar.jpg', photo: true },
    { key: 'support', name: 'Support',     need: 'Answer once, then keep triage running quietly.', color: '#FF6B9D', cover: '/v3/covers/support.png' },
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
  sub: 'Codepet is free on macOS. byte is ready whenever you are.',
  ctaPrimary: 'Download for macOS',
  ctaSecondary: 'Read the Build Log',
}

export const FOOTER = {
  tagline: 'Your AI cofounder for macOS.',
  links: [
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Download', href: '/download' },
  ],
  copyright: '© 2026 Codepet — built by Outcasts.',
}
