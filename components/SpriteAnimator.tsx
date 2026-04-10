'use client'

import { useEffect, useRef, useState } from 'react'

interface SpriteAnimatorProps {
  /** Path to the sprite sheet image */
  src: string
  /** Number of frames in the sprite sheet */
  frameCount: number
  /** Number of columns in the sprite sheet (default: frameCount = single row) */
  cols?: number
  /** Frames per second */
  fps?: number
  /** Whether to loop the animation */
  loop?: boolean
  /** CSS class for the container */
  className?: string
}

export default function SpriteAnimator({
  src,
  frameCount,
  cols,
  fps = 10,
  loop = true,
  className = '',
}: SpriteAnimatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const frameRef = useRef(0)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef(0)

  // Load image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgRef.current = img
      setLoaded(true)
    }
    img.src = src
  }, [src])

  // Animation loop
  useEffect(() => {
    if (!loaded || !imgRef.current) return

    const img = imgRef.current
    const numCols = cols ?? frameCount // default: all frames in one row
    const numRows = Math.ceil(frameCount / numCols)
    const frameWidth = Math.floor(img.width / numCols)
    const frameHeight = Math.floor(img.height / numRows)
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = frameWidth
    canvas.height = frameHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const interval = 1000 / fps

    const animate = (time: number) => {
      if (time - lastTimeRef.current >= interval) {
        lastTimeRef.current = time

        const col = frameRef.current % numCols
        const row = Math.floor(frameRef.current / numCols)

        ctx.clearRect(0, 0, frameWidth, frameHeight)
        ctx.drawImage(
          img,
          col * frameWidth, row * frameHeight, frameWidth, frameHeight,
          0, 0, frameWidth, frameHeight,
        )

        if (loop) {
          frameRef.current = (frameRef.current + 1) % frameCount
        } else {
          frameRef.current = Math.min(frameRef.current + 1, frameCount - 1)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafRef.current)
  }, [loaded, frameCount, cols, fps, loop])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
    />
  )
}
