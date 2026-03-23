import { useEffect, useState } from 'react'

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

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function DateRangePicker({ value = null, onChange, className = '' }: Props) {
  const [selected, setSelected] = useState<DateRange | null>(value)
  const [customOpen, setCustomOpen] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  useEffect(() => setSelected(value ?? null), [value])

  useEffect(() => {
    if (selected && onChange) onChange(selected)
  }, [selected, onChange])

  const applyPreset = (key: 'today' | 'last7' | 'last30' | 'thisMonth' | 'custom') => {
    const today = startOfToday()
    let start: Date
    let end: Date = endOfToday()

    if (key === 'today') {
      setCustomOpen(false)
      setSelected({ startDate: today, endDate: end, label: 'Hoy' })
      return
    }

    if (key === 'last7') {
      setCustomOpen(false)
      start = new Date(today)
      start.setDate(today.getDate() - 6)
      setSelected({ startDate: start, endDate: end, label: 'Últimos 7 días' })
      return
    }

    if (key === 'last30') {
      setCustomOpen(false)
      start = new Date(today)
      start.setDate(today.getDate() - 29)
      setSelected({ startDate: start, endDate: end, label: 'Últimos 30 días' })
      return
    }

    if (key === 'thisMonth') {
      setCustomOpen(false)
      const now = new Date()
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = endOfToday()
      setSelected({ startDate: start, endDate: end, label: 'Este mes' })
      return
    }

    if (key === 'custom') {
      setCustomOpen(true)
      const defaultEnd = endOfToday()
      const defaultStart = new Date(defaultEnd)
      defaultStart.setDate(defaultEnd.getDate() - 6)
      setCustomStart(toYYYYMMDD(defaultStart))
      setCustomEnd(toYYYYMMDD(defaultEnd))
    }
  }

  const applyCustomRange = () => {
    if (!customStart || !customEnd) return
    const start = new Date(customStart + 'T00:00:00')
    const end = new Date(customEnd + 'T23:59:59.999')
    if (end < start) {
      setSelected({ startDate: end, endDate: start, label: 'Personalizado' })
      setCustomStart(toYYYYMMDD(end))
      setCustomEnd(toYYYYMMDD(start))
    } else {
      setSelected({ startDate: start, endDate: end, label: 'Personalizado' })
    }
    setCustomOpen(false)
  }

  const cancelCustom = () => {
    setCustomOpen(false)
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          className={`px-3 py-1 rounded-md text-sm bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700`}
          onClick={() => applyPreset('today')}
        >
          Hoy
        </button>
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
          className={`px-3 py-1 rounded-md text-sm border border-slate-200 dark:border-gray-600 ${
            customOpen
              ? 'bg-slate-200 dark:bg-gray-600 text-slate-900 dark:text-gray-100'
              : 'bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 hover:bg-slate-50 dark:hover:bg-gray-700'
          }`}
          title="Elegir fechas de inicio y fin"
          onClick={() => applyPreset('custom')}
        >
          Rango personalizado
        </button>
      </div>

      {customOpen && (
        <div className="mt-3 p-3 rounded-lg border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800/50 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">Desde</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2 py-1.5 rounded border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">Hasta</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2 py-1.5 rounded border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-sm bg-slate-700 dark:bg-gray-600 text-white hover:bg-slate-600 dark:hover:bg-gray-500"
              onClick={applyCustomRange}
            >
              Aplicar
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md text-sm bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-600"
              onClick={cancelCustom}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 text-sm text-slate-700 dark:text-gray-300">
        {selected ? (
          <span>
            <strong className="text-slate-900 dark:text-gray-100">{selected.label}:</strong>{' '}
            {formatDate(selected.startDate)} — {formatDate(selected.endDate)}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-gray-400">No seleccionado</span>
        )}
      </div>
    </div>
  )
}
