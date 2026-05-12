import type { AlbumDTO } from '../dto/AlbumDTO'

export const MOCK_ALBUMS: AlbumDTO[] = [
  {
    id: 'a-001',
    title: 'Chào đời',
    description: 'Những khoảnh khắc đầu tiên khi con gái chào đời. Ngày hạnh phúc nhất của bố Dương và mẹ Quỳnh.',
    cover_image_url: 'https://images.unsplash.com/mediaItem-1519689680058-324335c77eba?w=400&q=60',
    created_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 'a-002',
    title: 'Tháng đầu tiên',
    description: 'Con lớn từng ngày, mỗi ngày đều có điều mới mẻ.',
    cover_image_url: 'https://images.unsplash.com/mediaItem-1515488042361-ee00e0ddd4e4?w=400&q=60',
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'a-003',
    title: 'Cột mốc',
    description: 'Lật, cười, bi bô — mỗi milestone đều đáng nhớ.',
    cover_image_url: 'https://images.unsplash.com/mediaItem-1491013516836-7db643ee125a?w=400&q=60',
    created_at: '2026-07-01T10:00:00Z',
  },
]
