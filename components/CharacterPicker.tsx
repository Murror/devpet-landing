'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { useCompanion } from '@/lib/CompanionContext'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSvg from './CharacterSvg'

export default function CharacterPicker() {
  const { t } = useLocale()
  const { pick, dismissPicker } = useCompanion()
  const { characters } = t.meetYourPet
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setOpen(false)
    dismissPicker()
  }

  const handlePick = (i: number) => {
    setPicked(i)
    pick(characters[i].name)
    setTimeout(handleClose, 600)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-bg rounded-2xl border-2 border-border shadow-card-lg max-w-[800px] w-full max-h-[90dvh] overflow-y-auto pointer-events-auto p-6 md:p-8">
              <div className="text-center mb-6">
                <p className="text-[13px] text-primary uppercase tracking-[2px] mb-2">{t.meetYourPet.eyebrow}</p>
                <h2 className="text-[28px] md:text-[32px] tracking-[-1px] text-heading mb-2">{t.meetYourPet.title}</h2>
                <p className="text-sm text-muted">{t.meetYourPet.body}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {characters.map((char, i) => {
                  const isHovered = hovered === i
                  const isPicked = picked === i
                  const isDimmed = picked !== null && !isPicked

                  return (
                    <motion.div
                      key={char.name}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{
                        opacity: isDimmed ? 0.3 : 1,
                        y: 0,
                        scale: isPicked ? 1.04 : 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: picked === null ? i * 0.06 : 0,
                      }}
                      onHoverStart={() => picked === null && setHovered(i)}
                      onHoverEnd={() => setHovered(null)}
                      onClick={() => picked === null && handlePick(i)}
                      whileTap={picked === null ? { y: 4, boxShadow: 'none' } : {}}
                      className={`relative bg-bg rounded-lg border-2 overflow-hidden shadow-card cursor-pointer select-none transition-[border-color] duration-150
                        ${isPicked ? 'ring-2 ring-offset-2' : ''}`}
                      style={{
                        borderColor: isHovered || isPicked ? char.color : '#E5E5E5',
                        ['--tw-ring-color' as string]: char.color,
                      }}
                    >
                      <div
                        className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: char.color + '10' }}
                      >
                        <motion.div
                          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          className="w-[70%] h-[70%]"
                        >
                          <CharacterSvg name={char.name} className="w-full h-full" />
                        </motion.div>
                      </div>

                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm text-heading">{char.name}</h3>
                          <span
                            className="text-[8px] px-1.5 py-0.5 rounded-pill"
                            style={{ backgroundColor: char.color + '18', color: char.color }}
                          >
                            {char.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted mb-1">{char.species}</p>
                        <p className="text-[10px] text-muted leading-relaxed">{char.role}</p>
                      </div>

                      <AnimatePresence>
                        {isHovered && !isPicked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 text-[10px] italic leading-relaxed" style={{ color: char.color }}>
                              &ldquo;{char.quote}&rdquo;
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {isPicked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                            style={{ backgroundColor: char.color }}
                          >
                            ✓
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              <div className="text-center mt-5">
                <button onClick={handleClose} className="text-xs text-muted hover:text-heading transition-colors">
                  {picked !== null ? t.meetYourPet.growthNote : '← Bỏ qua'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
