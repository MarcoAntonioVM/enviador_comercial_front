import { useState } from 'react'
import type { User } from '../users.types'
import { usersService } from '../users.service'

export default function useCreateUser() {
  const [loading, setLoading] = useState(false)

  const create = async (data: Omit<User, 'id' | 'createdAt'>) => {
    setLoading(true)
    try {
      const res = await usersService.create(data)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { create, loading }
}
