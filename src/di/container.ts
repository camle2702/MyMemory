import { MockMediaItemRepository } from '@data/repositories/MockMediaItemRepository'
import { MockAlbumRepository } from '@data/repositories/MockAlbumRepository'
import { GetTimelineMedia } from '@domain/usecases/GetTimelineMedia'
import { GetAlbums } from '@domain/usecases/GetAlbums'
import { GetAlbumWithMedia } from '@domain/usecases/GetAlbumWithMedia'
import { UploadNewMedia } from '@domain/usecases/UploadNewMedia'
import { CreateAlbum } from '@domain/usecases/CreateAlbum'
import type { MediaItemRepository } from '@domain/repositories/MediaItemRepository'
import type { AlbumRepository } from '@domain/repositories/AlbumRepository'

/**
 * Simple Dependency Injection container.
 * Swap Mock → Supabase repositories when ready.
 */

// Repositories
const mediaItemRepository: MediaItemRepository = new MockMediaItemRepository()
const albumRepository: AlbumRepository = new MockAlbumRepository()

// Use Cases
const getTimelinePhotos = new GetTimelineMedia(mediaItemRepository)
const getAlbums = new GetAlbums(albumRepository)
const getAlbumWithPhotos = new GetAlbumWithMedia(albumRepository, mediaItemRepository)
const uploadNewMedia = new UploadNewMedia(mediaItemRepository)
const createAlbum = new CreateAlbum(albumRepository)

export const container = {
  mediaItemRepository,
  albumRepository,
  getTimelinePhotos,
  getAlbums,
  getAlbumWithPhotos,
  uploadNewMedia,
  createAlbum,
} as const
