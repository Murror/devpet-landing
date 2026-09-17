'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties } from 'react'
import ConnectorsFX from './ConnectorsFX'
import SubagentsFX from './SubagentsFX'
import GuardrailsFX from './GuardrailsFX'

export type Variant = 'glyph' | 'connectors' | 'subagents' | 'guardrails'

type Props = {
  image: string
  color: string
  eyebrow: string
  num: string
  titleLead: string
  titleIt?: string
  tagline: string
  variant: Variant
}

export default function SetupHero({
  image, color, eyebrow, num, titleLead, titleIt, tagline, variant,
}: Props) {
  const heroRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  // glyph + connectors both track the cursor via --mx/--my (mask reveal /
  // lens glow). guardrails owns its own pointer logic; subagents is autonomous.
  useEffect(() => {
    if (variant !== 'glyph' && variant !== 'connectors') return
    const hero = heroRef.current
    if (!hero) return
    if (window.matchMedia('(max-width: 820px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const move = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', `${x.toFixed(1)}%`)
        hero.style.setProperty('--my', `${y.toFixed(1)}%`)
      })
    }
    const leave = () => {
      hero.style.setProperty('--mx', '50%')
      hero.style.setProperty('--my', '42%')
    }
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    return () => {
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf.current)
    }
  }, [variant])

  return (
    <header
      ref={heroRef}
      className={`sp-hero sp-hero--${variant}`}
      style={{ ['--c']: color } as CSSProperties}
    >
      <div className="sp-hero-media">
        {variant === 'glyph' && (
          <Image className="sp-hero-img--base" src={image} alt="" fill sizes="100vw" unoptimized priority />
        )}
        <Image className="sp-hero-img--lit" src={image} alt="" fill sizes="100vw" unoptimized priority />
      </div>

      {(variant === 'glyph' || variant === 'connectors') && (
        <span className="sp-hero-lens" aria-hidden="true" />
      )}
      {variant === 'connectors' && <ConnectorsFX />}
      {variant === 'subagents' && <SubagentsFX />}
      {variant === 'guardrails' && <GuardrailsFX />}

      <span className="sp-hero-scrim" aria-hidden="true" />

      <div className="sp-hero-inner">
        <span className="sp-hero-num" aria-hidden="true">{num}</span>
        <p className="sp-eyebrow">{eyebrow}</p>
        <h1 className="sp-hero-title">
          {titleLead}
          {titleIt ? <span className="it">{titleIt}</span> : null}
        </h1>
        <p className="sp-hero-tag">{tagline}</p>
      </div>
    </header>
  )
}
