import type { AnalyticsRepository } from '../repositories/AnalyticsRepository'

/**
 * TrackPageView — Records a visitor page view.
 */
export class TrackPageView {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(page: string): Promise<void> {
    return this.analyticsRepository.trackPageView(page)
  }
}
