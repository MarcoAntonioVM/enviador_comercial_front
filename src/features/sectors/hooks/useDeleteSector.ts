import { useState } from 'react'
import { sectorsService } from '../sectors.service'

export default function useDeleteSector() {
  const [loading, setLoading] = useState(false)

  const remove = async (id: string) => {
    setLoading(true)
    try {
      const res = await sectorsService.delete(id)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading }
}
