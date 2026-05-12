import type { MediaItem } from '@domain/entities/MediaItem'

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
  date_taken: string  // ISO string from DB
  created_at: string  // ISO string from DB
}

/**
 * Derives a tiny blurred placeholder URL from an Unsplash URL.
 * Falls back to thumbnail if URL is not Unsplash format.
 */
function derivePlaceholderUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr)
    if (url.hostname.includes('unsplash.com')) {
      url.searchParams.set('w', '20')
      url.searchParams.set('q', '10')
      return url.toString()
    }
  } catch {
    // Not a valid URL — return as-is
  }
  return urlStr
}

export function mapMediaItemFromDTO(dto: MediaItemDTO): MediaItem {
  return {
    id: dto.id,
    albumId: dto.album_id,
    mediaType: dto.media_type || 'image', // fallback for old data if any
    url: dto.url || (dto as any).image_url,
    thumbnailUrl: dto.thumbnail_url,
    placeholderUrl: derivePlaceholderUrl(dto.thumbnail_url || (dto as any).image_url || ''),
    caption: dto.caption,
    dateTaken: new Date(dto.date_taken),
    createdAt: new Date(dto.created_at),
  }
}
