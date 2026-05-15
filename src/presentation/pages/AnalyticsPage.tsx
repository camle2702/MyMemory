import { useState, useEffect, useRef, type FC } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

/**
 * AnalyticsPage — Premium dashboard showing visitor statistics.
 */
export const AnalyticsPage: FC = () => {
  const { summary, isLoading, error, refresh } = useAnalytics()
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsHeaderVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Compute chart bar max height
  const maxDayCount = summary
    ? Math.max(...summary.viewsByDay.map(d => d.count), 1)
    : 1

  const formatPageName = (page: string): string => {
    switch (page) {
      case 'timeline': return 'Hành trình'
      case 'albums': return 'Albums'
      case 'album-detail': return 'Chi tiết Album'
      case 'analytics': return 'Thống kê'
      default: return page
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const parseDeviceIcon = (device: string): string => {
    if (device === 'Mobile') return '📱'
    if (device === 'Tablet') return '📋'
    return '🖥️'
  }

  return (
    <section className="analytics-page">
      {/* Page header */}
      <div className={`analytics-page__header ${isHeaderVisible ? 'analytics-page__header--visible' : ''}`}>
        <p className="analytics-page__eyebrow">✦ Thống kê ✦</p>
        <h1 className="analytics-page__title">Lượt xem trang</h1>
        <p className="analytics-page__subtitle">
          Theo dõi ai đã ghé thăm và xem kỷ niệm của bạn
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="analytics-page__loading">
          <div className="analytics-page__spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-state">
          <p className="error-state__message">😔 {error}</p>
        </div>
      )}

      {/* Dashboard */}
      {!isLoading && !error && summary && (
        <div className="analytics-page__dashboard">
          {/* KPI Cards */}
          <div className="analytics-page__kpis">
            <div className="analytics-kpi">
              <div className="analytics-kpi__icon">👁️</div>
              <div className="analytics-kpi__content">
                <span className="analytics-kpi__value">{summary.totalViews.toLocaleString()}</span>
                <span className="analytics-kpi__label">Tổng lượt xem</span>
              </div>
            </div>

            <div className="analytics-kpi">
              <div className="analytics-kpi__icon">👤</div>
              <div className="analytics-kpi__content">
                <span className="analytics-kpi__value">{summary.uniqueVisitors.toLocaleString()}</span>
                <span className="analytics-kpi__label">Khách riêng biệt</span>
              </div>
            </div>

            <div className="analytics-kpi">
              <div className="analytics-kpi__icon">📅</div>
              <div className="analytics-kpi__content">
                <span className="analytics-kpi__value">{summary.todayViews.toLocaleString()}</span>
                <span className="analytics-kpi__label">Hôm nay</span>
              </div>
            </div>

            <div className="analytics-kpi">
              <div className="analytics-kpi__icon">📊</div>
              <div className="analytics-kpi__content">
                <span className="analytics-kpi__value">
                  {summary.viewsByDay.length > 0
                    ? (summary.totalViews / Math.max(summary.viewsByDay.filter(d => d.count > 0).length, 1)).toFixed(1)
                    : '0'}
                </span>
                <span className="analytics-kpi__label">Trung bình/ngày</span>
              </div>
            </div>
          </div>

          {/* Chart: Views by Day */}
          <div className="analytics-card">
            <h2 className="analytics-card__title">Lượt xem 30 ngày qua</h2>
            <div className="analytics-chart" ref={chartRef}>
              <div className="analytics-chart__bars">
                {summary.viewsByDay.map((day, idx) => (
                  <div
                    key={day.date}
                    className="analytics-chart__bar-group"
                    title={`${day.date}: ${day.count} lượt xem`}
                  >
                    <div
                      className="analytics-chart__bar"
                      style={{
                        height: `${Math.max((day.count / maxDayCount) * 100, 2)}%`,
                        animationDelay: `${idx * 20}ms`,
                      }}
                    />
                    {/* Show date label every 5 days */}
                    {idx % 5 === 0 && (
                      <span className="analytics-chart__label">
                        {day.date.slice(5)} {/* MM-DD */}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two-column: Pages + Devices */}
          <div className="analytics-page__row">
            {/* Views by Page */}
            <div className="analytics-card">
              <h2 className="analytics-card__title">Theo trang</h2>
              <div className="analytics-list">
                {summary.viewsByPage.length === 0 && (
                  <p className="analytics-list__empty">Chưa có dữ liệu</p>
                )}
                {summary.viewsByPage.map(item => {
                  const pct = summary.totalViews > 0
                    ? ((item.count / summary.totalViews) * 100).toFixed(1)
                    : '0'
                  return (
                    <div key={item.page} className="analytics-list__item">
                      <div className="analytics-list__info">
                        <span className="analytics-list__name">{formatPageName(item.page)}</span>
                        <span className="analytics-list__count">{item.count} ({pct}%)</span>
                      </div>
                      <div className="analytics-list__bar-bg">
                        <div
                          className="analytics-list__bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Views by Device */}
            <div className="analytics-card">
              <h2 className="analytics-card__title">Thiết bị</h2>
              <div className="analytics-list">
                {summary.viewsByDevice.length === 0 && (
                  <p className="analytics-list__empty">Chưa có dữ liệu</p>
                )}
                {summary.viewsByDevice.map(item => {
                  const pct = summary.totalViews > 0
                    ? ((item.count / summary.totalViews) * 100).toFixed(1)
                    : '0'
                  return (
                    <div key={item.device} className="analytics-list__item">
                      <div className="analytics-list__info">
                        <span className="analytics-list__name">
                          {parseDeviceIcon(item.device)} {item.device}
                        </span>
                        <span className="analytics-list__count">{item.count} ({pct}%)</span>
                      </div>
                      <div className="analytics-list__bar-bg">
                        <div
                          className="analytics-list__bar-fill analytics-list__bar-fill--device"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recent visitors table */}
          <div className="analytics-card">
            <div className="analytics-card__header-row">
              <h2 className="analytics-card__title">Lượt truy cập gần đây</h2>
              <button className="analytics-card__refresh" onClick={refresh} aria-label="Làm mới">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </div>
            <div className="analytics-table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Trang</th>
                    <th>Thiết bị</th>
                    <th className="analytics-table__hide-mobile">Màn hình</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentVisitors.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                        Chưa có lượt truy cập nào
                      </td>
                    </tr>
                  )}
                  {summary.recentVisitors.map((visitor, idx) => (
                    <tr key={visitor.id} style={{ animationDelay: `${idx * 40}ms` }}>
                      <td>{formatTime(visitor.visitedAt)}</td>
                      <td>
                        <span className="analytics-table__page-badge">
                          {formatPageName(visitor.page)}
                        </span>
                      </td>
                      <td>{/mobile|android|iphone/i.test(visitor.userAgent) ? '📱 Mobile' : '🖥️ Desktop'}</td>
                      <td className="analytics-table__hide-mobile">{visitor.screenWidth}×{visitor.screenHeight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
