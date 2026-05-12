import type { Album } from '../entities/Album'
import type { AlbumRepository } from '../repositories/AlbumRepository'

/**
 * CreateAlbum Use Case
 */
export class CreateAlbum {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async execute(title: string, description: string): Promise<Album> {
    if (!title.trim()) {
      throw new Error('Tên album không được để trống')
    }

    return this.albumRepository.create(title.trim(), description.trim())
  }
}
