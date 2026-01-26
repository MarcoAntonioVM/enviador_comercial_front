import { useState } from 'react'
import { usersService } from '../users.service'

export default function useDeleteUser() {
  const [loading, setLoading] = useState(false)

  const remove = async (id: string) => {
    setLoading(true)
    try {
      const res = await usersService.delete(id)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading }
}
