'use client'

import { useLocale } from '@/lib/LocaleProvider'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

const moodBorderBg = [
  'border-mood-flow bg-mint-light',
  'border-mood-stuck bg-yellow-bg',
  'border-mood-milestone bg-purple-bg',
  'border-mood-thinking bg-warm-bg',
]

export default function MeetYourPet() {
  const { t } = useLocale()
  const { moods } = t.meetYourPet

  return (
    <section id="meet-your-pet" className="bg-meet-gradient border-t border-b border-border py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <div>
            <p className="text-xs font-bold text-mint uppercase tracking-[0.12em] mb-3">{t.meetYourPet.eyebrow}</p>
            <h2 className="text-3xl md:text-[38px] font-black tracking-[-1.5px] mb-4">{t.meetYourPet.title}</h2>
            <p className="text-base text-muted leading-[1.7] mb-8">{t.meetYourPet.body}</p>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="w-2 h-2 bg-mint rounded-full flex-shrink-0" />
              {t.meetYourPet.growthNote}
            </div>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood, i) => (
            <ScrollReveal key={mood.label} delay={i * 150}>
              <div className={`border rounded-lg p-4 flex items-center gap-3 h-full ${moodBorderBg[i]}`}>
                <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                <Icon name={mood.icon} className="w-5 h-5 text-text" />
              </div>
                <div>
                  <p className="text-sm font-bold text-text mb-0.5">{mood.label}</p>
                  <p className="text-xs text-muted">{mood.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
