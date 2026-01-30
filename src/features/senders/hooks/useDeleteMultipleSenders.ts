import { useState } from 'react'
import { sendersService } from '../senders.service'

export default function useDeleteMultipleSenders() {
  const [loading, setLoading] = useState(false)

  const removeMultiple = async (ids: string[]) => {
    setLoading(true)
    try {
      const res = await sendersService.deleteMultiple(ids)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { removeMultiple, loading }
}
