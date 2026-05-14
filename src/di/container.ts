import { MockMediaItemRepository } from '@data/repositories/MockMediaItemRepository'
import { MockAlbumRepository } from '@data/repositories/MockAlbumRepository'
import { SupabaseMediaItemRepository } from '@data/repositories/SupabaseMediaItemRepository'
import { SupabaseAlbumRepository } from '@data/repositories/SupabaseAlbumRepository'
import { supabase } from '@data/remote/supabaseClient'
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
const isSupabaseConfigured = supabase !== null;

const mediaItemRepository: MediaItemRepository = isSupabaseConfigured 
  ? new SupabaseMediaItemRepository() 
  : new MockMediaItemRepository();

const albumRepository: AlbumRepository = isSupabaseConfigured 
  ? new SupabaseAlbumRepository() 
  : new MockAlbumRepository();

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
  isSupabaseConfigured, // Export flag to show warning in UI if needed
} as const

