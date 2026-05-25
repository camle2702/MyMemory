import { useState, useRef, useCallback, useEffect, type FC, type DragEvent } from 'react'
import type { Album } from '@domain/entities/Album'
import { useUploadMedia } from '../hooks/useUploadMedia'


const BeGaoMascot: FC<{ state: 'idle' | 'dragging' | 'ready' | 'uploading' | 'success' }> = ({ state }) => {
  const getBubbleText = () => {
    switch (state) {
      case 'dragging':
        return 'Ôi Gạo thích quá, thả ảnh vào đây đi ạ! ❤️'
      case 'ready':
        return 'Gạo chuẩn bị sẵn sàng rồi, nhấn Tải lên nhé! 🚀'
      case 'uploading':
        return 'Gạo đang nhận ảnh nè, chờ Gạo tí xíu nha... ⚡'
      case 'success':
        return 'Tải lên thành công rồi ạ! Gạo yêu bố mẹ nhất! 🎉✨'
      case 'idle':
      default:
        return 'Bố Long Mẹ Lệ thả ảnh cho Gạo nhé! 🥰'
    }
  }

  return (
    <div className="mascot-container">
      <div className="mascot-bubble">
        {getBubbleText()}
      </div>
      <svg className="mascot-svg" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Adorable white rice grain body */}
        <path
          d="M50 15 C72 15, 80 40, 80 65 C80 88, 68 95, 50 95 C32 95, 20 88, 20 65 C20 40, 28 15, 50 15 Z"
          fill="#ffffff"
          stroke="var(--color-blue-300)"
          strokeWidth="3.5"
        />

        {/* Cute pink bow for Bé Gạo (baby girl) */}
        <path d="M68 25 C63 18, 58 27, 65 30 Z" fill="var(--color-accent)" />
        <path d="M74 32 C78 25, 68 25, 69 31 Z" fill="var(--color-accent)" />
        <circle cx="68" cy="28" r="4.5" fill="var(--color-red-600)" />

        {/* Blush cheeks */}
        <circle cx="33" cy="62" r="6" fill="#fecdd3" opacity="0.8" />
        <circle cx="67" cy="62" r="6" fill="#fecdd3" opacity="0.8" />

        {/* Render elements based on dynamic states */}
        {state === 'idle' && (
          <>
            {/* Eyes */}
            <rect x="38" y="50" width="5" height="10" rx="2.5" fill="#0f172a" />
            <rect x="57" y="50" width="5" height="10" rx="2.5" fill="#0f172a" />
            <circle cx="40" cy="53" r="1.5" fill="#ffffff" />
            <circle cx="59" cy="53" r="1.5" fill="#ffffff" />
            {/* Mouth */}
            <path d="M46 64 Q50 67 54 64" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Waving/resting arms */}
            <path d="M18 64 Q10 58 12 52" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M82 64 Q88 68 85 74" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {state === 'dragging' && (
          <>
            {/* Heart Eyes */}
            <path d="M36 48 C33 44, 41 42, 41 49 C41 42, 49 44, 46 48 L41 53 Z" fill="var(--color-accent)" />
            <path d="M54 48 C51 44, 59 42, 59 49 C59 42, 67 44, 64 48 L59 53 Z" fill="var(--color-accent)" />
            {/* Mouth */}
            <path d="M45 61 Q50 71 55 61 Z" fill="#e11d48" />
            {/* Excited raised arms */}
            <path d="M18 62 Q10 52 14 44" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M82 62 Q90 52 86 44" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {state === 'ready' && (
          <>
            {/* Wink and happy eye */}
            <path d="M36 52 L42 55 L36 58" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M54 56 Q58 50 62 56" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Smile */}
            <path d="M46 64 Q50 69 54 64" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Happy cheering arms */}
            <path d="M18 60 Q12 50 16 46" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M82 60 Q88 50 84 46" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {state === 'uploading' && (
          <>
            {/* Helmet */}
            <path d="M34 25 C34 10, 66 10, 66 25 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M30 25 C30 25, 50 28, 70 25" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
            <rect x="47" y="14" width="6" height="11" fill="#ffffff" rx="1" />
            {/* Closed curved eyes */}
            <path d="M37 54 Q41 58 45 54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M55 54 Q59 58 63 54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Cute 'o' focus mouth */}
            <circle cx="50" cy="64" r="3.5" fill="#0f172a" />
            {/* Working arms and flag */}
            <path d="M18 64 Q12 68 15 74" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M82 64 Q88 60 92 50" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            <line x1="92" y1="50" x2="92" y2="36" stroke="#475569" strokeWidth="2" />
            <path d="M92 36 L102 41 L92 46 Z" fill="var(--color-blue-500)" />
          </>
        )}

        {state === 'success' && (
          <>
            {/* Big heart in center */}
            <path d="M50 78 C46 72, 38 72, 38 78 C38 84, 46 88, 50 92 C54 88, 62 84, 62 78 C62 72, 54 72, 50 78 Z" fill="var(--color-accent)" />
            {/* Smiling happy eyes */}
            <path d="M37 52 Q41 46 45 52" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M55 52 Q59 46 63 52" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Wide happy smile */}
            <path d="M46 60 Q50 67 54 60 Z" fill="#e11d48" />
            {/* Hugging arms */}
            <path d="M18 64 Q28 72 38 76" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M82 64 Q72 72 62 76" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Sparkles */}
            <path d="M15 30 L17 33 L20 33 L18 35 L19 38 L15 36 L11 38 L12 35 L10 33 L13 33 Z" fill="#eab308" />
            <path d="M85 32 L87 35 L90 35 L88 37 L89 40 L85 38 L81 40 L82 37 L80 35 L83 35 Z" fill="var(--color-red-400)" />
          </>
        )}
      </svg>
    </div>
  )
}

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
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
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

  const { isUploading, progress, loadedBytes, totalBytes, error, success, upload, reset: resetUpload } = useUploadMedia(handleUploadSuccess)

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
    setFiles([])
    previews.forEach(p => URL.revokeObjectURL(p))
    setPreviews([])
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

  const handleFileSelect = (selectedFiles: FileList | File[]) => {
    const validFiles = Array.from(selectedFiles).filter(
      f => f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    if (validFiles.length === 0) return
    
    setFiles(prev => [...prev, ...validFiles])
    
    const newPreviews = validFiles.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files)
    }
    // Cho phép chọn lại cùng 1 file (hoặc file khác) ở lần tiếp theo
    e.target.value = ''
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleSubmit = async () => {
    if (files.length === 0) return
    await upload(files, caption, new Date(dateTaken), albumId || undefined)
  }

  const isFormValid = files.length > 0

  let mascotState: 'idle' | 'dragging' | 'ready' | 'uploading' | 'success' = 'idle'
  if (success) {
    mascotState = 'success'
  } else if (isUploading) {
    mascotState = 'uploading'
  } else if (isDragging) {
    mascotState = 'dragging'
  } else if (previews.length > 0) {
    mascotState = 'ready'
  }

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
          <BeGaoMascot state={mascotState} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/quicktime,video/webm"
            multiple
            onChange={handleInputChange}
            className="upload-modal__file-input"
            aria-label="Chọn file"
            style={{ display: 'none' }}
          />

          {/* Drop zone / Preview */}
          {previews.length === 0 ? (
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
            <div className="upload-modal__preview-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: 'var(--space-2)',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: 'var(--space-2)'
            }}>
              {files.map((file, idx) => {
                const isVideo = file.type.startsWith('video/');
                return (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    {isVideo ? (
                      <video
                        src={previews[idx]}
                        className="upload-modal__preview-video"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={previews[idx]}
                        alt={`Xem trước ${idx + 1}`}
                        className="upload-modal__preview-image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <button
                      className="upload-modal__preview-remove"
                      onClick={() => {
                        setFiles(prev => prev.filter((_, i) => i !== idx))
                        URL.revokeObjectURL(previews[idx])
                        setPreviews(prev => prev.filter((_, i) => i !== idx))
                      }}
                      aria-label="Xóa file này"
                      disabled={isUploading}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )
              })}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  aspectRatio: '1/1',
                  border: '2px dashed var(--color-sand-200)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-sand-400)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
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
                <span className="upload-modal__optional" style={{ fontWeight: 'normal', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: 'var(--space-2)' }}>(không bắt buộc)</span>
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
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{(progress || 0).toFixed(0)}%</span>
                  <span>
                    {((loadedBytes || 0) / (1024 * 1024)).toFixed(1)} / {((totalBytes || 0) / (1024 * 1024)).toFixed(1)} MB
                  </span>
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
