import type { PageView, AnalyticsSummary } from '@domain/entities/PageView'
import type { AnalyticsRepository } from '@domain/repositories/AnalyticsRepository'
import { supabase } from '@data/remote/supabaseClient'

/**
 * SupabaseAnalyticsRepository — Stores page view data in Supabase.
 * Falls back gracefully if the table doesn't exist.
 */
export class SupabaseAnalyticsRepository implements AnalyticsRepository {

  async trackPageView(page: string): Promise<void> {
    if (!supabase) return

    try {
      await supabase.from('page_views').insert({
        page,
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        referrer: document.referrer || '',
        visited_at: new Date().toISOString(),
      })
    } catch {
      // Silently fail — analytics should never break the app
      console.warn('[Analytics] Failed to track page view')
    }
  }

  async getSummary(): Promise<AnalyticsSummary> {
    if (!supabase) {
      return this.emptySummary()
    }

    try {
      // Fetch all page views
      const { data: allViews, error } = await supabase
        .from('page_views')
        .select('*')
        .order('visited_at', { ascending: false })

      if (error || !allViews) return this.emptySummary()

      const pageViews: PageView[] = allViews.map((row: any) => ({
        id: row.id,
        page: row.page,
        userAgent: row.user_agent,
        ipAddress: row.ip_address,
        screenWidth: row.screen_width,
        screenHeight: row.screen_height,
        referrer: row.referrer,
        visitedAt: new Date(row.visited_at),
      }))

      return this.aggregate(pageViews)
    } catch {
      console.warn('[Analytics] Failed to fetch analytics')
      return this.emptySummary()
    }
  }

  private aggregate(views: PageView[]): AnalyticsSummary {
    const today = new Date().toISOString().slice(0, 10)

    // Unique visitors by userAgent fingerprint
    const uniqueAgents = new Set(views.map(v => v.userAgent))

    // Today's views
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
    
    // Fill in missing days with 0
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
      recentVisitors: views.slice(0, 20),
    }
  }

  private parseDeviceType(ua: string): string {
    if (/mobile|android|iphone|ipad/i.test(ua)) return 'Mobile'
    if (/tablet|ipad/i.test(ua)) return 'Tablet'
    return 'Desktop'
  }

  private emptySummary(): AnalyticsSummary {
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      todayViews: 0,
      viewsByPage: [],
      viewsByDay: [],
      viewsByDevice: [],
      recentVisitors: [],
    }
  }
}
