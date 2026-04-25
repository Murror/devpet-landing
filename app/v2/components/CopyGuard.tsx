'use client'

import { useEffect } from 'react'

/**
 * Copy-protection guard for the /v2 marketing surface.
 *
 * Works alongside the CSS rules in fonts.css (.v2-root user-select:
 * none, img user-drag: none) to discourage drive-by scraping. This
 * component handles the JavaScript half of the lockdown:
 *
 *   • blocks the right-click context menu (Save Image As, Inspect
 *     via context menu, Copy Image Address, etc.)
 *   • blocks Ctrl/Cmd + C / X / U (copy / cut / view-source)
 *   • blocks the native dragstart on images & icons
 *   • blocks the copy / cut clipboard events as a belt-and-braces
 *     for stylesheet-bypassing extensions
 *
 * This is NOT a security boundary. DevTools, View Source via the
 * browser menu, screenshots, network inspection, and basic curl
 * still get through. The goal is friction for the casual scraper,
 * not actual content protection — anyone serious will find a way.
 *
 * Form inputs are spared from the keyboard / clipboard blocks so
 * waitlist signup keeps working: the handlers check whether the
 * event target is editable (input / textarea / contenteditable)
 * and let the keystroke pass through if so.
 */

const isEditable = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false
  if (el.isContentEditable) return true
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

export default function CopyGuard() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (isEditable(e.target)) return
      e.preventDefault()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return
      const k = e.key.toLowerCase()
      // Cmd/Ctrl + C / X / A / S / P / U  → block copy / cut / select-all
      // / save / print / view-source. Paste is never blocked.
      if ((e.metaKey || e.ctrlKey) && ['c', 'x', 'a', 's', 'p', 'u'].includes(k)) {
        e.preventDefault()
      }
    }

    const onDragStart = (e: DragEvent) => {
      // Always block image drags. Other drags are rare on this page
      // (no draggable cards / sortable lists) so we block all of them.
      const t = e.target as HTMLElement | null
      if (t?.tagName === 'IMG' || !isEditable(t)) {
        e.preventDefault()
      }
    }

    const onCopyOrCut = (e: ClipboardEvent) => {
      if (isEditable(e.target)) return
      e.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('copy', onCopyOrCut)
    document.addEventListener('cut', onCopyOrCut)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('copy', onCopyOrCut)
      document.removeEventListener('cut', onCopyOrCut)
    }
  }, [])

  return null
}
