import type { MediaItemRepository } from '../repositories/MediaItemRepository'

/**
 * AssignMediaToAlbum — UseCase to assign an existing media item to a specific album.
 */
export class AssignMediaToAlbum {
  constructor(private mediaItemRepository: MediaItemRepository) {}

  async execute(mediaId: string, albumId: string): Promise<void> {
    if (!mediaId || !albumId) {
      throw new Error('Thiếu thông tin ảnh hoặc bộ sưu tập')
    }

    return this.mediaItemRepository.assignToAlbum(mediaId, albumId)
  }
}
