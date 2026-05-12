import { useState, useCallback, useEffect } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'

/**
 * useLightbox — Controls the fullscreen mediaItem viewer state.
 */
export function useLightbox(mediaItems: MediaItem[]) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  const isOpen = currentIndex !== null
  const currentPhoto = currentIndex !== null ? mediaItems[currentIndex] : null

  const open = useCallback((mediaItem: MediaItem) => {
    const index = mediaItems.findIndex(p => p.id === mediaItem.id)
    if (index !== -1) setCurrentIndex(index)
  }, [mediaItems])

  const close = useCallback(() => {
    setCurrentIndex(null)
  }, [])

  const next = useCallback(() => {
    if (currentIndex === null) return
    setCurrentIndex(prev => 
      prev !== null && prev < mediaItems.length - 1 ? prev + 1 : prev
    )
  }, [currentIndex, mediaItems.length])

  const prev = useCallback(() => {
    if (currentIndex === null) return
    setCurrentIndex(prev => 
      prev !== null && prev > 0 ? prev - 1 : prev
    )
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          close()
          break
        case 'ArrowRight':
          next()
          break
        case 'ArrowLeft':
          prev()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, next, prev])

  return {
    isOpen,
    currentPhoto,
    currentIndex,
    totalPhotos: mediaItems.length,
    open,
    close,
    next,
    prev,
  }
}
