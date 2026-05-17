import type { MediaItem } from '../entities/MediaItem'

export interface MediaItemPageOptions {
  limit: number
  offset: number
  albumId?: string
}

export interface MediaItemPage {
  items: MediaItem[]
  total: number
  hasMore: boolean
  nextOffset: number
}

export interface AlbumMediaStats {
  albumId: string
  mediaCount: number
  coverImageUrl: string | null
}

/**
 * MediaItemRepository interface — defines the contract the Data layer must fulfill.
 * The Domain layer owns this interface; the Data layer provides the implementation.
 */
export interface MediaItemRepository {
  getAll(): Promise<MediaItem[]>
  getPage(options: MediaItemPageOptions): Promise<MediaItemPage>
  getAlbumStats(): Promise<AlbumMediaStats[]>
  getById(id: string): Promise<MediaItem | null>
  getByAlbumId(albumId: string): Promise<MediaItem[]>
  upload(
    file: File, 
    caption: string, 
    dateTaken: Date, 
    albumId?: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<MediaItem>
  assignToAlbum(id: string, albumId: string): Promise<void>
  delete(id: string): Promise<void>
}
