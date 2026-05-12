/**
 * MediaItem Entity — Core domain model
 * Zero dependencies on framework or infrastructure.
 */
export interface MediaItem {
  readonly id: string
  readonly albumId: string | null
  readonly mediaType: 'image' | 'video'
  readonly url: string              // Full quality image or video source
  readonly thumbnailUrl: string     // Small thumbnail or video poster
  readonly placeholderUrl: string   // Tiny blurred placeholder — instant load
  readonly caption: string
  readonly dateTaken: Date
  readonly createdAt: Date
}

/**
 * MediaItems grouped by a time period for timeline display.
 */
export interface TimelineGroup {
  readonly label: string        // e.g. "Tháng 5, 2026"
  readonly year: number
  readonly month: number
  readonly mediaItems: MediaItem[]
}
