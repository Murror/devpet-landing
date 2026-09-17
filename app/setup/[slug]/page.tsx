// /setup/[slug] — a focused page behind each "Discover" card in the
// Environment ("Built on Claude Code") gallery. App Router scopes layouts
// per segment and there's no shared v3 layout above `/`, so — exactly like
// app/page.tsx — we replicate the v3 font variables + CSS + `.v3` wrapper
// here so the cinematic-dark system applies.
import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
import '../../v3/v3.css'
import '../../v3/v3-fx.css'
import '../setup.css'
import Atmosphere from '../../v3/components/Atmosphere'
import Reveal from '../../v3/components/Reveal'
import { ENVIRONMENT, SETUP, SETUP_ORDER } from '../../v3/content'
import SetupHero, { type Variant } from './SetupHero'

const gsans = Google_Sans_Flex({ subsets: ['latin'], variable: '--font-gsans', display: 'swap' })
const playfair = Playfair_Display({
  weight: ['400', '500', '600'], style: ['italic'], subsets: ['latin'],
  variable: '--font-playfair', display: 'swap',
})

type Slug = (typeof SETUP_ORDER)[number]

// Per-slug display: how the big title is split (an italic accent fragment)
// and which hero effect it gets. Only Project skills has its bespoke effect
// so far — the rest render the clean baseline while we lock the template.
const VIEW: Record<Slug, { lead: string; it?: string; variant: Variant }> = {
  'project-skills': { lead: 'Project ', it: 'skills', variant: 'glyph' },
  connectors:       { lead: 'Connectors',            variant: 'connectors' },
  subagents:        { lead: 'Sub', it: 'agents',     variant: 'subagents' },
  guardrails:       { lead: 'Guard', it: 'rails',    variant: 'guardrails' },
}

export function generateStaticParams() {
  return SETUP_ORDER.map((slug) => ({ slug }))
}

function resolve(slug: string) {
  if (!(slug in SETUP)) return null
  const key = slug as Slug
  const page = SETUP[key]
  const item = ENVIRONMENT.items[page.idx]
  return { key, page, item, view: VIEW[key] }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const r = resolve(slug)
  if (!r) return { title: 'Setup — Codepet' }
  return {
    title: `${r.item.name} — Codepet setup`,
    description: r.page.intro,
  }
}

export default async function SetupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = resolve(slug)
  if (!r) notFound()

  const { page, item, view } = r
  const idx = page.idx
  const num = String(idx + 1).padStart(2, '0')
  const nextSlug = SETUP_ORDER[(idx + 1) % SETUP_ORDER.length]
  const nextName = ENVIRONMENT.items[SETUP[nextSlug].idx].name

  return (
    <div className={`v3 ${gsans.variable} ${playfair.variable}`}>
      <Atmosphere />

      <div className="sp-top">
        <a href="/" className="sp-top-brand">Codepet</a>
        <a href="/#environment" className="sp-top-back">Back to setup</a>
      </div>

      <main className="sp">
        <SetupHero
          image={item.image}
          color={item.color}
          eyebrow={ENVIRONMENT.eyebrow}
          num={num}
          titleLead={view.lead}
          titleIt={view.it}
          tagline={item.desc}
          variant={view.variant}
        />

        <Reveal className="sp-intro">
          <p>{page.intro}</p>
        </Reveal>

        <section className="sp-feats">
          {page.features.map((f, i) => (
            <Reveal key={f.t} delay={i * 140}>
              <article className="sp-feat" style={{ ['--c']: item.color } as CSSProperties}>
                <span className="sp-feat-idx">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="sp-feat-t">{f.t}</h2>
                <p className="sp-feat-d">{f.d}</p>
              </article>
            </Reveal>
          ))}
        </section>

        <Reveal>
          <nav className="sp-foot">
            <div>
              <span className="sp-foot-label">NEXT</span>
              <a href={`/setup/${nextSlug}`} className="sp-foot-next">
                {nextName}
              </a>
            </div>
            <a href="/#environment" className="sp-foot-home">← All of setup</a>
          </nav>
        </Reveal>
      </main>
    </div>
  )
}
