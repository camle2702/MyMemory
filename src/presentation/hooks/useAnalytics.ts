import { useState, useEffect, useCallback } from 'react'
import type { AnalyticsSummary } from '@domain/entities/PageView'
import { container } from '@/di/container'

interface UseAnalyticsState {
  summary: AnalyticsSummary | null
  isLoading: boolean
  error: string | null
}

/**
 * useAnalytics — ViewModel hook for the Analytics page.
 */
export function useAnalytics() {
  const [state, setState] = useState<UseAnalyticsState>({
    summary: null,
    isLoading: true,
    error: null,
  })

  const fetchAnalytics = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const summary = await container.getAnalytics.execute()
      setState({ summary, isLoading: false, error: null })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi',
      }))
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { ...state, refresh: fetchAnalytics }
}
