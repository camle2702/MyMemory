import { type FC, useEffect, useRef, useState } from 'react'

export type ViewMode = 'grid' | 'masonry' | 'list'

interface ViewSwitcherProps {
  currentMode: ViewMode
  onChange: (mode: ViewMode) => void
}

export const ViewSwitcher: FC<ViewSwitcherProps> = ({ currentMode, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pillStyle, setPillStyle] = useState({ width: 0, transform: 'translateX(0px)' })

  useEffect(() => {
    // A small delay ensures fonts/layouts are ready before measuring
    const timeout = setTimeout(() => {
      if (!containerRef.current) return
      const activeButton = containerRef.current.querySelector(`[data-mode="${currentMode}"]`) as HTMLElement
      if (activeButton) {
        setPillStyle({
          width: activeButton.offsetWidth,
          transform: `translateX(${activeButton.offsetLeft}px)`,
        })
      }
    }, 50)
    return () => clearTimeout(timeout)
  }, [currentMode])

  return (
    <div className="view-switcher-wrapper">
      <div className="view-switcher" ref={containerRef}>
        <div className="view-switcher__pill" style={pillStyle} />
        
        <button
          className={`view-switcher__btn ${currentMode === 'grid' ? 'view-switcher__btn--active' : ''}`}
          data-mode="grid"
          onClick={() => onChange('grid')}
          aria-label="Chế độ lưới vuông"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Lưới
        </button>

        <button
          className={`view-switcher__btn ${currentMode === 'masonry' ? 'view-switcher__btn--active' : ''}`}
          data-mode="masonry"
          onClick={() => onChange('masonry')}
          aria-label="Chế độ bố cục tự do"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          Tự do
        </button>

        <button
          className={`view-switcher__btn ${currentMode === 'list' ? 'view-switcher__btn--active' : ''}`}
          data-mode="list"
          onClick={() => onChange('list')}
          aria-label="Chế độ danh sách chi tiết"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Chi tiết
        </button>
      </div>
    </div>
  )
}
