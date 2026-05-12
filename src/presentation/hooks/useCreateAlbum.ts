import { useState, useCallback } from 'react'
import { container } from '@/di/container'

interface UseCreateAlbumState {
  isCreating: boolean
  error: string | null
  success: boolean
}

/**
 * useCreateAlbum — ViewModel for creating a new album.
 */
export function useCreateAlbum(onSuccess?: () => void) {
  const [state, setState] = useState<UseCreateAlbumState>({
    isCreating: false,
    error: null,
    success: false,
  })

  const create = useCallback(async (title: string, description: string) => {
    setState({ isCreating: true, error: null, success: false })

    try {
      await container.createAlbum.execute(title, description)
      setState({ isCreating: false, error: null, success: true })
      onSuccess?.()
    } catch (err) {
      setState({
        isCreating: false,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo album',
        success: false,
      })
    }
  }, [onSuccess])

  const reset = useCallback(() => {
    setState({ isCreating: false, error: null, success: false })
  }, [])

  return { ...state, create, reset }
}
