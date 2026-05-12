import { useState, useEffect, useCallback } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import type { Album } from '@domain/entities/Album'
import { container } from '@/di/container'

interface UseAlbumDetailState {
  album: Album | null
  mediaItems: MediaItem[]
  isLoading: boolean
  error: string | null
}

/**
 * useAlbumDetail — ViewModel for the Album Detail page.
 */
export function useAlbumDetail(albumId: string) {
  const [state, setState] = useState<UseAlbumDetailState>({
    album: null,
    mediaItems: [],
    isLoading: true,
    error: null,
  })

  const fetchAlbumDetail = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const result = await container.getAlbumWithPhotos.execute(albumId)
      if (!result) {
        setState({
          album: null,
          mediaItems: [],
          isLoading: false,
          error: 'Album không tồn tại',
        })
        return
      }
      setState({
        album: result.album,
        mediaItems: result.mediaItems,
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
  }, [albumId])

  useEffect(() => {
    fetchAlbumDetail()
  }, [fetchAlbumDetail])

  return { ...state, refresh: fetchAlbumDetail }
}
