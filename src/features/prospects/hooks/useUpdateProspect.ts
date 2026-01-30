import { useState } from 'react'
import type { Prospect, ProspectPayload } from '../prospects.types'
import { prospectsService } from '../prospects.service'

export default function useUpdateProspect() {
  const [loading, setLoading] = useState(false)

  const update = async (id: string, data: ProspectPayload) => {
    setLoading(true)
    try {
      const res = await prospectsService.update(id, data)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { update, loading }
}
