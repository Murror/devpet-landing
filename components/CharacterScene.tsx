'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CharacterSvg from './CharacterSvg'
import SpriteAnimator from './SpriteAnimator'
import { SPRITE_CHARACTERS, type SpriteState } from '@/lib/spriteConfig'

interface CharacterSceneProps {
  name: string
  color: string
  className?: string
  withBackground?: boolean
  /** Sprite animation state — if the character has sprites, this controls which animation plays */
  spriteState?: SpriteState
}

// Deterministic pseudo-random to avoid hydration mismatch
function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/* ── Floating particles ── */
function FloatingParticles({ color, count = 5, seed = 0 }: { color: string; count?: number; seed?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const r = (n: number) => seeded(seed * 100 + i * 10 + n)
        const size = 3 + r(1) * 5
        const left = 10 + r(2) * 80
        const top = 10 + r(3) * 80
        const delay = i * 0.6
        const dur = 2.5 + r(4) * 2
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              backgroundColor: color,
            }}
            animate={{
              y: [0, -20 - r(5) * 15, 0],
              x: [0, (r(6) - 0.5) * 16, 0],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        )
      })}
    </>
  )
}

/* ── Pulsing ring ── */
function PulseRing({ color, delay = 0, scale = 1.15 }: { color: string; delay?: number; scale?: number }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{ border: `2px solid ${color}` }}
      animate={{ scale: [1, scale], opacity: [0.4, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  )
}

/* ── Orbiting dots ── */
function OrbitDots({ color, count = 3 }: { color: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 360
        const delay = i * 0.8
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: color,
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [
                Math.cos((angle * Math.PI) / 180) * 55,
                Math.cos(((angle + 120) * Math.PI) / 180) * 55,
                Math.cos(((angle + 240) * Math.PI) / 180) * 55,
                Math.cos((angle * Math.PI) / 180) * 55,
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * 55,
                Math.sin(((angle + 120) * Math.PI) / 180) * 55,
                Math.sin(((angle + 240) * Math.PI) / 180) * 55,
                Math.sin((angle * Math.PI) / 180) * 55,
              ],
              opacity: [0.6, 0.9, 0.6],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay, ease: 'linear' }}
          />
        )
      })}
    </>
  )
}


/* ── Impact waves (for Crash) ── */
function ImpactWaves({ color }: { color: string }) {
  return (
    <>
      {[0, 0.8, 1.6].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-2xl pointer-events-none"
          style={{
            inset: -4 - i * 6,
            border: `2px solid ${color}`,
          }}
          animate={{
            scale: [0.95, 1.08],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 1.5,
            delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

/* ── Static noise squares (for Null) ── */
function StaticNoise({ color }: { color: string }) {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => {
        const r = (n: number) => seeded(i * 13 + n + 50)
        const size = 4 + r(1) * 8
        const left = r(2) * 90
        const top = r(3) * 90
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              backgroundColor: color,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 1.5 + r(4) * 3,
              delay: r(5) * 2,
              ease: 'linear',
            }}
          />
        )
      })}
    </>
  )
}

/* ── Main component ── */
export default function CharacterScene({ name, color, className = '', withBackground = false, spriteState = 'happy' }: CharacterSceneProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const spriteSet = SPRITE_CHARACTERS[name]
  const spriteAnim = spriteSet?.[spriteState] ?? (spriteSet ? Object.values(spriteSet)[0] : undefined)

  return (
    <div
      className={`aspect-square flex items-center justify-center mx-auto relative overflow-hidden ${withBackground ? 'max-w-[300px] rounded-2xl border border-border shadow-card' : 'max-w-[400px]'} ${className}`}
      style={withBackground ? { backgroundColor: color + '0A' } : undefined}
    >
      {/* Ambient effects — client-only to avoid hydration mismatch */}
      {mounted && (
        <>
          {name === 'Byte' && (
            <>
              <FloatingParticles color={color} count={6} seed={1} />
              <PulseRing color={color} delay={0} scale={1.1} />
              <PulseRing color={color} delay={1.2} scale={1.2} />
            </>
          )}

          {name === 'Nova' && (
            <>
              <OrbitDots color={color} count={3} />
              <FloatingParticles color="#FBBF24" count={4} seed={2} />
            </>
          )}

          {name === 'Sage' && (
            <>
              <PulseRing color={color} delay={0} scale={1.08} />
              <PulseRing color={color} delay={1.5} scale={1.12} />
              <FloatingParticles color={color} count={3} seed={3} />
            </>
          )}

          {name === 'Glitch' && (
            <>
              <FloatingParticles color={color} count={4} seed={4} />
            </>
          )}

          {name === 'Crash' && (
            <>
              <ImpactWaves color={color} />
              <FloatingParticles color={color} count={3} seed={5} />
            </>
          )}

          {name === 'Zero' && (
            <>
              <FloatingParticles color={color} count={2} seed={6} />
            </>
          )}

          {name === 'Luna' && (
            <>
              <FloatingParticles color="#FB7185" count={3} seed={7} />
              <FloatingParticles color="#FBBF24" count={2} seed={8} />
              <OrbitDots color={color} count={2} />
            </>
          )}

          {name === 'Null' && (
            <>
              <StaticNoise color={color} />
            </>
          )}

          {/* Shadow on ground */}
          <motion.div
            className="absolute bottom-[10%] left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          width: '50%',
          height: 8,
          backgroundColor: color,
          filter: 'blur(8px)',
        }}
        animate={{
          opacity: [0.15, 0.08, 0.15],
          scaleX: [1, 0.85, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Character — sprite sheet (if available) or fallback to SVG */}
      <div className="w-[65%] h-[65%] relative z-10 flex items-center justify-center">
        {spriteAnim ? (
          <SpriteAnimator
            src={spriteAnim.src}
            frameCount={spriteAnim.frameCount}
            cols={spriteAnim.cols}
            fps={spriteAnim.fps}
            loop={spriteAnim.loop}
            className="drop-shadow-lg"
          />
        ) : (
          <CharacterSvg name={name} className="w-full h-full drop-shadow-lg" />
        )}
      </div>
    </div>
  )
}
