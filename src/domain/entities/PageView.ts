/**
 * PageView — Represents a single page visit event.
 */
export interface PageView {
  id: string
  /** Which page was visited: 'timeline', 'albums', 'album-detail', 'analytics' */
  page: string
  /** Visitor's user-agent string */
  userAgent: string
  /** Visitor's IP or location hint (if available) */
  ipAddress?: string
  /** Screen width for device analytics */
  screenWidth: number
  /** Screen height for device analytics */
  screenHeight: number
  /** Referrer URL */
  referrer: string
  /** When the visit happened */
  visitedAt: Date
}

/**
 * Aggregated stats for the analytics dashboard.
 */
export interface AnalyticsSummary {
  totalViews: number
  uniqueVisitors: number
  todayViews: number
  viewsByPage: { page: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
  viewsByDevice: { device: string; count: number }[]
  recentVisitors: PageView[]
}
