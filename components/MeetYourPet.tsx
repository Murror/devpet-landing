'use client'

import { useLocale } from '@/lib/LocaleProvider'

const moodBorderBg = [
  'border-mood-flow bg-[#F5FFFB]',
  'border-mood-stuck bg-[#FFFBF5]',
  'border-mood-milestone bg-[#FAFAFF]',
  'border-mood-thinking bg-[#FAFAFA]',
]

export default function MeetYourPet() {
  const { t } = useLocale()
  const { moods } = t.meetYourPet

  return (
    <section
      className="border-t border-b border-border py-16 md:py-20"
      style={{ background: 'linear-gradient(135deg, #F0FAF6 0%, #FAF8F4 40%, #F4F0FF 100%)' }}
    >
      <div className="mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-bold text-mint uppercase tracking-[0.12em] mb-3">{t.meetYourPet.eyebrow}</p>
          <h2 className="text-3xl md:text-[38px] font-black tracking-[-1.5px] mb-4">{t.meetYourPet.title}</h2>
          <p className="text-base text-muted leading-[1.7] mb-8">{t.meetYourPet.body}</p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="w-2 h-2 bg-mint rounded-full flex-shrink-0" />
            {t.meetYourPet.growthNote}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood, i) => (
            <div key={mood.label} className={`border rounded-lg p-4 flex items-center gap-3 ${moodBorderBg[i]}`}>
              <span className="text-3xl flex-shrink-0">{mood.emoji}</span>
              <div>
                <p className="text-sm font-bold text-text mb-0.5">{mood.label}</p>
                <p className="text-xs text-muted">{mood.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
