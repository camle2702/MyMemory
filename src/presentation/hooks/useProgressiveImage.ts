import { useState, useEffect, useRef } from 'react'

interface ProgressiveImageState {
  /** The current best-available image src to display */
  src: string
  /** Whether the final (target) image has loaded */
  isLoaded: boolean
  /** Whether we're still showing the blur placeholder */
  isBlurred: boolean
}

/**
 * useProgressiveImage — Blur-up progressive image loading.
 *
 * Loading sequence:
 * 1. Instantly shows a tiny blurred placeholder (~200 bytes)
 * 2. Loads the target image in the background
 * 3. Cross-fades from blur to sharp when ready
 *
 * Optimized: Only starts preloading when IntersectionObserver has triggered
 * (the card is in or near the viewport). On Android, eagerly creating
 * dozens of new Image() objects at mount caused jank & flickering.
 */
export function useProgressiveImage(
  placeholderSrc: string,
  targetSrc: string,
): ProgressiveImageState {
  const [state, setState] = useState<ProgressiveImageState>({
    src: placeholderSrc,
    isLoaded: false,
    isBlurred: true,
  })

  const imgRef = useRef<HTMLImageElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    // Reset on src change
    startedRef.current = false
    setState({
      src: placeholderSrc,
      isLoaded: false,
      isBlurred: true,
    })

    // Use requestIdleCallback (or setTimeout fallback) to defer image loading
    // This prevents all cards from competing for bandwidth at mount
    const scheduleLoad = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 100))
    
    const idleId = scheduleLoad(() => {
      if (startedRef.current) return
      startedRef.current = true
      
      const img = new Image()
      imgRef.current = img

      img.onload = () => {
        setState({
          src: targetSrc,
          isLoaded: true,
          isBlurred: false,
        })
      }

      img.src = targetSrc
    })

    return () => {
      // Cleanup: cancel pending load
      const cancelIdle = (window as any).cancelIdleCallback || clearTimeout
      cancelIdle(idleId)
      if (imgRef.current) {
        imgRef.current.onload = null
        imgRef.current.src = ''
        imgRef.current = null
      }
    }
  }, [placeholderSrc, targetSrc])

  return state
}

/**
 * Preloads an image URL into the browser cache.
 * Used to prefetch next/prev images in lightbox for instant navigation.
 */
export function preloadImage(src: string): void {
  const img = new Image()
  img.src = src
}

/**
 * Preloads multiple images, with optional concurrency limit.
 */
export function preloadImages(srcs: string[], limit = 2): void {
  srcs.slice(0, limit).forEach(preloadImage)
}
