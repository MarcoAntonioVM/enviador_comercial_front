import { useState } from 'react'
import type { User } from '../users.types'
import { usersService } from '../users.service'

export default function useUpdateUser() {
  const [loading, setLoading] = useState(false)

  const update = async (id: string, data: Omit<User, 'id' | 'createdAt'>) => {
    setLoading(true)
    try {
      const res = await usersService.update(id, data)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { update, loading }
}
