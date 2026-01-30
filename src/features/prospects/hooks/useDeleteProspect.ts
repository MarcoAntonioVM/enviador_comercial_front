import { useState } from 'react'
import { prospectsService } from '../prospects.service'

export default function useDeleteProspect() {
  const [loading, setLoading] = useState(false)

  const remove = async (id: string) => {
    setLoading(true)
    try {
      const res = await prospectsService.delete(id)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading }
}
