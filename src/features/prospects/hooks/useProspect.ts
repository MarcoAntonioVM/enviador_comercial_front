import { useEffect, useState } from 'react'
import type { Prospect } from '../prospects.types'
import { prospectsService } from '../prospects.service'

export default function useProspect(id?: string) {
  const [item, setItem] = useState<Prospect | null>(null)

  useEffect(() => {
    if (!id) return
    prospectsService.getById(id).then((res) => setItem(res || null))
  }, [id])

  return { item, refresh: () => (id ? prospectsService.getById(id).then((r) => setItem(r || null)) : Promise.resolve(null)) }
}
