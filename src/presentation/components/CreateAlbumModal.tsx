import { useState, useRef, useCallback, useEffect, type FC } from 'react'
import { useCreateAlbum } from '../hooks/useCreateAlbum'

interface CreateAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * CreateAlbumModal — Dialog for creating a new album.
 */
export const CreateAlbumModal: FC<CreateAlbumModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const backdropRef = useRef<HTMLDivElement>(null)

  const handleCreateSuccess = useCallback(() => {
    setTimeout(() => {
      onSuccess()
      resetForm()
    }, 800)
  }, [onSuccess])

  const { isCreating, error, success, create, reset: resetCreate } = useCreateAlbum(handleCreateSuccess)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCreating) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isCreating, onClose])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    resetCreate()
  }

  const handleClose = () => {
    if (isCreating) return
    resetForm()
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) handleClose()
  }

  const handleSubmit = async () => {
    if (!title.trim()) return
    await create(title, description)
  }

  const isFormValid = title.trim().length > 0

  if (!isOpen) return null

  return (
    <div
      className="upload-modal"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Tạo album mới"
    >
      <div className="upload-modal__panel" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="upload-modal__header">
          <h2 className="upload-modal__title">Album mới</h2>
          <button
            className="upload-modal__close"
            onClick={handleClose}
            disabled={isCreating}
            aria-label="Đóng"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="upload-modal__body">
          <div className="upload-modal__fields" style={{ marginTop: 0 }}>
            {/* Title */}
            <div className="upload-modal__field">
              <label htmlFor="albumTitle" className="upload-modal__label">
                Tên album
                <span className="upload-modal__required">*</span>
              </label>
              <input
                id="albumTitle"
                type="text"
                className="upload-modal__input"
                placeholder="VD: Sinh nhật 1 tuổi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                disabled={isCreating}
                autoFocus
              />
              <span className="upload-modal__char-count">
                {title.length}/100
              </span>
            </div>

            {/* Description */}
            <div className="upload-modal__field">
              <label htmlFor="albumDescription" className="upload-modal__label">
                Mô tả
              </label>
              <textarea
                id="albumDescription"
                className="upload-modal__textarea"
                placeholder="Một vài lời về album này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
                disabled={isCreating}
              />
              <span className="upload-modal__char-count">
                {description.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="upload-modal__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="upload-modal__footer">
          <button
            className="upload-modal__btn upload-modal__btn--cancel"
            onClick={handleClose}
            disabled={isCreating}
          >
            Hủy
          </button>
          <button
            className="upload-modal__btn upload-modal__btn--submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isCreating}
          >
            {isCreating ? (
              <>
                <div className="upload-modal__btn-spinner" />
                Đang tạo...
              </>
            ) : success ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Thành công!
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Tạo album
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
