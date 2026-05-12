import type { Album } from '@domain/entities/Album'

export interface AlbumDTO {
  id: string
  title: string
  description: string
  cover_image_url: string | null
  created_at: string
}

export function mapAlbumFromDTO(dto: AlbumDTO): Album {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    coverImageUrl: dto.cover_image_url,
    createdAt: new Date(dto.created_at),
  }
}
