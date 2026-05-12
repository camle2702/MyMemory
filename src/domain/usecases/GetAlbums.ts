import type { Album } from '../entities/Album'
import type { AlbumRepository } from '../repositories/AlbumRepository'

/**
 * GetAlbums Use Case — Fetches all albums.
 */
export class GetAlbums {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async execute(): Promise<Album[]> {
    const albums = await this.albumRepository.getAll()
    // Sort newest first
    return [...albums].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
  }
}
