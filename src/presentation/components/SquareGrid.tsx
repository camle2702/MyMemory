import { type FC } from 'react'
import type { MediaItem, TimelineGroup } from '@domain/entities/MediaItem'
import { MediaCard } from './MediaCard'

interface SquareGridProps {
  groups: TimelineGroup[]
  onPhotoClick: (mediaItem: MediaItem) => void
  onAddToAlbum?: (mediaItem: MediaItem) => void
}

/**
 * SquareGrid — Instagram-style uniform square grid.
 * Uses CSS grid for a clean, tightly packed layout.
 */
export const SquareGrid: FC<SquareGridProps> = ({ groups, onPhotoClick, onAddToAlbum }) => {
  let globalIndex = 0

  return (
    <div className="square-timeline">
      {groups.map(group => (
        <section key={`${group.year}-${group.month}`} className="timeline-section">
          {/* Month/Year label */}
          <div className="timeline-section__header">
            <div className="timeline-section__line" />
            <h2 className="timeline-section__label">{group.label}</h2>
            <div className="timeline-section__line" />
          </div>

          {/* Square grid for this month */}
          <div className="square-grid">
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
