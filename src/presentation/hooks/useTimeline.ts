import { useState, useEffect, useCallback } from 'react'
import type { TimelineGroup, MediaItem } from '@domain/entities/MediaItem'
import { container } from '@/di/container'

interface UseTimelineState {
  groups: TimelineGroup[]
  allPhotos: MediaItem[]
  isLoading: boolean
  error: string | null
}

/**
 * useTimeline — ViewModel/Presenter hook for the Timeline feature.
 *
 * Bridges the domain use case to the React presentation layer.
 * Components consume this hook and remain free of business logic.
 */
export function useTimeline() {
  const [state, setState] = useState<UseTimelineState>({
    groups: [],
    allPhotos: [],
    isLoading: true,
    error: null,
  })

  const fetchTimeline = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const groups = await container.getTimelinePhotos.execute()
      const allPhotos = groups.flatMap(g => g.mediaItems)

      setState({
        groups,
        allPhotos,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi',
      }))
    }
  }, [])

  useEffect(() => {
    fetchTimeline()
  }, [fetchTimeline])

  return {
    ...state,
    refresh: fetchTimeline,
  }
}
