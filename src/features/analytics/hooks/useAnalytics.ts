import { useEffect, useState } from 'react'
import type {
  AnalyticsCampaignBarItem,
  AnalyticsDateRange,
  AnalyticsSeries,
  AnalyticsSummary,
} from '../analytics.types'
import { analyticsService } from '../analytics.service'

export default function useAnalytics() {
  const [dateRange, setDateRange] = useState<AnalyticsDateRange | null>(null)
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [series, setSeries] = useState<AnalyticsSeries[] | null>(null)
  const [campaigns, setCampaigns] = useState<AnalyticsCampaignBarItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 6)
    setDateRange({
      startDate,
      endDate: today,
      label: 'Últimos 7 días',
    })
  }, [])

  useEffect(() => {
    if (!dateRange) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const from_date = dateRange.startDate.toISOString().split('T')[0]
        const to_date = dateRange.endDate.toISOString().split('T')[0]

        const data = await analyticsService.getStats({ from_date, to_date })

        setSummary(data.summary)
        setSeries(data.series)
        setCampaigns(data.campaigns ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [dateRange])

  return {
    dateRange,
    setDateRange,
    summary,
    series,
    campaigns,
    loading,
    error,
  }
}
