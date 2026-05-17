import { useState, useEffect, useCallback } from 'react'
import type { TimelineGroup, MediaItem } from '@domain/entities/MediaItem'
import type { TimelineGroupBy } from '@domain/usecases/GetTimelineMedia'
import { container } from '@/di/container'

const TIMELINE_PAGE_SIZE = 60

interface UseTimelineState {
  groups: TimelineGroup[]
  allPhotos: MediaItem[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  total: number
  hasMore: boolean
  nextOffset: number
}

/**
 * useTimeline - ViewModel/Presenter hook for the Timeline feature.
 *
 * Loads media in pages so the timeline does not fetch the entire library at once.
 */
export function useTimeline() {
  const [state, setState] = useState<UseTimelineState>({
    groups: [],
    allPhotos: [],
    isLoading: true,
    isLoadingMore: false,
    error: null,
    total: 0,
    hasMore: false,
    nextOffset: 0,
  })

  // Grouping mode state with localStorage persistence
  const [groupBy, setGroupBy] = useState<TimelineGroupBy>(() => {
    const saved = localStorage.getItem('myMemory_timelineGroupBy')
    return (saved as TimelineGroupBy) || 'month'
  })

  useEffect(() => {
    localStorage.setItem('myMemory_timelineGroupBy', groupBy)
  }, [groupBy])

  const fetchTimeline = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isLoadingMore: false,
      error: null,
      nextOffset: 0,
    }))

    try {
      const result = await container.getTimelinePhotos.executePage(groupBy, {
        limit: TIMELINE_PAGE_SIZE,
        offset: 0,
      })

      setState({
        groups: result.groups,
        allPhotos: result.mediaItems,
        isLoading: false,
        isLoadingMore: false,
        error: null,
        total: result.total,
        hasMore: result.hasMore,
        nextOffset: result.nextOffset,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isLoadingMore: false,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi',
      }))
    }
  }, [groupBy])

  const loadMore = useCallback(async () => {
    if (state.isLoading || state.isLoadingMore || !state.hasMore) return

    setState(prev => ({ ...prev, isLoadingMore: true, error: null }))

    try {
      const result = await container.getTimelinePhotos.executePage(groupBy, {
        limit: TIMELINE_PAGE_SIZE,
        offset: state.nextOffset,
      })
      const allPhotos = [...state.allPhotos, ...result.mediaItems]

      setState(prev => ({
        ...prev,
        groups: container.getTimelinePhotos.groupMediaItems(allPhotos, groupBy),
        allPhotos,
        isLoadingMore: false,
        total: result.total,
        hasMore: result.hasMore,
        nextOffset: result.nextOffset,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoadingMore: false,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi',
      }))
    }
  }, [
    groupBy,
    state.allPhotos,
    state.hasMore,
    state.isLoading,
    state.isLoadingMore,
    state.nextOffset,
  ])

  useEffect(() => {
    fetchTimeline()
  }, [fetchTimeline])

  return {
    ...state,
    groupBy,
    setGroupBy,
    refresh: fetchTimeline,
    loadMore,
  }
}
