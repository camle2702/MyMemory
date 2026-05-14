import { useState, useCallback } from 'react'
import { container } from '@/di/container'

interface UseUploadMediaState {
  isUploading: boolean
  progress: number
  loadedBytes: number
  totalBytes: number
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
    loadedBytes: 0,
    totalBytes: 0,
    error: null,
    success: false,
  })

  const upload = useCallback(async (
    file: File,
    caption: string,
    dateTaken: Date,
    albumId?: string,
  ) => {
    setState({ 
      isUploading: true, 
      progress: 0, 
      loadedBytes: 0, 
      totalBytes: file.size, 
      error: null, 
      success: false 
    })

    try {
      await container.uploadNewMedia.execute(
        file, 
        caption, 
        dateTaken, 
        albumId,
        (loaded, total) => {
          setState(prev => ({
            ...prev,
            loadedBytes: loaded,
            totalBytes: total,
            progress: Math.round((loaded / total) * 100)
          }))
        }
      )
      
      setState({ 
        isUploading: false, 
        progress: 100, 
        loadedBytes: file.size, 
        totalBytes: file.size, 
        error: null, 
        success: true 
      })
      onSuccess?.()
    } catch (err) {
      setState({
        isUploading: false,
        progress: 0,
        loadedBytes: 0,
        totalBytes: 0,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải file',
        success: false,
      })
    }
  }, [onSuccess])

  const reset = useCallback(() => {
    setState({ 
      isUploading: false, 
      progress: 0, 
      loadedBytes: 0, 
      totalBytes: 0, 
      error: null, 
      success: false 
    })
  }, [])

  return { ...state, upload, reset }
}
