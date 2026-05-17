import { useState, useEffect, useCallback } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import type { Album } from '@domain/entities/Album'
import { container } from '@/di/container'

const ALBUM_MEDIA_PAGE_SIZE = 60

interface UseAlbumDetailState {
  album: Album | null
  mediaItems: MediaItem[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  total: number
  hasMore: boolean
  nextOffset: number
}

/**
 * useAlbumDetail - ViewModel for the Album Detail page.
 *
 * Loads album media in pages to avoid downloading large albums in one request.
 */
export function useAlbumDetail(albumId: string) {
  const [state, setState] = useState<UseAlbumDetailState>({
    album: null,
    mediaItems: [],
    isLoading: true,
    isLoadingMore: false,
    error: null,
    total: 0,
    hasMore: false,
    nextOffset: 0,
  })

  const fetchAlbumDetail = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isLoadingMore: false,
      error: null,
      nextOffset: 0,
    }))
    try {
      const result = await container.getAlbumWithPhotos.executePage(albumId, {
        limit: ALBUM_MEDIA_PAGE_SIZE,
        offset: 0,
      })
      if (!result) {
        setState({
          album: null,
          mediaItems: [],
          isLoading: false,
          isLoadingMore: false,
          error: 'Album không tồn tại',
          total: 0,
          hasMore: false,
          nextOffset: 0,
        })
        return
      }
      setState({
        album: result.album,
        mediaItems: result.mediaItems,
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
  }, [albumId])

  const loadMore = useCallback(async () => {
    if (state.isLoading || state.isLoadingMore || !state.hasMore) return

    setState(prev => ({ ...prev, isLoadingMore: true, error: null }))

    try {
      const result = await container.getAlbumWithPhotos.executePage(albumId, {
        limit: ALBUM_MEDIA_PAGE_SIZE,
        offset: state.nextOffset,
      })
      if (!result) return

      setState(prev => ({
        ...prev,
        album: result.album,
        mediaItems: [...prev.mediaItems, ...result.mediaItems],
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
    albumId,
    state.hasMore,
    state.isLoading,
    state.isLoadingMore,
    state.nextOffset,
  ])

  useEffect(() => {
    fetchAlbumDetail()
  }, [fetchAlbumDetail])

  return { ...state, refresh: fetchAlbumDetail, loadMore }
}
