const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export type SpriteState = 'idle' | 'happy' | 'sad' | 'eating' | 'sleeping' | 'walking' | 'levelup'

export interface SpriteAnimation {
  src: string
  frameCount: number
  /** Number of columns in sprite sheet (default: frameCount = single row) */
  cols?: number
  fps: number
  loop: boolean
}

export type SpriteSet = Partial<Record<SpriteState, SpriteAnimation>>

export const SPRITE_CHARACTERS: Record<string, SpriteSet> = {
  Byte: {
    happy: {
      src: `${basePath}/sprites/byte/happy.png`,
      frameCount: 6,
      fps: 6,
      loop: true,
    },
    // sad: { src: `${basePath}/sprites/byte/sad.png`, frameCount: 4, fps: 6, loop: true },
    // eating: { src: `${basePath}/sprites/byte/eating.png`, frameCount: 6, fps: 10, loop: false },
    // sleeping: { src: `${basePath}/sprites/byte/sleeping.png`, frameCount: 4, fps: 4, loop: true },
    // walking: { src: `${basePath}/sprites/byte/walking.png`, frameCount: 8, fps: 10, loop: true },
    // levelup: { src: `${basePath}/sprites/byte/levelup.png`, frameCount: 8, fps: 12, loop: false },
  },
  Sage: {
    sleeping: {
      src: `${basePath}/sprites/sage/sleeping.png`,
      frameCount: 6,
      fps: 4,
      loop: true,
    },
  },
  Glitch: {
    walking: {
      src: `${basePath}/sprites/glitch/walking.png`,
      frameCount: 6,
      fps: 6,
      loop: true,
    },
  },
  Crash: {
    happy: {
      src: `${basePath}/sprites/crash/happy.png`,
      frameCount: 6,
      fps: 6,
      loop: true,
    },
  },
  Null: {
    idle: {
      src: `${basePath}/sprites/null/idle.png`,
      frameCount: 6,
      fps: 6,
      loop: true,
    },
  },
  Nova: {
    idle: {
      src: `${basePath}/sprites/nova/idle.png`,
      frameCount: 6,
      fps: 6,
      loop: true,
    },
  },
}
