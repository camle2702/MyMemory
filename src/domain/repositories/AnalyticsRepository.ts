import type { PageView, AnalyticsSummary } from '../entities/PageView'

/**
 * AnalyticsRepository — Interface for tracking and retrieving page views.
 */
export interface AnalyticsRepository {
  /** Record a new page view */
  trackPageView(page: string): Promise<void>
  
  /** Get aggregated analytics summary */
  getSummary(): Promise<AnalyticsSummary>
}
