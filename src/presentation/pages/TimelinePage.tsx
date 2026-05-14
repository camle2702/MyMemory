import { type FC, useState } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import { Hero } from '../components/Hero'
import { MasonryGrid } from '../components/MasonryGrid'
import { Lightbox } from '../components/Lightbox'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { AssignAlbumModal } from '../components/AssignAlbumModal'
import { useTimeline } from '../hooks/useTimeline'
import { useLightbox } from '../hooks/useLightbox'

/**
 * TimelinePage — Main view composing all timeline components.
 * Header and Footer are now rendered by App.tsx (shared layout).
 */
export const TimelinePage: FC = () => {
  const { groups, allPhotos, isLoading, error, refresh } = useTimeline()
  const lightbox = useLightbox(allPhotos)
  const [assigningMedia, setAssigningMedia] = useState<MediaItem | null>(null)

  return (
    <>
      <Hero />

      <section id="timeline" className="timeline-container">
        <div className="timeline-container__inner">
          {isLoading && <LoadingSkeleton />}

          {error && (
            <div className="error-state">
              <p className="error-state__message">😔 {error}</p>
            </div>
          )}

          {!isLoading && !error && groups.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">📷</div>
              <p className="empty-state__title">Chưa có kỷ niệm nào</p>
              <p className="empty-state__description">
                Hãy bắt đầu tải lên những khoảnh khắc đầu tiên của con!
              </p>
            </div>
          )}

          {!isLoading && !error && groups.length > 0 && (
            <MasonryGrid
              groups={groups}
              onPhotoClick={lightbox.open}
              onAddToAlbum={setAssigningMedia}
            />
          )}
        </div>
      </section>

      <Lightbox
        isOpen={lightbox.isOpen}
        mediaItem={lightbox.currentPhoto}
        currentIndex={lightbox.currentIndex}
        totalPhotos={lightbox.totalPhotos}
        allPhotos={allPhotos}
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
    </>
  )
}
