'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, Transition, TargetAndTransition } from 'framer-motion'
import { useCompanion, SectionKey } from '@/lib/CompanionContext'
import { useLocale } from '@/lib/LocaleProvider'
import CharacterSvg from './CharacterSvg'

interface WaypointConfig {
  pose: string
}

const WAYPOINTS: Record<SectionKey, WaypointConfig> = {
  hero: { pose: 'wave' },
  howItWorks: { pose: 'point' },
  features: { pose: 'excited' },
  skillTree: { pose: 'thinking' },
  testimonials: { pose: 'happy' },
  finalCTA: { pose: 'wave' },
}

const POSE_ANIMATIONS: Record<string, { animate: TargetAndTransition; transition: Transition }> = {
  wave: {
    animate: { rotate: [0, -10, 10, -10, 0] },
    transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 },
  },
  point: {
    animate: { x: [0, 4, 0] },
    transition: { duration: 1, repeat: Infinity, repeatDelay: 1.5 },
  },
  excited: {
    animate: { y: [0, -6, 0] },
    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.8 },
  },
  thinking: {
    animate: { rotate: [0, 5, 0, -5, 0] },
    transition: { duration: 3, repeat: Infinity },
  },
  happy: {
    animate: { rotate: [0, 3, -3, 0] },
    transition: { duration: 2, repeat: Infinity },
  },
}

const FUN_QUOTES_EN = [
  'Hehe!', 'Code more!', 'Bug-free zone!', 'Ship it!', 'Nice one!',
  'You got this!', "Let's go!", 'Woohoo!', 'Keep going!', 'Epic!',
]

const FUN_QUOTES_VI = [
  'Hehe!', 'Code thêm đi!', 'Không có bug!', 'Ship thôi!', 'Ngon lắm!',
  'Cậu làm được!', 'Đi thôi!', 'Woohoo!', 'Tiếp tục nào!', 'Đỉnh!',
]

export default function PetGuide() {
  const { characterName, activeSection, slotPositions, isMobile } = useCompanion()
  const { t, locale } = useLocale()
  const prefersReducedMotion = useReducedMotion()

  const [petPos, setPetPos] = useState<{ top: number; left: number } | null>(null)
  const [showSpeech, setShowSpeech] = useState(false)
  const [clickQuote, setClickQuote] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const clickCooldown = useRef(false)
  const prevSection = useRef<SectionKey | null>(null)
  const speechTimeout = useRef<NodeJS.Timeout | null>(null)

  const funQuotes = ((t as Record<string, unknown>).funQuotes as string[] | undefined) ?? (locale === 'vi' ? FUN_QUOTES_VI : FUN_QUOTES_EN)

  // Update position when activeSection changes
  useEffect(() => {
    if (!activeSection || !slotPositions[activeSection]) return

    const slot = slotPositions[activeSection]!
    const newPos = {
      top: slot.top,
      left: slot.left,
    }

    if (prevSection.current !== activeSection) {
      setIsTransitioning(true)
      setShowSpeech(false)
      setClickQuote(null)
      prevSection.current = activeSection
    }

    setPetPos(newPos)
  }, [activeSection, slotPositions])

  // Show speech bubble after landing
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false)
    if (speechTimeout.current) clearTimeout(speechTimeout.current)
    speechTimeout.current = setTimeout(() => setShowSpeech(true), 300)
  }, [])

  // Click interaction
  const handleClick = useCallback(() => {
    if (clickCooldown.current) return
    clickCooldown.current = true
    setTimeout(() => { clickCooldown.current = false }, 1000)

    const quote = funQuotes[Math.floor(Math.random() * funQuotes.length)]
    setClickQuote(quote)
    setShowSpeech(false)

    setTimeout(() => {
      setClickQuote(null)
      if (activeSection) setShowSpeech(true)
    }, 1500)
  }, [funQuotes, activeSection])

  // Cleanup
  useEffect(() => {
    return () => {
      if (speechTimeout.current) clearTimeout(speechTimeout.current)
    }
  }, [])

  if (!characterName || !activeSection) return null

  const quotes = (t.companionQuotes as Record<string, Record<string, string>>)?.[characterName]
  const sectionQuote = activeSection ? quotes?.[activeSection] : null
  const charData = t.meetYourPet.characters.find(c => c.name === characterName)
  const color = charData?.color || '#34D399'
  const pose = WAYPOINTS[activeSection]?.pose || 'wave'
  const poseAnim = POSE_ANIMATIONS[pose] || POSE_ANIMATIONS.wave

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
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
        >
          <CharacterSvg name={characterName} className="w-full h-full drop-shadow-md" />
        </motion.div>
      </div>
    )
  }

  // Desktop: inline bounce mode
  if (!petPos) return null

  const bounceTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 300, damping: 20, mass: 0.8 }

  return (
    <motion.div
      className="absolute z-[80] pointer-events-none"
      style={{ width: 64, height: 64 }}
      animate={{ top: petPos.top, left: petPos.left }}
      transition={bounceTransition}
      onAnimationComplete={handleTransitionEnd}
    >
      {/* Pet character */}
      <motion.div
        className="w-16 h-16 cursor-pointer pointer-events-auto"
        {...(prefersReducedMotion ? {} : poseAnim)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85, rotate: Math.random() > 0.5 ? 15 : -15 }}
        onClick={handleClick}
        aria-hidden="true"
      >
        <CharacterSvg name={characterName} className="w-full h-full drop-shadow-lg" />
      </motion.div>

      {/* Squash & stretch on land */}
      {isTransitioning && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          animate={{
            scaleY: [1, 0.8, 1.1, 1],
            scaleX: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeech && sectionQuote && !clickQuote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-2 left-[calc(100%+8px)] w-max max-w-[220px] px-3 py-2 rounded-xl text-[12px] font-medium shadow-lg pointer-events-none"
            style={{
              backgroundColor: color + '15',
              border: `1.5px solid ${color}30`,
              color: '#1A2E23',
            }}
          >
            {sectionQuote}
            <div
              className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rotate-45"
              style={{
                backgroundColor: color + '15',
                borderLeft: `1.5px solid ${color}30`,
                borderBottom: `1.5px solid ${color}30`,
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
