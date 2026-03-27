interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-14">
      <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{eyebrow}</p>
      <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading mb-3">{title}</h2>
      {subtitle && <p className="text-[17px] text-muted leading-relaxed max-w-[480px]">{subtitle}</p>}
    </div>
  )
}
