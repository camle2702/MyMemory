import { type FC, useEffect } from 'react'
import type { MediaItem } from '@domain/entities/MediaItem'
import { useAlbums } from '../hooks/useAlbums'
import { useAssignMedia } from '../hooks/useAssignMedia'
import { LoadingSkeleton } from './LoadingSkeleton'

interface AssignAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  mediaItem: MediaItem | null
  onSuccess?: () => void
}

export const AssignAlbumModal: FC<AssignAlbumModalProps> = ({
  isOpen,
  onClose,
  mediaItem,
  onSuccess
}) => {
  const { albums, isLoading, refresh } = useAlbums()
  const { assignToAlbum, isAssigning, error } = useAssignMedia()

  useEffect(() => {
    if (isOpen) {
      refresh()
    }
  }, [isOpen, refresh])

  if (!isOpen || !mediaItem) return null

  const handleAssign = async (albumId: string) => {
    await assignToAlbum(mediaItem.id, albumId)
    onSuccess?.()
    onClose()
  }

  return (
    <div className="assign-modal">
      <div className="assign-modal__content" role="dialog" aria-labelledby="assign-album-title">
        <div className="assign-modal__header">
          <h2 id="assign-album-title" className="assign-modal__title">
            Thêm vào Bộ sưu tập
          </h2>
          <button 
            onClick={onClose}
            className="assign-modal__close"
            aria-label="Đóng"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="assign-modal__body">
          {error && (
            <div className="error-state" style={{ padding: 'var(--space-4)' }}>
              <p className="error-state__message">😔 {error}</p>
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="loading-skeleton__line loading-skeleton__line--full" style={{ height: '80px', borderRadius: 'var(--radius-xl)' }}></div>
              <div className="loading-skeleton__line loading-skeleton__line--full" style={{ height: '80px', borderRadius: 'var(--radius-xl)' }}></div>
            </div>
          ) : albums.length === 0 ? (
            <div className="assign-modal__empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p>Chưa có bộ sưu tập nào.<br/>Vui lòng tạo bộ sưu tập mới trước.</p>
            </div>
          ) : (
            albums.map((album) => {
              const isAssigned = mediaItem.albumId === album.id;
              return (
                <button
                  key={album.id}
                  disabled={isAssigning}
                  onClick={() => handleAssign(album.id)}
                  className={`assign-modal__item ${isAssigned ? 'assign-modal__item--assigned' : ''}`}
                >
                  <div className="assign-modal__item-thumb">
                    {album.coverImageUrl ? (
                      <img src={album.coverImageUrl} alt="" />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="assign-modal__item-info">
                    <h3 className="assign-modal__item-title">{album.title}</h3>
                    <p className="assign-modal__item-desc">
                      {isAssigned ? 'Đang nằm trong thư mục này' : 'Bấm để thêm vào'}
                    </p>
                  </div>
                  {isAssigned && (
                    <div className="assign-modal__item-status assign-modal__item-status--assigned">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                  {isAssigning && mediaItem.albumId !== album.id && (
                    <div className="assign-modal__item-status assign-modal__item-status--loading"></div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
