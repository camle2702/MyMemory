import { type FC } from 'react'
import type { MediaItem, TimelineGroup } from '@domain/entities/MediaItem'
import { MediaCard } from './MediaCard'

interface MasonryGridProps {
  groups: TimelineGroup[]
  onPhotoClick: (mediaItem: MediaItem) => void
  onAddToAlbum?: (mediaItem: MediaItem) => void
}

/**
 * MasonryGrid — Pinterest-style mediaItem grid grouped by month.
 * Uses CSS columns for true masonry layout.
 */
export const MasonryGrid: FC<MasonryGridProps> = ({ groups, onPhotoClick, onAddToAlbum }) => {
  let globalIndex = 0

  return (
    <div className="masonry-timeline">
      {groups.map(group => (
        <section key={group.label} className="timeline-section">
          {/* Month/Year label */}
          <div className="timeline-section__header">
            <div className="timeline-section__line" />
            <h2 className="timeline-section__label">{group.label}</h2>
            <div className="timeline-section__line" />
          </div>

          {/* Masonry grid for this month */}
          <div className="masonry-grid">
            {group.mediaItems.map(mediaItem => {
              const idx = globalIndex++
              return (
                <MediaCard
                  key={mediaItem.id}
                  mediaItem={mediaItem}
                  onClick={onPhotoClick}
                  onAddToAlbum={onAddToAlbum}
                  index={idx}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
