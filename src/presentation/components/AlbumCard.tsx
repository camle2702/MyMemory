import { useEffect, useRef, type FC } from 'react'
import type { Album } from '@domain/entities/Album'
import { useProgressiveImage } from '../hooks/useProgressiveImage'
import { observeElement, unobserveElement } from '../utils/intersectionObserver'

interface AlbumCardProps {
  album: Album
  photoCount: number
  onClick: (album: Album) => void
  index: number
}

/**
 * Derives a tiny blurred placeholder from an Unsplash URL.
 */
function derivePlaceholder(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('w', '20')
    parsed.searchParams.set('q', '10')
    return parsed.toString()
  } catch {
    return url
  }
}

/**
 * AlbumCard — Uses blur-up progressive loading for cover images.
 */
export const AlbumCard: FC<AlbumCardProps> = ({ album, photoCount, onClick, index }) => {
  const ref = useRef<HTMLDivElement>(null)

  const placeholder = album.coverImageUrl ? derivePlaceholder(album.coverImageUrl) : ''
  const { src, isBlurred } = useProgressiveImage(
    placeholder,
    album.coverImageUrl || '',
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
    <article
      ref={ref}
      className="album-card"
      style={{
        transitionDelay: `${index * 120}ms`,
      }}
      onClick={() => onClick(album)}
      role="button"
      tabIndex={0}
      aria-label={`Mở album: ${album.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(album)
        }
      }}
    >
      {/* Cover image */}
      <div className="album-card__cover">
        {album.coverImageUrl ? (
          <img
            src={src}
            alt={album.title}
            loading="lazy"
            decoding="async"
            className={`album-card__image album-card__image--loaded ${isBlurred ? 'album-card__image--blur' : ''}`}
          />
        ) : (
          <div className="album-card__placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* MediaItem count badge */}
        <div className="album-card__badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>{photoCount}</span>
        </div>
      </div>

      {/* Text info */}
      <div className="album-card__body">
        <h3 className="album-card__title">{album.title}</h3>
        <p className="album-card__description">{album.description}</p>
        <time className="album-card__date">
          {album.createdAt.toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric',
          })}
        </time>
      </div>
    </article>
  )
}
