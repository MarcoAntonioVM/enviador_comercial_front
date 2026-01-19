
import { ChartCard } from '../../../components/charts/ChartCard'
import { BaseChart } from '../../../components/charts/BaseChart'
import { toDeliveryDonut } from '../mappers/chartData.mappers'
import type { AnalyticsSummary } from '../types/analytics.types'

type Props = {
  summary: AnalyticsSummary | null
  loading?: boolean
}

export function DeliveryDonut({ summary, loading }: Props) {
  if (!summary) {
    return (
      <ChartCard
        title="Entrega de emails"
        subtitle="Distribución de estados de delivery"
        loading={loading}
        empty={!loading}
      >
        {null}
      </ChartCard>
    )
  }

  const chartData = toDeliveryDonut(summary)

  return (
    <ChartCard
      title="Entrega de emails"
      subtitle="Distribución de estados de delivery"
      loading={loading}
    >
      <BaseChart
        type="doughnut"
        data={chartData}
        height="300px"
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                  const percentage = ((context.raw / total) * 100).toFixed(1)
                  return `${context.label}: ${context.raw} (${percentage}%)`
                }
              }
            }
          }
        }}
      />
    </ChartCard>
  )
}
