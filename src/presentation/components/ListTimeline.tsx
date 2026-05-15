import { type FC, memo } from 'react'
import type { MediaItem, TimelineGroup } from '@domain/entities/MediaItem'
import { MediaCard } from './MediaCard'

interface ListTimelineProps {
  groups: TimelineGroup[]
  onPhotoClick: (mediaItem: MediaItem) => void
  onAddToAlbum?: (mediaItem: MediaItem) => void
}

/**
 * ListTimeline — Feed-style 1-column layout.
 * Shows full images and prominent captions, great for reading details.
 */
export const ListTimeline: FC<ListTimelineProps> = memo(({ groups, onPhotoClick, onAddToAlbum }) => {
  let globalIndex = 0

  return (
    <div className="list-timeline-wrapper">
      {groups.map(group => (
        <section key={group.label} className="timeline-section">
          {/* Month/Year label */}
          <div className="timeline-section__header">
            <div className="timeline-section__line" />
            <h2 className="timeline-section__label">{group.label}</h2>
            <div className="timeline-section__line" />
          </div>

          {/* List layout for this month */}
          <div className="list-timeline">
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
})
