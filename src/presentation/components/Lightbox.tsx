import { type FC, useState, useRef, useEffect } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'

interface LightboxProps {
  isOpen: boolean
  mediaItem: MediaItem | null
  currentIndex: number | null
  totalPhotos: number
  allPhotos: MediaItem[]
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onAddToAlbum?: (mediaItem: MediaItem) => void
}

/**
 * Lightbox — Fullscreen mediaItem viewer.
 *
 * Loading strategy:
 * 1. Instantly shows the thumbnail (already cached from grid)
 * 2. Loads full-quality image in background
 * 3. Cross-fades from thumbnail to full when ready
 * 4. Does not preload adjacent full images, keeping bandwidth focused on the item opened.
 */
export const Lightbox: FC<LightboxProps> = ({
  isOpen,
  mediaItem,
  currentIndex,
  totalPhotos,
  allPhotos: _allPhotos,
  onClose,
  onNext,
  onPrev,
  onAddToAlbum,
}) => {
  const [isFullLoaded, setIsFullLoaded] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Reset state and preload adjacent images when mediaItem changes
  useEffect(() => {
    if (!mediaItem || currentIndex === null) return

    if (mediaItem.mediaType === 'image') {
      setIsFullLoaded(false)

      // Load full quality image
      const fullImg = new Image()
      fullImg.onload = () => setIsFullLoaded(true)
      fullImg.src = mediaItem.url

      return () => {
        fullImg.onload = null
        fullImg.src = ''
      }
    } else {
      // It's a video, no need for image preload logic here.
      // Video preload is handled by the <video> tag's `preload` attribute natively.
      setIsFullLoaded(true) 
    }
  }, [mediaItem?.id, currentIndex])

  if (!isOpen || !mediaItem) return null

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 60) {
      if (diff > 0) onPrev()
      else onNext()
    }
    setTouchStart(null)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  // Show thumbnail immediately (already in browser cache), then swap to full (for images)
  const displaySrc = isFullLoaded ? mediaItem.url : mediaItem.thumbnailUrl
  const isVideo = mediaItem.mediaType === 'video'

  return (
    <div
      className="lightbox"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Xem kỷ niệm toàn màn hình"
    >
      {/* Action buttons top right */}
      <div className="lightbox__actions">
        {onAddToAlbum && (
          <button
            className="lightbox__btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToAlbum(mediaItem);
            }}
            aria-label="Thêm vào Bộ sưu tập"
            title="Thêm vào Bộ sưu tập"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              <line x1="12" y1="10" x2="12" y2="16" />
              <line x1="9" y1="13" x2="15" y2="13" />
            </svg>
          </button>
        )}

        {/* Close button */}
        <button
          className="lightbox__btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Đóng"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Navigation: Previous */}
      {currentIndex !== null && currentIndex > 0 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={onPrev}
          aria-label="Kỷ niệm trước"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Navigation: Next */}
      {currentIndex !== null && currentIndex < totalPhotos - 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={onNext}
          aria-label="Kỷ niệm tiếp theo"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Main content area */}
      <div
        className="lightbox__content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading indicator — subtle, only while upgrading to full quality image */}
        {!isFullLoaded && !isVideo && (
          <div className="lightbox__quality-badge">
            <div className="lightbox__quality-dot" />
            Đang tải chất lượng cao...
          </div>
        )}

        {isVideo ? (
          <video
            key={mediaItem.id} // Forces React to recreate video element on change, ensuring it plays new source and frees old memory
            src={mediaItem.url}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="lightbox__video"
          />
        ) : (
          <img
            key={mediaItem.id}
            src={displaySrc}
            alt={mediaItem.caption}
            className={`lightbox__image lightbox__image--loaded ${!isFullLoaded ? 'lightbox__image--upgrading' : ''}`}
            draggable={false}
          />
        )}

        {/* Caption panel */}
        <div className="lightbox__info lightbox__info--visible">
          <p className="lightbox__caption">{mediaItem.caption}</p>
          <div className="lightbox__meta">
            <time className="lightbox__date">
              {mediaItem.dateTaken.toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            {currentIndex !== null && (
              <span className="lightbox__counter">
                {currentIndex + 1} / {totalPhotos}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
