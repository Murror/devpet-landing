'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/lib/LocaleProvider'
import { DOWNLOAD_PATH, MIN_MACOS } from '@/lib/download'
import { useReleaseAvailable } from '@/lib/useReleaseAvailable'

// The comment that used to sit here named Murror/CodePet-Clean as the release host. That
// repo is not the source of truth for this project and nothing deploys from it — the
// release lives on My-Outcasts/codepet. See lib/download.ts, which now holds the URL once
// so this file and next.config.ts cannot drift.

const AppleGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.36 12.78c-.02-2.13 1.74-3.15 1.82-3.2-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.78-3.25.78-.67 0-1.7-.76-2.8-.74-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.55 2.19 2.66 2.15 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.88-1.05 2.58-2.09.81-1.19 1.15-2.35 1.17-2.41-.03-.01-2.24-.86-2.26-3.4zM14.2 6.4c.59-.72.99-1.71.88-2.7-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.6.95.08 1.92-.48 2.51-1.18z" />
  </svg>
)

/** /download — direct macOS download + install steps. Localized via the same
 *  useLocale() context as the rest of the v2 site. The button label stays
 *  "Download for macOS" in both locales. */
export default function DownloadContent() {
  const { locale } = useLocale()
  const vi = locale === 'vi'
  const [isMac, setIsMac] = useState(true)

  // Shared with the v3 nav and hero CTA, which ask the same question. See
  // lib/useReleaseAvailable.ts for why it is optimistic and why the request is deduped.
  const { released, version } = useReleaseAvailable()

  useEffect(() => {
    const ua = `${navigator.platform} ${navigator.userAgent}`.toLowerCase()
    setIsMac(ua.includes('mac'))
  }, [])

  const steps = vi
    ? [
        { t: 'Mở .dmg và cài đặt', d: 'Mở Codepet.dmg, rồi kéo Codepet vào thư mục Applications.' },
        { t: 'Mở lần đầu tiên', d: 'Trong Applications, nhấp chuột phải vào Codepet → Open, rồi bấm Open trong hộp thoại. Những lần sau sẽ mở bình thường.' },
        { t: 'Nếu macOS chặn', d: 'Vào System Settings → Privacy & Security, tìm thông báo Codepet và bấm “Open Anyway”.' },
      ]
    : [
        { t: 'Open the .dmg and install', d: 'Open Codepet.dmg, then drag Codepet into your Applications folder.' },
        { t: 'Open it the first time', d: 'In Applications, right-click Codepet → Open, then click Open in the dialog. After this first time it launches normally.' },
        { t: 'If macOS blocks it', d: 'Go to System Settings → Privacy & Security, find the Codepet message, and click “Open Anyway”.' },
      ]

  return (
    <div className={'v2-root min-h-screen' + (vi ? ' v2-root--vi' : '')}>
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        <Link href="/" className="mb-10 text-sm text-muted no-underline hover:text-heading">
          ← {vi ? 'Trang chủ' : 'Home'}
        </Link>

        <span className="mb-4 rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          macOS
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">
          {vi ? 'Tải Codepet' : 'Download Codepet'}
        </h1>
        <p className="mt-4 max-w-md text-lg text-text">
          {vi
            ? 'Người bạn đồng hành pixel-art dẫn bạn học cách lập trình agentic.'
            : 'Your pixel-art coding companion that guides you through learning to build agentic code.'}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          {released ? (
            <>
              <a
                href={DOWNLOAD_PATH}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white no-underline shadow-[0_4px_0_#2D2466] transition hover:translate-y-px hover:shadow-[0_3px_0_#2D2466]"
              >
                <AppleGlyph />
                Download for macOS
              </a>
              <p className="text-sm text-muted">
                {vi
                  ? `Yêu cầu macOS ${MIN_MACOS} trở lên · Miễn phí`
                  : `Requires macOS ${MIN_MACOS} or later · Free`}
              </p>
            </>
          ) : (
            /* No published build yet. Deliberately not a disabled-looking download button:
               the visitor came here to get something, and a dead end is a worse answer than
               an honest one plus somewhere to go. */
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-left">
              <p className="font-semibold text-heading">
                {vi ? 'Chưa phát hành' : 'Not released yet'}
              </p>
              <p className="mt-2 text-sm text-text">
                {vi
                  ? 'Bản dựng công khai đầu tiên đang được chuẩn bị. Để lại email và chúng tôi sẽ báo bạn ngay ngày nó lên.'
                  : 'The first public build is being prepared. Join the waitlist and we will tell you the day it lands.'}
              </p>
              <Link
                href="/#waitlist"
                className="mt-4 inline-flex items-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_4px_0_#2D2466] transition hover:translate-y-px hover:shadow-[0_3px_0_#2D2466]"
              >
                {vi ? 'Đăng ký nhận tin' : 'Join the waitlist'}
              </Link>
            </div>
          )}
          {!isMac && (
            <p className="text-sm font-medium text-primary">
              {vi ? 'Codepet hiện chỉ có trên macOS.' : 'Codepet is currently available for macOS only.'}
            </p>
          )}
        </div>

        {released && version && (
          <p className="mt-3 text-xs text-muted">
            {vi ? 'Phiên bản' : 'Version'} {version}
          </p>
        )}

        <section className="mt-14 w-full rounded-2xl border border-border bg-surface p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {vi ? 'Sau khi tải về' : 'After you download'}
          </h2>
          <ol className="mt-4 space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-heading">{s.t}</p>
                  <p className="text-sm text-text">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-muted">
            {vi
              ? 'Codepet đã được Apple công chứng (notarized) — đây chỉ là xác nhận một lần, không có cảnh báo “unidentified developer”.'
              : 'Codepet is notarized by Apple, so this is just a one-time confirmation — no “unidentified developer” warning.'}
          </p>
        </section>

        <section className="mt-6 w-full rounded-2xl border border-primary-tint bg-primary-tint/40 p-6 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {vi ? 'Trước khi bắt đầu' : 'Before you start'}
          </h2>
          <p className="mt-3 text-sm text-text">
            {vi
              ? 'Codepet chạy phần AI trên Claude Code của chính bạn, không phải trên máy chủ của chúng tôi — code và dữ liệu công ty của bạn không rời khỏi máy, và chúng tôi không tính phí sử dụng. Đổi lại, bạn cần cài sẵn Claude Code đã đăng nhập, cùng với Node.js. Thiếu chúng thì app vẫn mở được và báo rõ đang thiếu gì.'
              : 'Codepet runs its AI work on your own Claude Code, not on our servers — your code and your company never leave your machine, and there is no usage bill from us. That means you need Claude Code installed and signed in, plus Node.js. Without them the app still opens and tells you what is missing.'}
          </p>
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-primary"
          >
            {vi ? 'Cài Claude Code' : 'Get Claude Code'} →
          </a>
        </section>

        <p className="mt-8 text-sm text-muted">
          {vi
            ? 'Codepet hiện chỉ hỗ trợ macOS. Windows và các nền tảng khác sẽ có trong tương lai.'
            : 'Codepet is currently available for macOS only. Windows and other platforms are on the roadmap.'}
        </p>
      </main>
    </div>
  )
}
