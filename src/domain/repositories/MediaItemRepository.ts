import type { MediaItem } from '../entities/MediaItem'

/**
 * MediaItemRepository interface — defines the contract the Data layer must fulfill.
 * The Domain layer owns this interface; the Data layer provides the implementation.
 */
export interface MediaItemRepository {
  getAll(): Promise<MediaItem[]>
  getById(id: string): Promise<MediaItem | null>
  getByAlbumId(albumId: string): Promise<MediaItem[]>
  upload(
    file: File, 
    caption: string, 
    dateTaken: Date, 
    albumId?: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<MediaItem>
  delete(id: string): Promise<void>
}
