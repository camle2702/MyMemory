import { useEffect, useRef } from 'react'
import { container } from '@/di/container'

/**
 * usePageTracking — Tracks page views automatically when route changes.
 * Placed once in App.tsx to track all navigation.
 */
export function usePageTracking(page: string) {
  useEffect(() => {
    // Only track specific entry pages (e.g. timeline)
    // The user doesn't want to track albums or analytics pages
    const trackedPages = ['timeline']
    if (!trackedPages.includes(page)) return

    // Session-based tracking: only track once per session
    const sessionKey = 'app_session_tracked'
    const isAlreadyTrackedInSession = sessionStorage.getItem(sessionKey)

    if (!isAlreadyTrackedInSession) {
      container.trackPageView.execute(page).catch(() => {
        // Silently fail
      })
      // Mark as tracked for this session
      sessionStorage.setItem(sessionKey, 'true')
    }
  }, [page])
}
