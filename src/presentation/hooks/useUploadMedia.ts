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
    files: File[],
    caption: string,
    dateTaken: Date,
    albumId?: string,
  ) => {
    if (files.length === 0) return;
    
    const totalBytesAll = files.reduce((acc, f) => acc + f.size, 0);
    
    setState({ 
      isUploading: true, 
      progress: 0, 
      loadedBytes: 0, 
      totalBytes: totalBytesAll, 
      error: null, 
      success: false 
    })

    try {
      let completedBytes = 0;
      
      for (const file of files) {
        await container.uploadNewMedia.execute(
          file, 
          caption, 
          dateTaken, 
          albumId,
          (loaded) => {
            // loaded is the progress of the CURRENT file
            const overallLoaded = completedBytes + loaded;
            setState(prev => ({
              ...prev,
              loadedBytes: overallLoaded,
              progress: Math.round((overallLoaded / totalBytesAll) * 100)
            }))
          }
        )
        completedBytes += file.size;
      }
      
      setState({ 
        isUploading: false, 
        progress: 100, 
        loadedBytes: totalBytesAll, 
        totalBytes: totalBytesAll, 
        error: null, 
        success: true 
      })
      onSuccess?.()
    } catch (err) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải file',
        success: false,
      }))
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
