import { useEffect, useState } from 'react'
import { Template } from '../templates.types'
import { templatesService } from '../templates.service'

export default function useTemplate(id?: string) {
  const [item, setItem] = useState<Template | null>(null)

  useEffect(() => {
    if (!id) return
    templatesService.get(id).then((res) => setItem(res || null))
  }, [id])

  return { item, refresh: () => (id ? templatesService.get(id).then((r) => setItem(r || null)) : Promise.resolve(null)) }
}
