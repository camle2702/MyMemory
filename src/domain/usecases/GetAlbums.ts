import type { Album } from '../entities/Album'
import type { AlbumRepository } from '../repositories/AlbumRepository'
import type { MediaItemRepository } from '../repositories/MediaItemRepository'

export interface AlbumWithStats extends Album {
  mediaCount: number
}

/**
 * GetAlbums Use Case — Fetches all albums and their stats.
 */
export class GetAlbums {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly mediaItemRepository: MediaItemRepository
  ) {}

  async execute(): Promise<AlbumWithStats[]> {
    const [albums, albumStats] = await Promise.all([
      this.albumRepository.getAll(),
      this.mediaItemRepository.getAlbumStats()
    ])
    const statsByAlbumId = new Map(albumStats.map(stats => [stats.albumId, stats]))

    // Sort newest first
    const sortedAlbums = [...albums].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    return sortedAlbums.map(album => {
      const stats = statsByAlbumId.get(album.id)
      const count = stats?.mediaCount ?? 0
      // If album doesn't have an explicit cover, use the first media item's thumbnail
      const cover = album.coverImageUrl || stats?.coverImageUrl || null

      return {
        ...album,
        mediaCount: count,
        coverImageUrl: cover
      }
    })
  }
}
