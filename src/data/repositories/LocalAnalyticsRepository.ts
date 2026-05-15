import type { PageView, AnalyticsSummary } from '@domain/entities/PageView'
import type { AnalyticsRepository } from '@domain/repositories/AnalyticsRepository'

const STORAGE_KEY = 'myMemory_pageViews'

/**
 * LocalAnalyticsRepository — Fallback that stores page views in localStorage.
 * Used when Supabase is not configured.
 */
export class LocalAnalyticsRepository implements AnalyticsRepository {

  async trackPageView(page: string): Promise<void> {
    const views = this.loadViews()
    const newView: PageView = {
      id: crypto.randomUUID(),
      page,
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      referrer: document.referrer || '',
      visitedAt: new Date(),
    }
    views.push(newView)
    
    // Keep max 1000 entries to avoid localStorage limits
    if (views.length > 1000) {
      views.splice(0, views.length - 1000)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
  }

  async getSummary(): Promise<AnalyticsSummary> {
    const views = this.loadViews()
    return this.aggregate(views)
  }

  private loadViews(): PageView[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as any[]
      return parsed.map(v => ({
        ...v,
        visitedAt: new Date(v.visitedAt),
      }))
    } catch {
      return []
    }
  }

  private aggregate(views: PageView[]): AnalyticsSummary {
    const today = new Date().toISOString().slice(0, 10)
    const uniqueAgents = new Set(views.map(v => v.userAgent))
    const todayViews = views.filter(
      v => v.visitedAt.toISOString().slice(0, 10) === today
    ).length

    // Views by page
    const pageMap = new Map<string, number>()
    views.forEach(v => {
      pageMap.set(v.page, (pageMap.get(v.page) || 0) + 1)
    })
    const viewsByPage = Array.from(pageMap.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)

    // Views by day (last 30 days)
    const dayMap = new Map<string, number>()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    views
      .filter(v => v.visitedAt >= thirtyDaysAgo)
      .forEach(v => {
        const day = v.visitedAt.toISOString().slice(0, 10)
        dayMap.set(day, (dayMap.get(day) || 0) + 1)
      })

    const viewsByDay: { date: string; count: number }[] = []
    for (let d = new Date(thirtyDaysAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10)
      viewsByDay.push({ date: dateStr, count: dayMap.get(dateStr) || 0 })
    }

    // Views by device type
    const deviceMap = new Map<string, number>()
    views.forEach(v => {
      const device = this.parseDeviceType(v.userAgent)
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1)
    })
    const viewsByDevice = Array.from(deviceMap.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)

    return {
      totalViews: views.length,
      uniqueVisitors: uniqueAgents.size,
      todayViews,
      viewsByPage,
      viewsByDay,
      viewsByDevice,
      recentVisitors: views.sort((a, b) => b.visitedAt.getTime() - a.visitedAt.getTime()).slice(0, 20),
    }
  }

  private parseDeviceType(ua: string): string {
    if (/mobile|android|iphone|ipad/i.test(ua)) return 'Mobile'
    if (/tablet|ipad/i.test(ua)) return 'Tablet'
    return 'Desktop'
  }
}
