import { useState, useEffect, type FC } from 'react'

/**
 * Hero — Landing section with animated headline and baby-themed intro.
 */
export const Hero: FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero__bg-shapes">
        <div className="hero__shape hero__shape--1" />
        <div className="hero__shape hero__shape--2" />
        <div className="hero__shape hero__shape--3" />
      </div>

      <div className={`hero__content ${isVisible ? 'hero__content--visible' : ''}`}>
        <p className="hero__eyebrow">
          ✦ Hành trình của con ✦
        </p>
        <h1 className="hero__heading">
          Mỗi khoảnh khắc<br />
          <span className="hero__heading-accent">đều đáng nhớ</span>
        </h1>
        <p className="hero__description">
          Nơi bố Dương và mẹ Quỳnh lưu giữ từng nụ cười, bước đi đầu tiên,
          và tất cả những kỷ niệm quý giá trên hành trình lớn lên của con.
        </p>
        <a href="#timeline" className="hero__cta">
          Xem hành trình
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </a>
      </div>
    </section>
  )
}
