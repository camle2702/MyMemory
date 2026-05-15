import { type FC, useState, useEffect } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import { Hero } from '../components/Hero'
import { MasonryGrid } from '../components/MasonryGrid'
import { SquareGrid } from '../components/SquareGrid'
import { ListTimeline } from '../components/ListTimeline'
import { ViewSwitcher, type ViewMode } from '../components/ViewSwitcher'
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

  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('myMemory_timelineViewMode')
    return (saved as ViewMode) || 'masonry'
  })

  useEffect(() => {
    localStorage.setItem('myMemory_timelineViewMode', viewMode)
  }, [viewMode])

  return (
    <>
      <Hero />

      <section id="timeline" className="timeline-container">
        <div className="timeline-container__inner">
          {/* View Switcher is only visible when we have data */}
          {!isLoading && !error && groups.length > 0 && (
            <ViewSwitcher currentMode={viewMode} onChange={setViewMode} />
          )}

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
            <>
              {viewMode === 'masonry' && (
                <MasonryGrid
                  groups={groups}
                  onPhotoClick={lightbox.open}
                  onAddToAlbum={setAssigningMedia}
                />
              )}
              {viewMode === 'grid' && (
                <SquareGrid
                  groups={groups}
                  onPhotoClick={lightbox.open}
                  onAddToAlbum={setAssigningMedia}
                />
              )}
              {viewMode === 'list' && (
                <ListTimeline
                  groups={groups}
                  onPhotoClick={lightbox.open}
                  onAddToAlbum={setAssigningMedia}
                />
              )}
            </>
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
