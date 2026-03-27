'use client'

import { useEffect, useRef } from 'react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const charFiles: Record<string, string> = {
  Byte: `${basePath}/characters/byte.svg`,
  Nova: `${basePath}/characters/nova.svg`,
  Sage: `${basePath}/characters/sage.svg`,
  Glitch: `${basePath}/characters/glitch.svg`,
  Crash: `${basePath}/characters/crash.svg`,
  Zero: `${basePath}/characters/zero.svg`,
  Luna: `${basePath}/characters/luna.svg`,
  Null: `${basePath}/characters/null.svg`,
}

export default function CharacterSvg({ name, className }: { name: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const file = charFiles[name]
    if (!file || !ref.current) return

    fetch(file)
      .then(res => res.text())
      .then(svgText => {
        if (!ref.current) return
        const clean = svgText.replace(/<\?xml[^?]*\?>/, '').trim()
        ref.current.innerHTML = clean
        const svg = ref.current.querySelector('svg')
        if (svg) {
          svg.removeAttribute('width')
          svg.removeAttribute('height')
          svg.style.width = '100%'
          svg.style.height = '100%'
        }
      })
  }, [name])

  return <div ref={ref} className={className} suppressHydrationWarning />
}
