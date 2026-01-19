import { useState } from 'react'
import type { Prospect } from '../prospects.types'
import { prospectsService } from '../prospects.service'

export default function useCreateProspect() {
  const [loading, setLoading] = useState(false)

  const create = async (data: Omit<Prospect, 'id' | 'createdAt'>) => {
    setLoading(true)
    try {
      const res = await prospectsService.create(data)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { create, loading }
}
