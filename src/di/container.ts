import { MockMediaItemRepository } from '@data/repositories/MockMediaItemRepository'
import { MockAlbumRepository } from '@data/repositories/MockAlbumRepository'
import { SupabaseMediaItemRepository } from '@data/repositories/SupabaseMediaItemRepository'
import { SupabaseAlbumRepository } from '@data/repositories/SupabaseAlbumRepository'
import { SupabaseAnalyticsRepository } from '@data/repositories/SupabaseAnalyticsRepository'
import { LocalAnalyticsRepository } from '@data/repositories/LocalAnalyticsRepository'
import { supabase } from '@data/remote/supabaseClient'
import { GetTimelineMedia } from '@domain/usecases/GetTimelineMedia'
import { GetAlbums } from '@domain/usecases/GetAlbums'
import { GetAlbumWithMedia } from '@domain/usecases/GetAlbumWithMedia'
import { UploadNewMedia } from '@domain/usecases/UploadNewMedia'
import { CreateAlbum } from '@domain/usecases/CreateAlbum'
import { TrackPageView } from '@domain/usecases/TrackPageView'
import { GetAnalytics } from '@domain/usecases/GetAnalytics'
import type { MediaItemRepository } from '@domain/repositories/MediaItemRepository'
import type { AlbumRepository } from '@domain/repositories/AlbumRepository'
import type { AnalyticsRepository } from '@domain/repositories/AnalyticsRepository'

import { AssignMediaToAlbum } from '@domain/usecases/AssignMediaToAlbum'

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

const analyticsRepository: AnalyticsRepository = isSupabaseConfigured
  ? new SupabaseAnalyticsRepository()
  : new LocalAnalyticsRepository();

// Use Cases
const getTimelinePhotos = new GetTimelineMedia(mediaItemRepository)
const getAlbums = new GetAlbums(albumRepository, mediaItemRepository)
const getAlbumWithPhotos = new GetAlbumWithMedia(albumRepository, mediaItemRepository)
const uploadNewMedia = new UploadNewMedia(mediaItemRepository)
const createAlbum = new CreateAlbum(albumRepository)
const assignMediaToAlbum = new AssignMediaToAlbum(mediaItemRepository)
const trackPageView = new TrackPageView(analyticsRepository)
const getAnalytics = new GetAnalytics(analyticsRepository)

export const container = {
  mediaItemRepository,
  albumRepository,
  analyticsRepository,
  getTimelinePhotos,
  getAlbums,
  getAlbumWithPhotos,
  uploadNewMedia,
  createAlbum,
  assignMediaToAlbum,
  trackPageView,
  getAnalytics,
  isSupabaseConfigured,
} as const

