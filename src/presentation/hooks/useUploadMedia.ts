import { useState, useCallback, useRef } from 'react'
import { container } from '@/di/container'

interface UseUploadMediaState {
  isUploading: boolean
  progress: number
  error: string | null
  success: boolean
}

/**
 * useUploadMedia — ViewModel for the upload flow.
 */
export function useUploadMedia(onSuccess?: () => void) {
  const [state, setState] = useState<UseUploadMediaState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const upload = useCallback(async (
    file: File,
    caption: string,
    dateTaken: Date,
    albumId?: string,
  ) => {
    setState({ isUploading: true, progress: 0, error: null, success: false })

    // Simulate progress for large files (like video)
    intervalRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 95) // Max 95% until finished
      }))
    }, 100)

    try {
      await container.uploadNewMedia.execute(file, caption, dateTaken, albumId)
      if (intervalRef.current) clearInterval(intervalRef.current)
      setState({ isUploading: false, progress: 100, error: null, success: true })
      onSuccess?.()
    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setState({
        isUploading: false,
        progress: 0,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải file',
        success: false,
      })
    }
  }, [onSuccess])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setState({ isUploading: false, progress: 0, error: null, success: false })
  }, [])

  return { ...state, upload, reset }
}
