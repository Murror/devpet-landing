'use client'

import { useLocale } from '@/lib/LocaleProvider'

export default function AppWindowMockup() {
  const { t } = useLocale()
  const m = t.mockup

  return (
    <div className="bg-card-bg border border-border rounded-lg shadow-app overflow-hidden hidden md:block">
      {/* Title bar */}
      <div className="bg-[#F5F3EF] border-b border-border px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF6058]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        <span className="mx-auto text-xs text-muted font-medium">VibeMon</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Greeting */}
        <div>
          <p className="text-[10px] font-bold text-mint tracking-widest uppercase">◆ VibeMon</p>
          <p className="text-lg font-extrabold text-text mt-0.5">{m.greeting}</p>
        </div>

        {/* Live session */}
        <div className="bg-[#F0FAF4] border border-[rgba(107,203,119,0.2)] rounded-lg px-3 py-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6BCB77] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#2E7D32]">{m.sessionLabel}</span>
            </div>
            <span className="text-[10px] font-mono text-[#6BCB77]">{m.sessionTime}</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            <span className="text-[10px] bg-white border border-border rounded px-1.5 py-0.5 flex items-center gap-1">
              ⌨️ <strong>{m.tool1}</strong> <span className="text-muted">{m.tool1Detail}</span>
              <span className="w-1 h-1 rounded-full bg-[#6BCB77]" />
            </span>
            <span className="text-[10px] bg-white border border-border rounded px-1.5 py-0.5 flex items-center gap-1">
              🤖 <strong>{m.tool2}</strong> <span className="text-muted">{m.tool2Detail}</span>
              <span className="w-1 h-1 rounded-full bg-[#D89840]" />
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white border border-border rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xl font-extrabold font-mono leading-none">{m.streak}</p>
              <p className="text-[9px] text-muted mt-0.5">{m.streakLabel}</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <div className="relative w-10 h-10">
              <svg width="40" height="40" className="-rotate-90">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#EBE8DF" strokeWidth="3" />
                <circle cx="20" cy="20" r="16" fill="none" stroke="#6BCB77" strokeWidth="3"
                  strokeDasharray="100.5" strokeDashoffset="33.5" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold font-mono">{m.goal}</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold">{m.goalLabel}</p>
              <p className="text-[9px] text-muted">{m.goalSub}</p>
            </div>
          </div>
        </div>

        {/* Today's focus */}
        <div>
          <p className="text-xs font-extrabold mb-2">{m.focusTitle}</p>
          <div className="flex flex-col gap-1.5">
            <div className="bg-white border border-border rounded-lg px-3 py-2 flex items-center gap-2.5">
              <span className="text-sm">📏</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold">{m.focus1}</span>
                  <span className="text-[8px] font-bold text-[#E06050] bg-[#FEF0EE] px-1 py-px rounded">HIGH</span>
                </div>
                <p className="text-[9px] text-muted">{m.focus1Why}</p>
              </div>
            </div>
            <div className="bg-white border border-border rounded-lg px-3 py-2 flex items-center gap-2.5">
              <span className="text-sm">📄</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold">{m.focus2}</span>
                  <span className="text-[8px] font-bold text-[#E06050] bg-[#FEF0EE] px-1 py-px rounded">HIGH</span>
                </div>
                <p className="text-[9px] text-muted">{m.focus2Why}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Yesterday's lesson */}
        <div className="bg-white border border-border rounded-lg px-3 py-2.5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6BCB77] to-transparent" />
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🎯</span>
            <div>
              <p className="text-[8px] font-bold text-[#6BCB77] uppercase">{m.lessonSkill}</p>
              <p className="text-[12px] font-semibold">{m.lessonText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
