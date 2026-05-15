import { useEffect, useRef, type FC, memo } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import { useProgressiveImage } from '../hooks/useProgressiveImage'
import { observeElement, unobserveElement } from '../utils/intersectionObserver'

interface MediaCardProps {
  mediaItem: MediaItem
  onClick: (mediaItem: MediaItem) => void
  onAddToAlbum?: (mediaItem: MediaItem) => void
  index: number
}

/**
 * MediaCard — A single mediaItem in the masonry grid.
 * Uses blur-up progressive loading: tiny placeholder → thumbnail.
 * Full quality image is only loaded when opening the lightbox.
 * 
 * Wrapped in React.memo to prevent unnecessary re-renders during scrolling.
 */
export const MediaCard: FC<MediaCardProps> = memo(({ mediaItem, onClick, onAddToAlbum, index }) => {
  const ref = useRef<HTMLDivElement>(null)

  // Progressive loading: placeholder (w=20 blur) → thumbnail (w=300)
  const { src, isLoaded, isBlurred } = useProgressiveImage(
    mediaItem.placeholderUrl,
    mediaItem.thumbnailUrl,
  )

  useEffect(() => {
    const el = ref.current
    if (el) {
      observeElement(el)
    }
    return () => {
      if (el) {
        unobserveElement(el)
      }
    }
  }, [])

  // Cap stagger delay at 6 items per batch, max ~400ms
  const staggerDelay = (index % 6) * 60

  return (
    <div
      ref={ref}
      className="mediaItem-card group"
      style={{ transitionDelay: `${staggerDelay}ms` }}
      onClick={() => onClick(mediaItem)}
      role="button"
      tabIndex={0}
      aria-label={`Xem ảnh: ${mediaItem.caption || 'Ảnh'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(mediaItem)
        }
      }}
    >
      {mediaItem.mediaType === 'video' ? (
        <video
          src={`${mediaItem.thumbnailUrl}#t=0.001`}
          className="mediaItem-card__image mediaItem-card__image--loaded"
          style={{ 
            minHeight: '240px', 
            backgroundColor: 'var(--color-sand-100)',
            objectFit: 'cover'
          }}
          preload="metadata"
          muted
          playsInline
          onLoadedData={(e) => {
            e.currentTarget.dataset.loaded = "true";
          }}
        />
      ) : (
        <img
          src={src}
          alt={mediaItem.caption || 'Ảnh kỷ niệm'}
          loading="lazy"
          decoding="async"
          className={`mediaItem-card__image mediaItem-card__image--loaded ${isBlurred ? 'mediaItem-card__image--blur' : ''}`}
        />
      )}

      {mediaItem.mediaType === 'video' && (
        <div className="mediaItem-card__video-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      )}

      {/* Hover overlay with caption — hidden on touch devices via CSS */}
      {(isLoaded || mediaItem.mediaType === 'video') && (
        <div className="mediaItem-card__overlay">
          <p className="mediaItem-card__caption">{mediaItem.caption}</p>
          <time className="mediaItem-card__date">
            {mediaItem.dateTaken.toLocaleDateString('vi-VN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      )}

      {/* Add to album button */}
      {(isLoaded || mediaItem.mediaType === 'video') && onAddToAlbum && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onAddToAlbum(mediaItem)
          }}
          className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-[var(--color-primary)] backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 z-10 shadow-lg border border-white/10"
          aria-label="Thêm vào Bộ sưu tập"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            <line x1="12" y1="10" x2="12" y2="16" />
            <line x1="9" y1="13" x2="15" y2="13" />
          </svg>
        </button>
      )}
    </div>
  )
})

