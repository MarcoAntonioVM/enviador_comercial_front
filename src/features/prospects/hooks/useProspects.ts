import { useEffect, useState } from 'react'
import type { Prospect } from '../prospects.types'
import { prospectsService } from '../prospects.service'

export default function useProspects() {
  const [items, setItems] = useState<Prospect[]>([])

  useEffect(() => {
    prospectsService.list().then(setItems)
  }, [])

  return { items, refresh: () => prospectsService.list().then(setItems) }
}
