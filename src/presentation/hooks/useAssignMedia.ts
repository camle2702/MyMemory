import { useState, useCallback } from 'react'
import { container } from '@/di/container'

export function useAssignMedia() {
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignToAlbum = useCallback(async (mediaId: string, albumId: string) => {
    setIsAssigning(true)
    setError(null)
    try {
      await container.assignMediaToAlbum.execute(mediaId, albumId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi thêm vào album')
      throw err
    } finally {
      setIsAssigning(false)
    }
  }, [])

  return { assignToAlbum, isAssigning, error }
}
