import React, { useState, useEffect } from 'react'
import DateRangePicker from '../../../components/filters/DateRangePicker'
import { DeliveryDonut } from '../components/DeliveryDonut'
import { OpensClicksLine } from '../components/OpensClicksLine'
import { CampaignsBar } from '../components/CampaignsBar'
import { analyticsService } from '../services/analytics.service'
import type { AnalyticsSummary, AnalyticsSeries } from '../types/analytics.types'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date; label: string } | null>(null)
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [series, setSeries] = useState<AnalyticsSeries[] | null>(null)
  const [campaigns, setCampaigns] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-select "Últimos 7 días" al cargar
  useEffect(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 6)
    setDateRange({
      startDate,
      endDate: today,
      label: 'Últimos 7 días'
    })
  }, [])

  // Fetch data cuando cambia el rango
  useEffect(() => {
    if (!dateRange) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const range = {
          startDate: dateRange.startDate.toISOString().split('T')[0],
          endDate: dateRange.endDate.toISOString().split('T')[0]
        }

        // Fetch en paralelo
        const [summaryData, seriesData, campaignsData] = await Promise.allSettled([
          analyticsService.getSummary(range),
          analyticsService.getTimeseries(range),
          analyticsService.getCampaigns(range)
        ])

        setSummary(summaryData.status === 'fulfilled' ? summaryData.value : null)
        setSeries(seriesData.status === 'fulfilled' ? seriesData.value : null)
        setCampaigns(campaignsData.status === 'fulfilled' ? campaignsData.value : null)

        // Log errors pero continúa
        if (summaryData.status === 'rejected') console.warn('Summary failed:', summaryData.reason)
        if (seriesData.status === 'rejected') console.warn('Series failed:', seriesData.reason)
        if (campaignsData.status === 'rejected') console.warn('Campaigns failed:', campaignsData.reason)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Analytics error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const formatNumber = (num: number | undefined) => {
    return num?.toLocaleString('es-ES') || '0'
  }

  const calculateRate = (numerator: number | undefined, denominator: number | undefined) => {
    if (!denominator || !numerator) return '0%'
    return `${((numerator / denominator) * 100).toFixed(1)}%`
  }

  return (
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Analíticas</h1>
          <p className="text-slate-600 dark:text-gray-300">Métricas y estadísticas de tus campañas de email</p>
        </div>
        
        <DateRangePicker 
          value={dateRange}
          onChange={setDateRange}
          className="w-fit"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600 p-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-gray-300">Total Enviados</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{formatNumber(summary?.totalSent)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600 p-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-gray-300">Entrega</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{calculateRate(summary?.totalDelivered, summary?.totalSent)}</p>
          <p className="text-sm text-slate-500 dark:text-gray-400">{formatNumber(summary?.totalDelivered)} entregados</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600 p-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-gray-300">Apertura</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{calculateRate(summary?.totalOpens, summary?.totalDelivered)}</p>
          <p className="text-sm text-slate-500 dark:text-gray-400">{formatNumber(summary?.totalOpens)} aperturas</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600 p-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-gray-300">Click</h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{calculateRate(summary?.totalClicks, summary?.totalOpens)}</p>
          <p className="text-sm text-slate-500 dark:text-gray-400">{formatNumber(summary?.totalClicks)} clicks</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveryDonut summary={summary} loading={loading} />
        <OpensClicksLine series={series} loading={loading} />
      </div>

      {/* Campaigns Bar Chart */}
      <div className="grid grid-cols-1 gap-6">
        <CampaignsBar campaigns={campaigns} loading={loading} />
      </div>
    </div>
  )
}
