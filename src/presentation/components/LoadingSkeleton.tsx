import type { FC } from 'react'

export const LoadingSkeleton: FC = () => {
  return (
    <div className="loading-skeleton">
      <div className="loading-skeleton__header">
        <div className="loading-skeleton__line loading-skeleton__line--short" />
      </div>
      <div className="loading-skeleton__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="loading-skeleton__card"
            style={{ height: `${180 + Math.random() * 120}px` }}
          />
        ))}
      </div>
    </div>
  )
}
