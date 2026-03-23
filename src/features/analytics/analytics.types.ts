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

/** Rango con fechas YYYY-MM-DD para query `from_date` / `to_date` */
export type StatsRange = {
  from_date: string
  to_date: string
}

/** Respuesta cruda del endpoint `email-sends/stats` (agregados) */
export type EmailSendsStatsRaw = {
  total?: number
  sent?: number
  delivered?: number
  opened?: number
  clicked?: number
  bounced?: number
  failed?: number
  pending?: number
  spam_reports?: number
  spam?: number
}

/** Un elemento de `data.by_date` en `email-sends/timeseries` */
export type EmailSendsTimeseriesDay = {
  date: string
  sent?: number
  delivered?: number
  opened?: number
  clicked?: number
}

/** Métricas mínimas por campaña para gráfica de barras */
export interface AnalyticsCampaignBarItem {
  id?: string | number
  name?: string
  subject?: string
  totalSent?: number
  totalOpens?: number
}

export interface AnalyticsApiResponse {
  summary: AnalyticsSummary
  /** series grouped by event type; each series contains points ordered by date */
  series: AnalyticsSeries[]
  campaigns?: AnalyticsCampaignBarItem[]
}

/** Formato de datos para Chart.js (PrimeReact Chart) */
export interface AnalyticsChartDataset {
  label?: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
}

export interface AnalyticsChartData {
  labels: string[]
  datasets: AnalyticsChartDataset[]
}

/** Valor del filtro de fechas (alineado con DateRangePicker) */
export type AnalyticsDateRange = {
  startDate: Date
  endDate: Date
  label: string
}

export interface DeliveryDonutProps {
  summary: AnalyticsSummary | null
  loading?: boolean
}

export interface OpensClicksLineProps {
  series: AnalyticsSeries[] | null
  loading?: boolean
}

export interface CampaignsBarProps {
  campaigns: AnalyticsCampaignBarItem[] | null
  loading?: boolean
}
