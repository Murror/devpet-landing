'use client'

import { useEffect, useRef } from 'react'

const charFiles: Record<string, string> = {
  Byte: '/characters/byte.svg',
  Nova: '/characters/nova.svg',
  Sage: '/characters/sage.svg',
  Glitch: '/characters/glitch.svg',
  Crash: '/characters/crash.svg',
  Zero: '/characters/zero.svg',
  Luna: '/characters/luna.svg',
  Null: '/characters/null.svg',
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
        // Strip XML declaration
        const clean = svgText.replace(/<\?xml[^?]*\?>/, '').trim()
        ref.current.innerHTML = clean
        // Make SVG responsive
        const svg = ref.current.querySelector('svg')
        if (svg) {
          svg.removeAttribute('width')
          svg.removeAttribute('height')
          svg.style.width = '100%'
          svg.style.height = '100%'
        }
      })
  }, [name])

  return <div ref={ref} className={className} />
}
