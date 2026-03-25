'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '@/lib/LocaleProvider'
import CharacterSvg from './CharacterSvg'

const sectionIds = ['waitlist', 'how-it-works', 'features', 'meet-your-pet']

const messagesEN: Record<string, string> = {
  'waitlist': "Hey! I'm Byte 👋 Scroll down and I'll show you around!",
  'how-it-works': "This is where the magic happens. 3 steps, zero stress!",
  'features': "These are my favorite features. The cat coach? That's me 😼",
  'meet-your-pet': "My crew! Click on us to hear our stories ✨",
  'final': "So... ready to join? I promise I'm a good coach 🐱",
}

const messagesVI: Record<string, string> = {
  'waitlist': "Xin chào! Mình là Byte 👋 Kéo xuống để mình dẫn bạn đi xem nhé!",
  'how-it-works': "Đây là nơi phép màu xảy ra. 3 bước, không áp lực!",
  'features': "Đây là tính năng mình thích nhất. Mèo coach á? Là mình đó 😼",
  'meet-your-pet': "Đội của mình nè! Bấm vào từng bạn để nghe câu chuyện nhé ✨",
  'final': "Vậy... sẵn sàng tham gia chưa? Mình hứa sẽ coach tốt lắm 🐱",
}

export default function ByteGuide() {
  const { locale } = useLocale()
  const [currentSection, setCurrentSection] = useState('waitlist')
  const [dismissed, setDismissed] = useState(false)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const lastSection = useRef('waitlist')
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const messages = locale === 'vi' ? messagesVI : messagesEN

  useEffect(() => {
    const init = setTimeout(() => setBubbleVisible(true), 1500)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id && id !== lastSection.current) {
              lastSection.current = id
              setCurrentSection(id)
              setBubbleVisible(true)
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
              timeoutRef.current = setTimeout(() => setBubbleVisible(false), 4000)
            }
          }
        }
      },
      { threshold: 0.3 }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = document.documentElement.scrollHeight
      if (docHeight - scrollBottom < 200 && lastSection.current !== 'final') {
        lastSection.current = 'final'
        setCurrentSection('final')
        setBubbleVisible(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setBubbleVisible(false), 5000)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(init)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (dismissed) return null

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-2"
    >
      <AnimatePresence>
        {bubbleVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl shadow-lg border border-border px-4 py-3 max-w-[220px] relative"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-border rounded-full flex items-center justify-center text-[10px] text-muted hover:text-text shadow-sm"
            >
              ✕
            </button>
            <p className="text-[12px] leading-relaxed text-text">
              {messages[currentSection] || messages['waitlist']}
            </p>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onClick={() => {
          setBubbleVisible(!bubbleVisible)
          if (!bubbleVisible && timeoutRef.current) clearTimeout(timeoutRef.current)
          if (!bubbleVisible) {
            timeoutRef.current = setTimeout(() => setBubbleVisible(false), 4000)
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, rotate: [0, -5, 5, 0] }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        className="w-16 h-16 bg-[#EEEDFE] rounded-2xl shadow-lg border-2 border-[#534AB7] cursor-pointer overflow-hidden flex items-center justify-center"
      >
        <CharacterSvg name="Byte" className="w-12 h-14" />
      </motion.div>
    </motion.div>
  )
}
