import type {
  AnalyticsApiResponse,
  AnalyticsSeries,
  AnalyticsSummary,
  EmailSendsStatsRaw,
  EmailSendsTimeseriesDay,
  StatsRange,
} from './analytics.types'
import { authorizedFetch } from '@/lib/authorizedFetch'

const API_URL = import.meta.env.VITE_API_URL

export type { StatsRange } from './analytics.types'

function buildStatsQuery(range: StatsRange): string {
  const params = new URLSearchParams()
  params.set('from_date', range.from_date)
  params.set('to_date', range.to_date)
  return `?${params.toString()}`
}

/** Mapea la respuesta de email-sends/stats a AnalyticsSummary */
function mapStatsToSummary(raw: EmailSendsStatsRaw, from_date: string, to_date: string): AnalyticsSummary {
  const sent = Number(raw.sent ?? raw.total ?? 0)
  const delivered = Number(raw.delivered ?? 0)
  const opened = Number(raw.opened ?? 0)
  const clicked = Number(raw.clicked ?? 0)
  const bounced = Number(raw.bounced ?? 0)
  const spamReports = Number(raw.spam_reports ?? raw.spam ?? 0)
  return {
    startDate: from_date,
    endDate: to_date,
    totalSent: sent,
    totalDelivered: delivered,
    totalOpens: opened,
    totalClicks: clicked,
    totalBounces: bounced,
    totalSpamReports: spamReports,
  }
}

/** Genera series mínimas (un punto por rango) cuando no hay timeseries */
function summaryToSeries(summary: AnalyticsSummary): AnalyticsSeries[] {
  const date = summary.endDate
  return [
    { event: 'delivered', points: [{ date, value: summary.totalDelivered }] },
    { event: 'open', points: [{ date, value: summary.totalOpens }] },
    { event: 'click', points: [{ date, value: summary.totalClicks }] },
  ]
}

/** Convierte data.by_date del endpoint timeseries a AnalyticsSeries[] */
function mapByDateToSeries(by_date: EmailSendsTimeseriesDay[]): AnalyticsSeries[] {
  if (!Array.isArray(by_date) || by_date.length === 0) return []
  const sorted = [...by_date].sort((a, b) => a.date.localeCompare(b.date))
  return [
    { event: 'delivered', points: sorted.map(d => ({ date: d.date, value: d.delivered ?? 0 })) },
    { event: 'open', points: sorted.map(d => ({ date: d.date, value: d.opened ?? 0 })) },
    { event: 'click', points: sorted.map(d => ({ date: d.date, value: d.clicked ?? 0 })) },
  ]
}

/**
 * Obtiene estadísticas: summary desde email-sends/stats y series desde email-sends/timeseries.
 * Última semana: from_date/to_date 7 días.
 * Último mes: from_date/to_date 30 días.
 * Hoy: from_date = to_date = hoy.
 */
export const analyticsService = {
  async getStats(range: StatsRange): Promise<AnalyticsApiResponse> {
    const query = buildStatsQuery(range)
    const init = {
      method: 'GET' as const,
      headers: { 'Content-Type': 'application/json' },
    }

    const [statsRes, timeseriesRes] = await Promise.all([
      authorizedFetch(`${API_URL}/email-sends/stats${query}`, init),
      authorizedFetch(`${API_URL}/email-sends/timeseries${query}`, init),
    ])

    const statsJson = await statsRes.json().catch(() => null)
    if (statsJson?.success === false) {
      throw new Error(statsJson?.error ?? statsJson?.message ?? 'Error al obtener estadísticas')
    }
    if (!statsRes.ok) {
      throw new Error(statsJson?.error ?? statsJson?.message ?? 'Error al obtener estadísticas')
    }

    const stats: EmailSendsStatsRaw = statsJson?.data?.stats ?? statsJson?.data ?? statsJson
    const summary = mapStatsToSummary(stats, range.from_date, range.to_date)

    let series: AnalyticsSeries[]
    const timeseriesJson = await timeseriesRes.json().catch(() => null)
    const by_date = timeseriesJson?.data?.by_date
    if (Array.isArray(by_date) && by_date.length > 0) {
      series = mapByDateToSeries(by_date)
    } else {
      series = summaryToSeries(summary)
    }

    return {
      summary,
      series,
      campaigns: [],
    }
  },
}
