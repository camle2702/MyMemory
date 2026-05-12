import { useState, useRef, useCallback, useEffect, type FC, type DragEvent } from 'react'
import type { Album } from '@domain/entities/Album'
import { useUploadMedia } from '../hooks/useUploadMedia'

interface UploadModalProps {
  isOpen: boolean
  albums: Album[]
  initialAlbumId?: string
  onClose: () => void
  onSuccess: () => void
}

/**
 * UploadModal — Drag-and-drop mediaItem upload dialog.
 *
 * Features:
 * - Drag & drop or click-to-select file picker
 * - Live image preview
 * - Caption, date, and album selector fields
 * - Upload progress with success/error feedback
 */
export const UploadModal: FC<UploadModalProps> = ({ isOpen, albums, initialAlbumId, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [dateTaken, setDateTaken] = useState(new Date().toISOString().slice(0, 10))
  const [albumId, setAlbumId] = useState(initialAlbumId || '')
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Update albumId if initialAlbumId changes while modal is closed
  useEffect(() => {
    if (!isOpen) {
      setAlbumId(initialAlbumId || '')
    }
  }, [initialAlbumId, isOpen])

  const handleUploadSuccess = useCallback(() => {
    // Short delay so user sees success state
    setTimeout(() => {
      onSuccess()
      resetForm()
    }, 800)
  }, [onSuccess])

  const { isUploading, progress, error, success, upload, reset: resetUpload } = useUploadMedia(handleUploadSuccess)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUploading) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isUploading, onClose])

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setCaption('')
    setDateTaken(new Date().toISOString().slice(0, 10))
    setAlbumId(initialAlbumId || '')
    resetUpload()
  }

  const handleClose = () => {
    if (isUploading) return
    resetForm()
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) handleClose()
  }

  // File selection
  const handleFileSelect = (selectedFile: File) => {
    const isImage = selectedFile.type.startsWith('image/')
    const isVideo = selectedFile.type.startsWith('video/')
    if (!isImage && !isVideo) return
    
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFileSelect(f)
  }

  // Drag & drop
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }

  const handleSubmit = async () => {
    if (!file || !caption.trim()) return
    await upload(file, caption, new Date(dateTaken), albumId || undefined)
  }

  const isFormValid = file && caption.trim().length > 0
  const isVideo = file?.type.startsWith('video/')

  if (!isOpen) return null

  return (
    <div
      className="upload-modal"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Thêm kỷ niệm"
    >
      <div className="upload-modal__panel">
        {/* Header */}
        <div className="upload-modal__header">
          <h2 className="upload-modal__title">Thêm kỷ niệm mới</h2>
          <button
            className="upload-modal__close"
            onClick={handleClose}
            disabled={isUploading}
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
          {/* Drop zone / Preview */}
          {!preview ? (
            <div
              className={`upload-modal__dropzone ${isDragging ? 'upload-modal__dropzone--active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4,video/quicktime,video/webm"
                onChange={handleInputChange}
                className="upload-modal__file-input"
                aria-label="Chọn file"
              />
              <div className="upload-modal__dropzone-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="upload-modal__dropzone-text">
                Kéo thả ảnh hoặc video vào đây
              </p>
              <p className="upload-modal__dropzone-hint">
                hoặc nhấn để chọn • Tối đa 200MB
              </p>
            </div>
          ) : (
            <div className="upload-modal__preview">
              {isVideo ? (
                <video
                  src={preview}
                  controls
                  className="upload-modal__preview-video"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#000', display: 'block' }}
                />
              ) : (
                <img
                  src={preview}
                  alt="Xem trước"
                  className="upload-modal__preview-image"
                />
              )}
              <button
                className="upload-modal__preview-remove"
                onClick={() => {
                  setFile(null)
                  if (preview) URL.revokeObjectURL(preview)
                  setPreview(null)
                }}
                aria-label="Xóa file đã chọn"
                disabled={isUploading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* Fields */}
          <div className="upload-modal__fields">
            {/* Caption */}
            <div className="upload-modal__field">
              <label htmlFor="uploadCaption" className="upload-modal__label">
                Caption
                <span className="upload-modal__required">*</span>
              </label>
              <textarea
                id="uploadCaption"
                className="upload-modal__textarea"
                placeholder="Khoảnh khắc này có gì đặc biệt?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                maxLength={500}
                disabled={isUploading}
              />
              <span className="upload-modal__char-count">
                {caption.length}/500
              </span>
            </div>

            {/* Date & Album row */}
            <div className="upload-modal__row">
              <div className="upload-modal__field upload-modal__field--half">
                <label htmlFor="uploadDate" className="upload-modal__label">
                  Ngày
                </label>
                <input
                  id="uploadDate"
                  type="date"
                  className="upload-modal__input"
                  value={dateTaken}
                  onChange={(e) => setDateTaken(e.target.value)}
                  disabled={isUploading}
                />
              </div>

              <div className="upload-modal__field upload-modal__field--half">
                <label htmlFor="uploadAlbum" className="upload-modal__label">
                  Album
                </label>
                <select
                  id="uploadAlbum"
                  className="upload-modal__select"
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  disabled={isUploading}
                >
                  <option value="">Không chọn album</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="upload-modal__progress-container" style={{ marginTop: 'var(--space-2)' }}>
                <div 
                  className="upload-modal__progress-bar" 
                  style={{ 
                    height: '4px', 
                    background: 'var(--color-sand-200)', 
                    borderRadius: '2px', 
                    overflow: 'hidden' 
                  }}
                >
                  <div 
                    style={{ 
                      height: '100%', 
                      background: 'var(--color-accent)', 
                      width: `${progress}%`,
                      transition: 'width 0.2s ease-out'
                    }} 
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', textAlign: 'right' }}>
                  {progress}%
                </div>
              </div>
            )}
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
            disabled={isUploading}
          >
            Hủy
          </button>
          <button
            className="upload-modal__btn upload-modal__btn--submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isUploading}
          >
            {isUploading ? (
              <>
                <div className="upload-modal__btn-spinner" />
                Đang tải lên...
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Tải lên
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
