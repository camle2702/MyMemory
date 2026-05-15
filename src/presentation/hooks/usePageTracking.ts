import { useEffect, useRef } from 'react'
import { container } from '@/di/container'

/**
 * usePageTracking — Tracks page views automatically when route changes.
 * Placed once in App.tsx to track all navigation.
 */
export function usePageTracking(page: string) {
  const trackedRef = useRef<string | null>(null)

  useEffect(() => {
    // Only track once per page navigation (avoid duplicate tracks on re-render)
    if (trackedRef.current !== page) {
      trackedRef.current = page
      container.trackPageView.execute(page).catch(() => {
        // Silently fail — analytics should never break the app
      })
    }
  }, [page])
}
