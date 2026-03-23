import { ChartCard } from '@/components/charts/ChartCard'
import { BaseChart } from '@/components/charts/BaseChart'
import { toCampaignsBar } from '../analytics.mappers'
import type { CampaignsBarProps } from '../analytics.types'

export function CampaignsBar({ campaigns, loading }: CampaignsBarProps) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <ChartCard
        title="Campañas"
        subtitle="Comparativo de rendimiento por campaña"
        loading={loading}
        empty={!loading}
      >
        {null}
      </ChartCard>
    )
  }

  const chartData = toCampaignsBar(campaigns)

  return (
    <ChartCard
      title="Campañas"
      subtitle="Comparativo de rendimiento por campaña"
      loading={loading}
    >
      <BaseChart
        type="bar"
        data={chartData}
        height="300px"
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          }
        }}
      />
    </ChartCard>
  )
}
