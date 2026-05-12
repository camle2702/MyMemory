import type { MediaItem } from '@domain/entities/MediaItem'
import type { MediaItemRepository } from '@domain/repositories/MediaItemRepository'

/**
 * SupabaseMediaItemRepository — Production implementation.
 *
 * TODO: Wire up with actual Supabase client.
 * This is the skeleton that will replace MockMediaItemRepository.
 */
export class SupabaseMediaItemRepository implements MediaItemRepository {
  // constructor(private readonly supabase: SupabaseClient) {}

  async getAll(): Promise<MediaItem[]> {
    // const { data, error } = await this.supabase
    //   .from('mediaItems')
    //   .select('*')
    //   .order('date_taken', { ascending: false })
    //
    // if (error) throw new Error(error.message)
    // return data.map(mapMediaItemFromDTO)
    throw new Error('SupabaseMediaItemRepository.getAll() not implemented — use MockMediaItemRepository for now')
  }

  async getById(_id: string): Promise<MediaItem | null> {
    throw new Error('Not implemented')
  }

  async getByAlbumId(_albumId: string): Promise<MediaItem[]> {
    throw new Error('Not implemented')
  }

  async upload(
    _file: File,
    _caption: string,
    _dateTaken: Date,
    _albumId?: string,
  ): Promise<MediaItem> {
    // 1. Upload file to Supabase Storage
    // 2. Get public URL
    // 3. Insert row into mediaItems table
    // 4. Return mapped entity
    throw new Error('Not implemented')
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Not implemented')
  }
}
