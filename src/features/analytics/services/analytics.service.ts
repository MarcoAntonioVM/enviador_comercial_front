import type {
  AnalyticsApiResponse,
  AnalyticsSeries,
  AnalyticsSummary,
} from '../types/analytics.types'

// Mocks
import { analyticsSummaryMock, analyticsSeriesMock, campaignsMock, analyticsFullMock } from '../../../data/analytics'

const API_URL = import.meta.env.VITE_API_URL

type Range = { startDate: string; endDate: string }

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const message = (json && (json.message || json.error)) || `${res.status} ${res.statusText}`
    throw new Error(String(message))
  }
  return json as T
}

function qs(range: Range) {
  const params = new URLSearchParams()
  params.set('startDate', range.startDate)
  params.set('endDate', range.endDate)
  return `?${params.toString()}`
}

// For development we force using mocks (do not call external dummy APIs)
// Set to `false` to enable real API calls when your backend is ready.
const useMocks = true

export const analyticsService = {
  async getSummary(range: Range): Promise<AnalyticsSummary> {
    if (useMocks) return Promise.resolve(analyticsSummaryMock)
    const url = `${API_URL}/analytics/summary${qs(range)}`
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' })
    return handleResponse<AnalyticsSummary>(res)
  },

  async getTimeseries(range: Range): Promise<AnalyticsSeries[]> {
    if (useMocks) return Promise.resolve(analyticsSeriesMock as AnalyticsSeries[])
    const url = `${API_URL}/analytics/timeseries${qs(range)}`
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' })
    return handleResponse<AnalyticsSeries[]>(res)
  },

  async getCampaigns(range: Range): Promise<any[]> {
    if (useMocks) return Promise.resolve(campaignsMock)
    const url = `${API_URL}/analytics/campaigns${qs(range)}`
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' })
    return handleResponse<any[]>(res)
  },

  async getFullAnalytics(range: Range): Promise<AnalyticsApiResponse> {
    if (useMocks) return Promise.resolve(analyticsFullMock)
    const url = `${API_URL}/analytics/full${qs(range)}`
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' })
    return handleResponse<AnalyticsApiResponse>(res)
  },
}
