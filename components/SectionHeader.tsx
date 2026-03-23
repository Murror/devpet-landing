interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-14">
      <p className="text-xs font-bold text-mint uppercase tracking-[0.12em] mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-[38px] font-black tracking-[-1.5px] mb-3">{title}</h2>
      {subtitle && <p className="text-base text-muted leading-relaxed max-w-[480px]">{subtitle}</p>}
    </div>
  )
}
