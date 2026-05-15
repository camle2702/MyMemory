import { type FC, useEffect, useRef, useState } from 'react'
import type { TimelineGroupBy } from '@domain/usecases/GetTimelineMedia'

interface GroupingSwitcherProps {
  currentValue: TimelineGroupBy
  onChange: (value: TimelineGroupBy) => void
}

export const GroupingSwitcher: FC<GroupingSwitcherProps> = ({ currentValue, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pillStyle, setPillStyle] = useState({ width: 0, transform: 'translateX(0px)' })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current) return
      const activeButton = containerRef.current.querySelector(`[data-value="${currentValue}"]`) as HTMLElement
      if (activeButton) {
        setPillStyle({
          width: activeButton.offsetWidth,
          transform: `translateX(${activeButton.offsetLeft}px)`,
        })
      }
    }, 50)
    return () => clearTimeout(timeout)
  }, [currentValue])

  return (
    <div className="grouping-switcher-wrapper">
      <div className="grouping-switcher" ref={containerRef}>
        <div className="grouping-switcher__pill" style={pillStyle} />
        
        <button
          className={`grouping-switcher__btn ${currentValue === 'day' ? 'grouping-switcher__btn--active' : ''}`}
          data-value="day"
          onClick={() => onChange('day')}
          aria-label="Xem theo ngày"
        >
          Ngày
        </button>

        <button
          className={`grouping-switcher__btn ${currentValue === 'month' ? 'grouping-switcher__btn--active' : ''}`}
          data-value="month"
          onClick={() => onChange('month')}
          aria-label="Xem theo tháng"
        >
          Tháng
        </button>
      </div>
    </div>
  )
}
