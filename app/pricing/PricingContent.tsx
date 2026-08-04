'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/LocaleProvider'

// Same stable branded URL the /download page uses — redirects (see
// next.config.ts) to the latest GitHub release asset.
const DMG_URL = '/download/Codepet.dmg'

const AppleGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.36 12.78c-.02-2.13 1.74-3.15 1.82-3.2-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.78-3.25.78-.67 0-1.7-.76-2.8-.74-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.55 2.19 2.66 2.15 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.88-1.05 2.58-2.09.81-1.19 1.15-2.35 1.17-2.41-.03-.01-2.24-.86-2.26-3.4zM14.2 6.4c.59-.72.99-1.71.88-2.7-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.6.95.08 1.92-.48 2.51-1.18z" />
  </svg>
)

/**
 * /pricing — the two plans from the locked pricing spec (Notion "Codepet
 * pricing plan", decisions locked Jul 14): credits as the billing unit, an
 * expiring 7-day trial with no permanent free tier, Pro at $20/mo with 800
 * credits included and $0.05/credit overage.
 *
 * ONLY ONE CTA IS REAL. There is no Stripe checkout yet, so the Pro card does
 * NOT get a button that pretends to sell anything — the same call the native
 * app's BillingPanel made ("inventing a button here would be inventing a
 * route"). Both plans start the same way, by downloading the app, so Download
 * is the single live action and Pro is honestly marked as opening at launch.
 * Swap the Pro line for a real checkout link when Stripe lands.
 *
 * Localized through the same useLocale() context as the rest of the v2 site.
 */
export default function PricingContent() {
  const { locale } = useLocale()
  const vi = locale === 'vi'

  const trialPoints = vi
    ? [
        'Đầy đủ tính năng của Pro',
        '~150 tín dụng',
        'Hết tín dụng hoặc hết hạn thì dừng — không tự động trừ tiền',
      ]
    : [
        'Every Pro feature, nothing held back',
        '~150 credits to spend',
        'Stops when it runs out — nothing is ever charged automatically',
      ]

  const proPoints = vi
    ? [
        '800 tín dụng mỗi tháng (~400 lần tạo)',
        'Vượt mức: $0.05/tín dụng, chỉ trả cho phần dùng thêm',
        'Trò chuyện gần như không giới hạn (~0.25 tín dụng/tin nhắn)',
      ]
    : [
        '800 credits a month — around 400 generations',
        'Past that, $0.05 per credit. You only pay for what you use',
        'Chat stays effectively unlimited (~0.25 credits a message)',
      ]

  const creditRows = vi
    ? [
        { k: 'Một tin nhắn trò chuyện', v: '~0.25 tín dụng' },
        { k: 'Gợi ý bước tiếp theo, ghi nhớ một quyết định', v: '1 tín dụng' },
        { k: 'Dựng lộ trình cho công ty của bạn', v: '2 tín dụng' },
        { k: 'Một sản phẩm hoàn chỉnh — tài liệu, trang đích, kế hoạch', v: '4 tín dụng' },
      ]
    : [
        { k: 'One chat message', v: '~0.25 credits' },
        { k: 'Suggesting your next step, remembering a decision', v: '1 credit' },
        { k: 'Scaffolding a roadmap for your company', v: '2 credits' },
        { k: 'A finished deliverable — a doc, a landing page, a plan', v: '4 credits' },
      ]

  return (
    <div className={'v2-root min-h-screen' + (vi ? ' v2-root--vi' : '')}>
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        {/* NOTE ON COLOUR: `.v2-root` is a DARK shell — it sets background #000
            and white text (app/v2/fonts.css). Anything outside a card therefore
            needs light type. The light Tailwind tokens (text-heading, text-text)
            are for the white card surfaces only; using them out here renders
            near-black on black, which is exactly the live defect on /download. */}
        <Link href="/" className="mb-10 text-sm text-muted-light no-underline hover:text-white">
          ← {vi ? 'Trang chủ' : 'Home'}
        </Link>

        <span className="mb-4 rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          {vi ? 'Giá' : 'Pricing'}
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {vi ? 'Dùng thử miễn phí. Trả tiền khi thấy hiệu quả.' : 'Start free. Pay when it’s working.'}
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-light">
          {vi
            ? 'Bạn trả tiền cho những gì AI thực sự làm — không phải một hạn mức cứng mỗi ngày.'
            : 'You pay for what the AI actually does, not a flat number of actions a day.'}
        </p>

        {/* Two plans. Pro is the emphasized card, but it is NOT the live CTA —
            see the component note: there is no checkout to send anyone to yet. */}
        <div className="mt-12 grid w-full gap-5 sm:grid-cols-2">
          {/* ── Trial ─────────────────────────────────────────────────────── */}
          <section className="flex flex-col rounded-2xl border border-border bg-surface p-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {vi ? 'Dùng thử' : 'Trial'}
            </h2>
            <p className="mt-3 text-3xl font-bold text-heading">{vi ? 'Miễn phí' : 'Free'}</p>
            <p className="mt-1 text-sm text-muted">{vi ? '7 ngày' : 'for 7 days'}</p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {trialPoints.map((p, i) => (
                <li key={i} className="text-sm text-text">
                  {p}
                </li>
              ))}
            </ul>

            <a
              href={DMG_URL}
              className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white no-underline shadow-[0_4px_0_#2D2466] transition hover:translate-y-px hover:shadow-[0_3px_0_#2D2466]"
            >
              <AppleGlyph />
              {vi ? 'Tải cho macOS' : 'Download for macOS'}
            </a>
            <p className="mt-2 text-center text-xs text-muted">
              {vi ? 'Yêu cầu macOS 13 trở lên' : 'Requires macOS 13 or later'}
            </p>
          </section>

          {/* ── Pro ───────────────────────────────────────────────────────── */}
          <section className="flex flex-col rounded-2xl border-2 border-primary bg-bg p-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Pro</h2>
            <p className="mt-3 text-3xl font-bold text-heading">
              $20
              <span className="text-base font-medium text-muted">{vi ? '/tháng' : '/month'}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {vi ? 'Gói dùng hằng ngày' : 'The everyday plan'}
            </p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {proPoints.map((p, i) => (
                <li key={i} className="text-sm text-text">
                  {p}
                </li>
              ))}
            </ul>

            {/* Deliberately not a button: nothing to click through to until
                Stripe ships. A disabled-looking control would still invite a
                click and teach people the page is broken. */}
            <p className="mt-6 rounded-2xl border border-border bg-surface px-6 py-3.5 text-center text-sm font-medium text-muted">
              {vi ? 'Mở khi ra mắt' : 'Opens at launch'}
            </p>
            <p className="mt-2 text-center text-xs text-muted">
              {vi
                ? 'Bắt đầu bằng bản dùng thử — nâng cấp ngay trong ứng dụng.'
                : 'Start with the trial — you’ll upgrade from inside the app.'}
            </p>
          </section>
        </div>

        {/* ── What a credit is ─────────────────────────────────────────────
            The number people will actually ask about. Grounded in the locked
            spec's cost anchoring, not invented: light 1 / medium 2 / heavy 4,
            chat metered separately at ~0.25. */}
        <section className="mt-14 w-full rounded-2xl border border-border bg-surface p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {vi ? 'Một tín dụng là gì?' : 'What’s a credit?'}
          </h2>
          <p className="mt-3 text-sm text-text">
            {vi
              ? 'Một tín dụng tương đương một lần AI làm việc nhẹ. Việc càng nặng thì càng tốn nhiều — nên bạn trả đúng theo mức mình dùng.'
              : 'A credit is roughly one light piece of AI work. Heavier work costs more, so what you pay tracks what you actually asked for.'}
          </p>
          <ul className="mt-4 divide-y divide-border">
            {creditRows.map((r, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="text-sm text-text">{r.k}</span>
                <span className="shrink-0 text-sm font-semibold text-heading">{r.v}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            {vi
              ? '800 tín dụng của gói Pro tương đương khoảng 400 lần tạo mỗi tháng.'
              : 'Pro’s 800 credits work out to roughly 400 generations a month.'}
          </p>
        </section>

        {/* Outside a card → light type, same reason as the header above. */}
        <p className="mt-8 max-w-lg text-sm text-muted-light">
          {vi
            ? 'Bản dùng thử dừng lại khi hết tín dụng — không có thẻ, không tự động gia hạn.'
            : 'The trial simply stops when the credits run out. No card up front, nothing auto-renews.'}
        </p>
      </main>
    </div>
  )
}
