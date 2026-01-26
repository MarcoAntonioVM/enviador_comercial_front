import { useState } from 'react'
import { sendersService } from '../senders.service'

export default function useDeleteSender() {
  const [loading, setLoading] = useState(false)

  const remove = async (id: string) => {
    setLoading(true)
    try {
      const res = await sendersService.delete(id)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading }
}
