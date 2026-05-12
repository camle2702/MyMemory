import type { Album } from '../entities/Album'

/**
 * AlbumRepository interface — contract for album data operations.
 */
export interface AlbumRepository {
  getAll(): Promise<Album[]>
  getById(id: string): Promise<Album | null>
  create(title: string, description: string): Promise<Album>
  delete(id: string): Promise<void>
}
