import type { MediaItem, TimelineGroup } from '../entities/MediaItem'
import type { MediaItemRepository } from '../repositories/MediaItemRepository'

const MONTH_NAMES_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

/**
 * GetTimelineMedia Use Case
 *
 * Fetches all mediaItems and groups them chronologically by month/year
 * for the Timeline view. Pure business logic — no UI or DB concerns.
 */
export class GetTimelineMedia {
  constructor(private readonly mediaItemRepository: MediaItemRepository) {}

  async execute(): Promise<TimelineGroup[]> {
    const mediaItems = await this.mediaItemRepository.getAll()
    return this.groupByMonth(mediaItems)
  }

  private groupByMonth(mediaItems: MediaItem[]): TimelineGroup[] {
    const map = new Map<string, MediaItem[]>()

    for (const mediaItem of mediaItems) {
      const d = mediaItem.dateTaken
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const existing = map.get(key)
      if (existing) {
        existing.push(mediaItem)
      } else {
        map.set(key, [mediaItem])
      }
    }

    const groups: TimelineGroup[] = []

    for (const [key, groupPhotos] of map) {
      const [yearStr, monthStr] = key.split('-')
      const year = parseInt(yearStr, 10)
      const month = parseInt(monthStr, 10)

      // Sort mediaItems within group: newest first
      groupPhotos.sort((a, b) => b.dateTaken.getTime() - a.dateTaken.getTime())

      groups.push({
        label: `${MONTH_NAMES_VI[month]}, ${year}`,
        year,
        month,
        mediaItems: groupPhotos,
      })
    }

    // Sort groups: newest first
    groups.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })

    return groups
  }
}
