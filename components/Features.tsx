'use client'

import { useLocale } from '@/lib/LocaleProvider'
import SectionHeader from './SectionHeader'

const iconBgClasses = ['bg-mint-light', 'bg-yellow-bg', 'bg-purple-bg']

export default function Features() {
  const { t } = useLocale()

  return (
    <section className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 border-t border-border">
      <SectionHeader
        eyebrow={t.features.eyebrow}
        title={t.features.title}
        subtitle={t.features.subtitle}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {t.features.cards.map((card, i) => (
          <div key={card.title} className="bg-card-bg border border-border rounded-lg p-7 shadow-card hover:shadow-hover transition-shadow">
            <div className={`w-12 h-12 ${iconBgClasses[i]} rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {card.icon}
            </div>
            <h3 className="text-base font-extrabold mb-2">{card.title}</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">{card.desc}</p>
            <ul className="flex flex-col gap-1.5">
              {card.bullets.map(b => (
                <li key={b} className="flex gap-2 items-start text-sm text-muted">
                  <span className="text-[10px] text-mint mt-1 flex-shrink-0">✦</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
