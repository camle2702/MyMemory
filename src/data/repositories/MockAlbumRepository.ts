import type { Album } from '@domain/entities/Album'
import type { AlbumRepository } from '@domain/repositories/AlbumRepository'
import { MOCK_ALBUMS } from '../mock/mockAlbums'
import { mapAlbumFromDTO } from '../dto/AlbumDTO'

/**
 * MockAlbumRepository — In-memory implementation.
 */
export class MockAlbumRepository implements AlbumRepository {
  private albums = [...MOCK_ALBUMS]

  async getAll(): Promise<Album[]> {
    await this.delay(250)
    return this.albums.map(mapAlbumFromDTO)
  }

  async getById(id: string): Promise<Album | null> {
    await this.delay(100)
    const dto = this.albums.find(a => a.id === id)
    return dto ? mapAlbumFromDTO(dto) : null
  }

  async create(title: string, description: string): Promise<Album> {
    await this.delay(300)
    const newAlbum = {
      id: `a-${Date.now()}`,
      title,
      description,
      cover_image_url: null,
      created_at: new Date().toISOString(),
    }
    this.albums.push(newAlbum)
    return mapAlbumFromDTO(newAlbum)
  }

  async delete(id: string): Promise<void> {
    await this.delay(200)
    this.albums = this.albums.filter(a => a.id !== id)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
