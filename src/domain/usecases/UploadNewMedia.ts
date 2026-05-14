import type { MediaItem } from '../entities/MediaItem'
import type { MediaItemRepository } from '../repositories/MediaItemRepository'

/**
 * UploadNewMedia Use Case
 *
 * Handles the business rules around uploading a new mediaItem.
 */
export class UploadNewMedia {
  constructor(private readonly mediaItemRepository: MediaItemRepository) {}

  async execute(
    file: File,
    caption: string,
    dateTaken: Date,
    albumId?: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<MediaItem> {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      throw new Error('File phải là hình ảnh hoặc video')
    }

    if (file.size > 200 * 1024 * 1024) {
      throw new Error('File không được vượt quá 200MB')
    }

    if (!caption.trim()) {
      throw new Error('Vui lòng thêm caption cho ảnh')
    }

    return this.mediaItemRepository.upload(file, caption.trim(), dateTaken, albumId, onProgress)
  }
}
