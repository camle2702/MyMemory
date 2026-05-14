import { useState, useEffect, type FC } from 'react'
import type { AlbumWithStats } from '@domain/usecases/GetAlbums'
import { useAlbums } from '../hooks/useAlbums'
import { AlbumCard } from '../components/AlbumCard'

interface AlbumsPageProps {
  onAlbumClick: (albumId: string) => void
}

/**
 * AlbumsPage — Grid of album cards with header section.
 */
export const AlbumsPage: FC<AlbumsPageProps> = ({ onAlbumClick }) => {
  const { albums, isLoading, error } = useAlbums()
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsHeaderVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleAlbumClick = (albumId: string) => {
    onAlbumClick(albumId)
  }

  return (
    <section className="albums-page">
      {/* Page header */}
      <div className={`albums-page__header ${isHeaderVisible ? 'albums-page__header--visible' : ''}`}>
        <p className="albums-page__eyebrow">✦ Bộ sưu tập ✦</p>
        <h1 className="albums-page__title">Albums</h1>
        <p className="albums-page__subtitle">
          Những bộ ảnh được sắp xếp theo chủ đề —
          mỗi album là một chương trong câu chuyện của con
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="albums-page__grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="album-card-skeleton">
              <div className="album-card-skeleton__cover" />
              <div className="album-card-skeleton__body">
                <div className="album-card-skeleton__line album-card-skeleton__line--title" />
                <div className="album-card-skeleton__line album-card-skeleton__line--desc" />
                <div className="album-card-skeleton__line album-card-skeleton__line--date" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-state">
          <p className="error-state__message">😔 {error}</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && albums.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📁</div>
          <p className="empty-state__title">Chưa có album nào</p>
          <p className="empty-state__description">
            Hãy tạo album đầu tiên để sắp xếp kỷ niệm của con!
          </p>
        </div>
      )}

      {/* Album grid */}
      {!isLoading && !error && albums.length > 0 && (
        <div className="albums-page__grid">
          {albums.map((album, index) => (
            <AlbumCard
              key={album.id}
              album={album}
              photoCount={album.mediaCount}
              onClick={() => handleAlbumClick(album.id)}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  )
}
