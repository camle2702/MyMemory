import { useEffect, useRef, type FC } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import { useProgressiveImage } from '../hooks/useProgressiveImage'
import { observeElement, unobserveElement } from '../utils/intersectionObserver'

interface MediaCardProps {
  mediaItem: MediaItem
  onClick: (mediaItem: MediaItem) => void
  index: number
}

/**
 * MediaCard — A single mediaItem in the masonry grid.
 * Uses blur-up progressive loading: tiny placeholder → thumbnail.
 * Full quality image is only loaded when opening the lightbox.
 */
export const MediaCard: FC<MediaCardProps> = ({ mediaItem, onClick, index }) => {
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

  return (
    <div
      ref={ref}
      className="mediaItem-card group"
      style={{
        transitionDelay: `${(index % 6) * 80}ms`,
      }}
      onClick={() => onClick(mediaItem)}
      role="button"
      tabIndex={0}
      aria-label={`Xem ảnh: ${mediaItem.caption}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(mediaItem)
        }
      }}
    >
      <img
        src={src}
        alt={mediaItem.caption}
        loading="lazy"
        decoding="async"
        className={`mediaItem-card__image mediaItem-card__image--loaded ${isBlurred ? 'mediaItem-card__image--blur' : ''}`}
      />

      {mediaItem.mediaType === 'video' && (
        <div className="mediaItem-card__video-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      )}

      {/* Hover overlay with caption */}
      {isLoaded && (
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
    </div>
  )
}
