import { useState } from 'react'
import { sectorsService } from '../sectors.service'

export default function useDeleteMultipleSectors() {
  const [loading, setLoading] = useState(false)

  const removeMultiple = async (ids: string[]) => {
    setLoading(true)
    try {
      const res = await sectorsService.deleteMultiple(ids)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { removeMultiple, loading }
}
