import type { AnalyticsSummary } from '../entities/PageView'
import type { AnalyticsRepository } from '../repositories/AnalyticsRepository'

/**
 * GetAnalytics — Retrieves aggregated analytics data.
 */
export class GetAnalytics {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(): Promise<AnalyticsSummary> {
    return this.analyticsRepository.getSummary()
  }
}
