import type { FC } from 'react'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: 'timeline' | 'albums') => void
}

/**
 * Header — Sticky navbar with glassmorphism backdrop.
 * Now receives navigation state from the router.
 */
export const Header: FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <a
          href="#timeline"
          className="header__logo"
          aria-label="MyMemory — Trang chủ"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('timeline')
          }}
        >
          <svg className="header__logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="header__title">MyMemory</span>
        </a>

        <nav className="header__nav" aria-label="Main navigation">
          <button
            className={`header__link ${currentPage === 'timeline' ? 'header__link--active' : ''}`}
            onClick={() => onNavigate('timeline')}
          >
            Hành trình
          </button>
          <button
            className={`header__link ${currentPage === 'albums' || currentPage === 'album-detail' ? 'header__link--active' : ''}`}
            onClick={() => onNavigate('albums')}
          >
            Albums
          </button>
        </nav>
      </div>
    </header>
  )
}
