import type { FC } from 'react'

export const Footer: FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <svg className="footer__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>MyMemory</span>
        </div>
        <p className="footer__text">
          Được tạo với tình yêu bởi bố Dương và mẹ Quỳnh — cho con gái yêu dấu 💕
        </p>
        <p className="footer__copyright">
          © {new Date().getFullYear()} MyMemory. Mọi ký ức đều quý giá.
        </p>
      </div>
    </footer>
  )
}
