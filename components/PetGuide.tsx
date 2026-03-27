'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { useCompanion, SectionKey } from '@/lib/CompanionContext'
import { useLocale } from '@/lib/LocaleProvider'
import CharacterSvg from './CharacterSvg'

// Waypoints define where the pet sits at each scroll percentage
// side: 'left' | 'right' — which margin the pet floats in
// verticalPct: viewport Y position as % (0 = top, 100 = bottom)
interface Waypoint {
  scrollPct: number
  side: 'left' | 'right'
  verticalPct: number
  section: SectionKey
}

const WAYPOINTS: Waypoint[] = [
  { scrollPct: 0,    side: 'right', verticalPct: 60, section: 'hero' },
  { scrollPct: 0.18, side: 'left',  verticalPct: 45, section: 'howItWorks' },
  { scrollPct: 0.38, side: 'right', verticalPct: 50, section: 'features' },
  { scrollPct: 0.58, side: 'left',  verticalPct: 40, section: 'skillTree' },
  { scrollPct: 0.78, side: 'right', verticalPct: 50, section: 'testimonials' },
  { scrollPct: 0.95, side: 'left',  verticalPct: 55, section: 'finalCTA' },
]

// Character-specific idle animations based on personality from Meet Your Pet section
// Byte: "The Chaotic Core" — spirit blob, mysterious, analytical → glitchy vibration
// Nova: "The Genius Mentor" — fire fox, smart, teaching → confident gentle sway
// Sage: "The Wise Guide" — ancient owl, patient, deep → slow meditative bob
// Glitch: "The Hacker Rebel" — rogue cat, chaotic, rule-breaker → erratic jitter
// Crash: "The Brute Force Hero" — fearless bear, hyper, ships fast → aggressive bounce
// Zero: "The Silent Optimiser" — code wraith, minimal, silent → barely perceptible drift
// Luna: "The Creative Builder" — indie dreamer, bubbly, fun → playful wiggle
// Null: "The Wild Card" — slime, undefined, eerie → glitchy flicker
const CHARACTER_ANIMATIONS: Record<string, { animate: Record<string, number[]>; transition: Record<string, unknown> }> = {
  Byte: {
    animate: { rotate: [0, -2, 2, -1, 3, -2, 0], scale: [1, 1.02, 0.98, 1.01, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  Nova: {
    animate: { rotate: [0, -5, 5, 0], y: [0, -3, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  Sage: {
    animate: { y: [0, -4, 0], rotate: [0, 1, 0, -1, 0] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  Glitch: {
    animate: { x: [0, -3, 4, -2, 3, 0], rotate: [0, -4, 5, -3, 0], scale: [1, 1.03, 0.97, 1.02, 1] },
    transition: { duration: 1.2, repeat: Infinity, ease: 'linear' },
  },
  Crash: {
    animate: { y: [0, -8, 0, -5, 0], scale: [1, 1.05, 0.95, 1.03, 1] },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
  Zero: {
    animate: { opacity: [1, 0.85, 1], y: [0, -1, 0] },
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
  Luna: {
    animate: { rotate: [0, -8, 8, -5, 5, 0], y: [0, -4, 0, -2, 0] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  Null: {
    animate: { opacity: [1, 0.4, 1, 0.7, 1], x: [0, -2, 3, -1, 0], scale: [1, 0.98, 1.02, 1] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
}

// Fallback for unknown characters
const DEFAULT_ANIMATION = {
  animate: { y: [0, -4, 0] },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
}

const FUN_QUOTES_EN = [
  'Hehe!', 'Code more!', 'Bug-free zone!', 'Ship it!', 'Nice one!',
  'You got this!', "Let's go!", 'Woohoo!', 'Keep going!', 'Epic!',
]

const FUN_QUOTES_VI = [
  'Hehe!', 'Code thêm đi!', 'Không có bug!', 'Ship thôi!', 'Ngon lắm!',
  'Cậu làm được!', 'Đi thôi!', 'Woohoo!', 'Tiếp tục nào!', 'Đỉnh!',
]

// Interpolate between waypoints given a scroll progress value
function getInterpolatedState(progress: number) {
  if (progress <= WAYPOINTS[0].scrollPct) return WAYPOINTS[0]
  if (progress >= WAYPOINTS[WAYPOINTS.length - 1].scrollPct) return WAYPOINTS[WAYPOINTS.length - 1]

  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i]
    const b = WAYPOINTS[i + 1]
    if (progress >= a.scrollPct && progress <= b.scrollPct) {
      const t = (progress - a.scrollPct) / (b.scrollPct - a.scrollPct)
      // Interpolate vertical position
      const verticalPct = a.verticalPct + (b.verticalPct - a.verticalPct) * t
      // Side switches at midpoint between waypoints
      const side = t < 0.5 ? a.side : b.side
      // Section switches at midpoint
      const section = t < 0.5 ? a.section : b.section
      return { scrollPct: progress, side, verticalPct, section }
    }
  }
  return WAYPOINTS[0]
}

// Pick a random item from an array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function PetGuide() {
  const { characterName, isMobile, setActiveSection } = useCompanion()
  const { t, locale } = useLocale()
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const [currentState, setCurrentState] = useState(() => getInterpolatedState(0))
  const [showSpeech, setShowSpeech] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<string | null>(null)
  const [clickQuote, setClickQuote] = useState<string | null>(null)
  const clickCooldown = useRef(false)
  const prevSection = useRef<SectionKey | null>(null)
  const speechTimeout = useRef<NodeJS.Timeout | null>(null)
  const idleTimeout = useRef<NodeJS.Timeout | null>(null)
  const quoteIndex = useRef<Record<string, number>>({})

  const funQuotes = ((t as Record<string, unknown>).funQuotes as string[] | undefined) ?? (locale === 'vi' ? FUN_QUOTES_VI : FUN_QUOTES_EN)

  // Get quotes for current character + section (now arrays)
  const getQuote = useCallback((section: SectionKey) => {
    const charQuotes = (t.companionQuotes as Record<string, Record<string, string | string[]>>)?.[characterName || '']
    if (!charQuotes) return null
    const sectionQuotes = charQuotes[section]
    if (!sectionQuotes) return null
    // Support both old string format and new array format
    if (typeof sectionQuotes === 'string') return sectionQuotes
    // Cycle through quotes in order
    const key = `${characterName}-${section}`
    const idx = (quoteIndex.current[key] || 0) % sectionQuotes.length
    quoteIndex.current[key] = idx + 1
    return sectionQuotes[idx]
  }, [t, characterName])

  // Get idle chatter for current character
  const getIdleChatter = useCallback(() => {
    const chatter = (t as Record<string, unknown>).idleChatter as Record<string, string[]> | undefined
    if (!chatter || !characterName) return null
    const lines = chatter[characterName]
    if (!lines || lines.length === 0) return null
    return pickRandom(lines)
  }, [t, characterName])

  // Start idle chatter timer
  const startIdleTimer = useCallback(() => {
    if (idleTimeout.current) clearTimeout(idleTimeout.current)
    // 2 second delay before next idle chatter
    const delay = 2000
    idleTimeout.current = setTimeout(() => {
      const chatter = getIdleChatter()
      if (chatter) {
        setCurrentQuote(chatter)
        setShowSpeech(true)
        // Hide after 3s, then restart idle timer
        if (speechTimeout.current) clearTimeout(speechTimeout.current)
        speechTimeout.current = setTimeout(() => {
          setShowSpeech(false)
          // After hiding, show a new idle chatter again
          startIdleTimer()
        }, 3500)
      }
    }, delay)
  }, [getIdleChatter])

  // Track scroll and update pet state continuously
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const state = getInterpolatedState(v)
    setCurrentState(state)

    // Update active section in context
    if (state.section !== prevSection.current) {
      prevSection.current = state.section
      setActiveSection(state.section)
      setClickQuote(null)

      // Pick a new quote for this section
      const quote = getQuote(state.section)
      setCurrentQuote(quote)

      // Show speech after a short delay
      setShowSpeech(false)
      if (speechTimeout.current) clearTimeout(speechTimeout.current)
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
      speechTimeout.current = setTimeout(() => {
        setShowSpeech(true)
        // Start idle timer after speech shows — it will cycle quotes when user stops scrolling
        startIdleTimer()
      }, 600)
    }
  })

  // Show initial speech
  useEffect(() => {
    if (characterName) {
      const quote = getQuote('hero')
      setCurrentQuote(quote)
      speechTimeout.current = setTimeout(() => {
        setShowSpeech(true)
        startIdleTimer()
      }, 1000)
    }
    return () => {
      if (speechTimeout.current) clearTimeout(speechTimeout.current)
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
    }
  }, [characterName])

  // Click interaction
  const handleClick = useCallback(() => {
    if (clickCooldown.current) return
    clickCooldown.current = true
    setTimeout(() => { clickCooldown.current = false }, 1000)

    const quote = pickRandom(funQuotes)
    setClickQuote(quote)
    setShowSpeech(false)
    if (idleTimeout.current) clearTimeout(idleTimeout.current)

    setTimeout(() => {
      setClickQuote(null)
      setShowSpeech(true)
      startIdleTimer()
    }, 1500)
  }, [funQuotes, startIdleTimer])

  if (!characterName) return null

  const sectionQuote = currentQuote
  const charData = t.meetYourPet.characters.find(c => c.name === characterName)
  const color = charData?.color || '#34D399'
  const charAnim = CHARACTER_ANIMATIONS[characterName] || DEFAULT_ANIMATION

  // Compute position
  const isLeft = currentState.side === 'left'
  const topPct = `${currentState.verticalPct}%`

  // Mobile: fixed corner mode
  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2">
        <AnimatePresence>
          {(showSpeech && sectionQuote && !clickQuote) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.2 }}
              className="max-w-[180px] px-3 py-2 rounded-xl text-[11px] font-medium shadow-lg"
              style={{
                backgroundColor: color + '18',
                border: `1.5px solid ${color}30`,
                color: '#1A2E23',
              }}
            >
              {sectionQuote}
            </motion.div>
          )}
          {clickQuote && (
            <motion.div
              key="click-quote"
              initial={{ opacity: 0, scale: 0.8, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg"
              style={{ backgroundColor: color, color: '#fff' }}
            >
              {clickQuote}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="w-10 h-10 cursor-pointer"
          animate={prefersReducedMotion ? {} : charAnim.animate}
          transition={prefersReducedMotion ? {} : charAnim.transition}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
        >
          <CharacterSvg name={characterName} className="w-full h-full drop-shadow-md" />
        </motion.div>
      </div>
    )
  }

  // Desktop: scroll-linked companion floating in margins
  return (
    <motion.div
      className="fixed z-[80] pointer-events-none"
      animate={{
        top: topPct,
        left: isLeft ? 'clamp(8px, 2vw, 32px)' : 'auto',
        right: isLeft ? 'auto' : 'clamp(8px, 2vw, 32px)',
        x: isLeft ? 0 : 0,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : { type: 'spring', stiffness: 120, damping: 25, mass: 0.6 }
      }
      style={{ width: 64, height: 64 }}
    >
      {/* Pet character */}
      <motion.div
        className="w-16 h-16 cursor-pointer pointer-events-auto"
        animate={prefersReducedMotion ? {} : charAnim.animate}
        transition={prefersReducedMotion ? {} : charAnim.transition}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85, rotate: Math.random() > 0.5 ? 15 : -15 }}
        onClick={handleClick}
        aria-hidden="true"
      >
        <CharacterSvg name={characterName} className="w-full h-full drop-shadow-lg" />
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeech && sectionQuote && !clickQuote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`absolute top-1/2 -translate-y-1/2 w-max max-w-[200px] px-3 py-2 rounded-xl text-[12px] font-medium shadow-lg pointer-events-none ${
              isLeft ? 'left-[calc(100%+10px)]' : 'right-[calc(100%+10px)]'
            }`}
            style={{
              backgroundColor: color + '15',
              border: `1.5px solid ${color}30`,
              color: '#1A2E23',
            }}
          >
            {sectionQuote}
            {/* Arrow pointing toward pet */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 ${
                isLeft ? '-left-1.5' : '-right-1.5'
              }`}
              style={{
                backgroundColor: color + '15',
                ...(isLeft
                  ? { borderLeft: `1.5px solid ${color}30`, borderBottom: `1.5px solid ${color}30` }
                  : { borderRight: `1.5px solid ${color}30`, borderTop: `1.5px solid ${color}30` }),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click quote */}
      <AnimatePresence>
        {clickQuote && (
          <motion.div
            key="click-bubble"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -10 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-lg pointer-events-none"
            style={{ backgroundColor: color, color: '#fff' }}
          >
            {clickQuote}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle particles on click */}
      <AnimatePresence>
        {clickQuote && !prefersReducedMotion && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{
                  backgroundColor: color,
                  top: '50%',
                  left: '50%',
                }}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x: [0, (Math.random() - 0.5) * 60],
                  y: [0, (Math.random() - 0.5) * 60],
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
