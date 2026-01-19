import type { AnalyticsSummary, AnalyticsSeries } from '../types/analytics.types'

export interface ChartData {
  labels: string[]
  datasets: {
    label?: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }[]
}

/**
 * Convierte summary a datos para gráfica de dona (delivery stats)
 */
export function toDeliveryDonut(summary: AnalyticsSummary): ChartData {
  const delivered = summary.totalDelivered || 0
  const bounced = summary.totalBounces || 0
  const spam = summary.totalSpamReports || 0
  const pending = Math.max(0, (summary.totalSent || 0) - delivered - bounced - spam)

  return {
    labels: ['Entregados', 'Rebotes', 'Spam', 'Pendientes'],
    datasets: [{
      data: [delivered, bounced, spam, pending],
      backgroundColor: ['#10B981', '#EF4444', '#F59E0B', '#6B7280'],
      borderWidth: 0
    }]
  }
}

/**
 * Convierte series de opens/clicks a líneas (timeseries)
 */
export function toOpensClicksLine(series: AnalyticsSeries[]): ChartData {
  const opensSeries = series.find(s => s.event === 'open')
  const clicksSeries = series.find(s => s.event === 'click')

  // Obtener todas las fechas únicas y ordenarlas
  const allDates = new Set<string>()
  opensSeries?.points.forEach(p => allDates.add(p.date))
  clicksSeries?.points.forEach(p => allDates.add(p.date))
  
  const sortedDates = Array.from(allDates).sort()

  // Crear mapas para acceso rápido
  const opensMap = new Map((opensSeries?.points || []).map(p => [p.date, p.value]))
  const clicksMap = new Map((clicksSeries?.points || []).map(p => [p.date, p.value]))

  // Generar datos alineados por fecha
  const opensData = sortedDates.map(date => opensMap.get(date) || 0)
  const clicksData = sortedDates.map(date => clicksMap.get(date) || 0)

  // Formatear fechas para display (dd/mm)
  const labels = sortedDates.map(date => {
    const d = new Date(date)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
  })

  return {
    labels,
    datasets: [
      {
        label: 'Aperturas',
        data: opensData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Clicks',
        data: clicksData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  }
}

/**
 * Convierte lista de campañas a gráfica de barras
 */
export function toCampaignsBar(campaigns: any[]): ChartData {
  if (!campaigns || campaigns.length === 0) {
    return { labels: [], datasets: [] }
  }

  const labels = campaigns.map(c => c.name || c.subject || `Campaña ${c.id}`)
  const sentData = campaigns.map(c => c.totalSent || 0)
  const opensData = campaigns.map(c => c.totalOpens || 0)

  return {
    labels,
    datasets: [
      {
        label: 'Enviados',
        data: sentData,
        backgroundColor: '#6B7280',
        borderWidth: 0
      },
      {
        label: 'Aperturas',
        data: opensData,
        backgroundColor: '#3B82F6',
        borderWidth: 0
      }
    ]
  }
}