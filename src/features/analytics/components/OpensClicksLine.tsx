
import { ChartCard } from '../../../components/charts/ChartCard'
import { BaseChart } from '../../../components/charts/BaseChart'
import { toOpensClicksLine } from '../mappers/chartData.mappers'
import type { AnalyticsSeries } from '../types/analytics.types'

type Props = {
  series: AnalyticsSeries[] | null
  loading?: boolean
}

export function OpensClicksLine({ series, loading }: Props) {
  if (!series || series.length === 0) {
    return (
      <ChartCard
        title="Aperturas y Clicks"
        subtitle="Evolución temporal de engagement"
        loading={loading}
        empty={!loading}
      >
        {null}
      </ChartCard>
    )
  }

  const chartData = toOpensClicksLine(series)

  return (
    <ChartCard
      title="Aperturas y Clicks"
      subtitle="Evolución temporal de engagement"
      loading={loading}
    >
      <BaseChart
        type="line"
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
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }}
      />
    </ChartCard>
  )
}
