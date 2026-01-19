export type AnalyticsEventType =
  | 'delivered'
  | 'open'
  | 'click'
  | 'bounce'
  | 'spam'
  | 'unsubscribe'
  | 'complaint'

export interface AnalyticsSummary {
  startDate: string // ISO date
  endDate: string // ISO date
  totalSent: number
  totalDelivered: number
  totalOpens: number
  totalClicks: number
  totalBounces: number
  totalSpamReports: number
}

export interface AnalyticsTimeseriesPoint {
  date: string // ISO date (yyyy-mm-dd)
  delivered?: number
  opens?: number
  clicks?: number
  bounces?: number
  spamReports?: number
}

export interface AnalyticsSeriesPoint {
  date: string // ISO date
  value: number
}

export interface AnalyticsSeries {
  event: AnalyticsEventType
  points: AnalyticsSeriesPoint[]
}

export interface AnalyticsApiResponse {
  summary: AnalyticsSummary
  // series grouped by event type; each series contains points ordered by date
  series: AnalyticsSeries[]
}
