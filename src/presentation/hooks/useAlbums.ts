import { useState, useEffect, useCallback } from 'react'
import type { AlbumWithStats } from '@domain/usecases/GetAlbums'
import { container } from '@/di/container'

interface UseAlbumsState {
  albums: AlbumWithStats[]
  isLoading: boolean
  error: string | null
}

/**
 * useAlbums — ViewModel for the Albums listing page.
 */
export function useAlbums() {
  const [state, setState] = useState<UseAlbumsState>({
    albums: [],
    isLoading: true,
    error: null,
  })

  const fetchAlbums = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const albums = await container.getAlbums.execute()
      setState({ albums, isLoading: false, error: null })
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi',
      }))
    }
  }, [])

  useEffect(() => {
    fetchAlbums()
  }, [fetchAlbums])

  return { ...state, refresh: fetchAlbums }
}
