import type { MediaItem } from '@domain/entities/MediaItem'
import type {
  AlbumMediaStats,
  MediaItemPage,
  MediaItemPageOptions,
  MediaItemRepository,
} from '@domain/repositories/MediaItemRepository'
import { MOCK_MEDIA_ITEMS } from '../mock/mockMediaItems'
import { mapMediaItemFromDTO } from '../dto/MediaItemDTO'

/**
 * MockMediaItemRepository — In-memory implementation for UI development.
 * Implements the domain MediaItemRepository interface.
 * Will be swapped for SupabaseMediaItemRepository when backend is wired.
 */
export class MockMediaItemRepository implements MediaItemRepository {
  private mediaItems = Array.from({ length: 500 }, (_, i) => {
    const template = MOCK_MEDIA_ITEMS[i % MOCK_MEDIA_ITEMS.length]
    return {
      ...template,
      id: `mock-p-${i}`,
      // Distribute dates over the last 12 months
      date_taken: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }
  })

  async getAll(): Promise<MediaItem[]> {
    // Simulate network delay
    await this.delay(300)
    return this.sortedItems().map(mapMediaItemFromDTO)
  }

  async getPage({ limit, offset, albumId }: MediaItemPageOptions): Promise<MediaItemPage> {
    await this.delay(200)
    const source = albumId
      ? this.sortedItems().filter(p => p.album_id === albumId)
      : this.sortedItems()
    const items = source.slice(offset, offset + limit).map(mapMediaItemFromDTO)
    const nextOffset = offset + items.length

    return {
      items,
      total: source.length,
      hasMore: nextOffset < source.length,
      nextOffset,
    }
  }

  async getAlbumStats(): Promise<AlbumMediaStats[]> {
    await this.delay(150)
    const stats = new Map<string, AlbumMediaStats>()

    for (const item of this.sortedItems()) {
      if (!item.album_id) continue
      const existing = stats.get(item.album_id)
      if (existing) {
        existing.mediaCount += 1
      } else {
        stats.set(item.album_id, {
          albumId: item.album_id,
          mediaCount: 1,
          coverImageUrl: item.thumbnail_url,
        })
      }
    }

    return Array.from(stats.values())
  }

  async getById(id: string): Promise<MediaItem | null> {
    await this.delay(100)
    const dto = this.mediaItems.find(p => p.id === id)
    return dto ? mapMediaItemFromDTO(dto) : null
  }

  async getByAlbumId(albumId: string): Promise<MediaItem[]> {
    await this.delay(200)
    return this.mediaItems
      .filter(p => p.album_id === albumId)
      .map(mapMediaItemFromDTO)
  }

  async upload(
    _file: File,
    caption: string,
    dateTaken: Date,
    albumId?: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<MediaItem> {
    const isVideo = _file.type.startsWith('video/')
    const totalSize = _file.size
    
    // Giả lập tiến trình tải lên cho mock
    if (onProgress) {
      let loaded = 0
      const chunkSize = Math.max(totalSize / 10, 1024 * 50) // Giả lập nhảy từng chunk
      
      while (loaded < totalSize) {
        await this.delay(100)
        loaded = Math.min(loaded + chunkSize, totalSize)
        onProgress(loaded, totalSize)
      }
    } else {
      await this.delay(500)
    }

    const newId = `p-${Date.now()}`
    
    // Create an object URL for the uploaded file
    const fileUrl = URL.createObjectURL(_file)

    // For mock purposes, if it's a video we'll just use a generic thumbnail placeholder 
    // since extracting video frames locally requires canvas manipulation.
    // In a real app, the backend (Supabase) handles thumbnail generation.
    const thumbnailUrl = isVideo 
      ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=50' 
      : fileUrl

    const newMediaItem = {
      id: newId,
      album_id: albumId ?? null,
      media_type: isVideo ? 'video' : 'image',
      url: fileUrl,
      thumbnail_url: thumbnailUrl,
      caption,
      date_taken: dateTaken.toISOString(),
      created_at: new Date().toISOString(),
    }

    this.mediaItems.unshift(newMediaItem as any)
    return mapMediaItemFromDTO(newMediaItem as any)
  }

  async assignToAlbum(id: string, albumId: string): Promise<void> {
    await this.delay(200)
    const item = this.mediaItems.find(p => p.id === id)
    if (item) {
      item.album_id = albumId
    }
  }

  async delete(id: string): Promise<void> {
    await this.delay(200)
    this.mediaItems = this.mediaItems.filter(p => p.id !== id)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private sortedItems() {
    return [...this.mediaItems].sort(
      (a, b) => new Date(b.date_taken).getTime() - new Date(a.date_taken).getTime()
    )
  }
}
