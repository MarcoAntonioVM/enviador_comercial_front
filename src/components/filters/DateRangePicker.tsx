import  { useEffect, useState } from 'react'

type DateRange = {
  startDate: Date
  endDate: Date
  label: string
}

type Props = {
  value?: DateRange | null
  onChange?: (range: DateRange) => void
  className?: string
}

const startOfToday = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const endOfToday = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

function formatDate(d: Date) {
  return d.toLocaleDateString('es-ES')
}

export default function DateRangePicker({ value = null, onChange, className = '' }: Props) {
  const [selected, setSelected] = useState<DateRange | null>(value)

  useEffect(() => setSelected(value ?? null), [value])

  useEffect(() => {
    if (selected && onChange) onChange(selected)
  }, [selected, onChange])

  const applyPreset = (key: 'last7' | 'last30' | 'thisMonth' | 'custom') => {
    const today = startOfToday()
    let start: Date
    let end: Date = endOfToday()

    if (key === 'last7') {
      start = new Date(today)
      start.setDate(today.getDate() - 6)
      setSelected({ startDate: start, endDate: end, label: 'Últimos 7 días' })
      return
    }

    if (key === 'last30') {
      start = new Date(today)
      start.setDate(today.getDate() - 29)
      setSelected({ startDate: start, endDate: end, label: 'Últimos 30 días' })
      return
    }

    if (key === 'thisMonth') {
      const now = new Date()
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = endOfToday()
      setSelected({ startDate: start, endDate: end, label: 'Este mes' })
      return
    }

    // custom — reserved for future
    setSelected(null)
  }

  return (
    <div className={className}>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700`}
          onClick={() => applyPreset('last7')}
        >
          Últimos 7 días
        </button>

        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700`}
          onClick={() => applyPreset('last30')}
        >
          Últimos 30 días
        </button>

        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700`}
          onClick={() => applyPreset('thisMonth')}
        >
          Este mes
        </button>

        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-500 border border-slate-200 dark:border-gray-600 cursor-not-allowed`}
          title="Rango personalizado: próximamente"
          onClick={() => applyPreset('custom')}
          disabled
        >
          Rango personalizado
        </button>
      </div>

      <div className="mt-2 text-sm text-slate-700 dark:text-gray-300">
        {selected ? (
          <span>
            <strong className="text-slate-900 dark:text-gray-100">{selected.label}:</strong> {formatDate(selected.startDate)} — {formatDate(selected.endDate)}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-gray-400">No seleccionado</span>
        )}
      </div>
    </div>
  )
}
