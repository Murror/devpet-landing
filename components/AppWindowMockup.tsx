import { Home, BookOpen, Star, BarChart3, User, Cat, Diamond } from 'lucide-react'

export default function AppWindowMockup() {
  return (
    <div className="bg-card-bg border border-border rounded-lg shadow-app overflow-hidden hidden md:block">
      {/* Title bar */}
      <div className="bg-[#F5F3EF] border-b border-border px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF6058]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        <span className="mx-auto text-xs text-muted font-medium">DevPet — Home</span>
      </div>

      {/* Body */}
      <div className="flex h-[320px]">
        {/* Sidebar */}
        <div className="w-14 border-r border-border bg-[#F9F7F4] flex flex-col items-center py-3 gap-2">
          {[
            { icon: Home, active: true },
            { icon: BookOpen, active: false },
            { icon: Star, active: false },
            { icon: BarChart3, active: false },
          ].map(({ icon: IconComp, active }, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-sm flex items-center justify-center
                ${active ? 'bg-mint-light' : ''}`}
            >
              <IconComp className={`w-4 h-4 ${active ? 'text-mint-dark' : 'text-muted'}`} />
            </div>
          ))}
          <div className="mt-auto w-9 h-9 flex items-center justify-center">
            <User className="w-4 h-4 text-muted" />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col gap-3">
          <p className="text-[10px] font-bold text-mint tracking-widest uppercase flex items-center gap-1">
            <Diamond className="w-2.5 h-2.5" /> Today&apos;s Session
          </p>

          {/* Session card */}
          <div className="bg-warm-bg border border-border rounded-sm p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[13px] font-bold text-text">Building auth flow in Cursor</span>
              <span className="text-[11px] text-muted">45 min</span>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full w-[68%] bg-mint rounded-full" />
            </div>
            <div className="flex gap-1.5 mt-2">
              <span className="text-[10px] font-semibold bg-mint-light text-mint-dark px-2 py-0.5 rounded-sm">12 prompts</span>
              <span className="text-[10px] font-semibold bg-yellow-bg text-yellow px-2 py-0.5 rounded-sm">3 errors fixed</span>
              <span className="text-[10px] font-semibold bg-purple-bg text-purple px-2 py-0.5 rounded-sm">+120 XP</span>
            </div>
          </div>

          {/* Pet bubble */}
          <div className="bg-card-bg border border-border rounded-sm p-3 flex gap-2.5 items-start">
            <div className="w-7 h-7 bg-mint-light rounded-md flex items-center justify-center flex-shrink-0">
              <Cat className="w-4 h-4 text-mint-dark" />
            </div>
            <p className="text-xs text-muted leading-relaxed italic">
              &quot;Great debugging session! You&apos;re getting better at reading error messages. Try breaking your next prompt into smaller steps.&quot;
            </p>
          </div>
        </div>

        {/* Chat panel */}
        <div className="w-[180px] border-l border-border flex flex-col p-3 gap-2">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Ask your pet</p>
          <div className="bg-warm-bg border border-border rounded-sm px-2.5 py-2 text-[11px] text-muted italic leading-relaxed">
            &quot;You&apos;ve improved your prompt clarity by 40% this week!&quot;
          </div>
          <div className="bg-mint rounded-sm px-2.5 py-2 text-[11px] text-white ml-4">
            Why does my auth keep failing?
          </div>
          <div className="bg-warm-bg border border-border rounded-sm px-2.5 py-2 text-[11px] text-muted italic leading-relaxed">
            &quot;Check your JWT expiry — it&apos;s usually set too short by default.&quot;
          </div>
          <div className="mt-auto bg-warm-bg border border-border rounded-sm px-2.5 py-2 text-[11px] text-muted-light">
            Ask anything…
          </div>
        </div>
      </div>
    </div>
  )
}
