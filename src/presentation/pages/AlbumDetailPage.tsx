import { type FC, useState } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import { useAlbumDetail } from '../hooks/useAlbumDetail'
import { useLightbox } from '../hooks/useLightbox'
import { MediaCard } from '../components/MediaCard'
import { Lightbox } from '../components/Lightbox'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { AssignAlbumModal } from '../components/AssignAlbumModal'

interface AlbumDetailPageProps {
  albumId: string
  onBack: () => void
}

/**
 * AlbumDetailPage - Shows a single album's mediaItems in a paged masonry grid.
 */
export const AlbumDetailPage: FC<AlbumDetailPageProps> = ({ albumId, onBack }) => {
  const {
    album,
    mediaItems,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    loadMore,
    hasMore,
    total,
  } = useAlbumDetail(albumId)
  const lightbox = useLightbox(mediaItems)
  const [assigningMedia, setAssigningMedia] = useState<MediaItem | null>(null)

  return (
    <section className="album-detail">
      <button className="album-detail__back" onClick={onBack} aria-label="Quay lại Albums">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Albums</span>
      </button>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <div className="error-state">
          <p className="error-state__message">😔 {error}</p>
        </div>
      )}

      {!isLoading && !error && album && (
        <>
          <div className="album-detail__header">
            <h1 className="album-detail__title">{album.title}</h1>
            <p className="album-detail__description">{album.description}</p>
            <div className="album-detail__meta">
              <span className="album-detail__count">{total} ảnh</span>
              <span className="album-detail__dot">·</span>
              <time className="album-detail__date">
                {album.createdAt.toLocaleDateString('vi-VN', {
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>

          {mediaItems.length > 0 ? (
            <>
              <div className="album-detail__grid masonry-grid">
                {mediaItems.map((mediaItem, index) => (
                  <MediaCard
                    key={mediaItem.id}
                    mediaItem={mediaItem}
                    onClick={lightbox.open}
                    onAddToAlbum={setAssigningMedia}
                    index={index}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="load-more">
                  <button
                    type="button"
                    className="load-more__button"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? 'Đang tải thêm...' : `Tải thêm (${mediaItems.length}/${total})`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">📷</div>
              <p className="empty-state__title">Album trống</p>
              <p className="empty-state__description">
                Chưa có ảnh nào trong album này.
              </p>
            </div>
          )}
        </>
      )}

      <Lightbox
        isOpen={lightbox.isOpen}
        mediaItem={lightbox.currentPhoto}
        currentIndex={lightbox.currentIndex}
        totalPhotos={lightbox.totalPhotos}
        allPhotos={mediaItems}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
        onAddToAlbum={setAssigningMedia}
      />

      <AssignAlbumModal
        isOpen={assigningMedia !== null}
        onClose={() => setAssigningMedia(null)}
        mediaItem={assigningMedia}
        onSuccess={() => {
          refresh()
        }}
      />
    </section>
  )
}
