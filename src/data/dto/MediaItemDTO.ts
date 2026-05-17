import type { MediaItem } from '@domain/entities/MediaItem'
import {
  buildImagePlaceholderUrl,
  buildTimelineThumbnailUrl,
} from '@/shared/mediaUrls'

/**
 * Data Transfer Object for mediaItems from Supabase.
 * Maps snake_case DB columns to our domain entity.
 */
export interface MediaItemDTO {
  id: string
  album_id: string | null
  media_type: 'image' | 'video'
  url: string
  thumbnail_url: string
  caption: string
  date_taken: string
  created_at: string
}

export function mapMediaItemFromDTO(dto: MediaItemDTO): MediaItem {
  const originalUrl = dto.url || (dto as any).image_url || ''
  const thumbnailSource = dto.thumbnail_url || originalUrl
  const isImage = (dto.media_type || 'image') === 'image'

  return {
    id: dto.id,
    albumId: dto.album_id,
    mediaType: dto.media_type || 'image',
    url: originalUrl,
    thumbnailUrl: isImage ? buildTimelineThumbnailUrl(thumbnailSource) : thumbnailSource,
    placeholderUrl: isImage ? buildImagePlaceholderUrl(thumbnailSource) : '',
    caption: dto.caption,
    dateTaken: new Date(dto.date_taken),
    createdAt: new Date(dto.created_at),
  }
}
