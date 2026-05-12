import type { MediaItem } from '../entities/MediaItem'
import type { Album } from '../entities/Album'
import type { MediaItemRepository } from '../repositories/MediaItemRepository'
import type { AlbumRepository } from '../repositories/AlbumRepository'

export interface AlbumWithPhotos {
  album: Album
  mediaItems: MediaItem[]
}

/**
 * GetAlbumWithMedia Use Case — Fetches a single album with all its mediaItems.
 */
export class GetAlbumWithMedia {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly mediaItemRepository: MediaItemRepository,
  ) {}

  async execute(albumId: string): Promise<AlbumWithPhotos | null> {
    const album = await this.albumRepository.getById(albumId)
    if (!album) return null

    const mediaItems = await this.mediaItemRepository.getByAlbumId(albumId)
    // Sort by date taken, newest first
    mediaItems.sort((a, b) => b.dateTaken.getTime() - a.dateTaken.getTime())

    return { album, mediaItems }
  }
}
