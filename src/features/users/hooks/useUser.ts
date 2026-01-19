import { useEffect, useState } from 'react'
import type { User } from '../users.types'
import { usersService } from '../users.service'

export default function useUser(id?: string) {
  const [item, setItem] = useState<User | null>(null)

  useEffect(() => {
    if (!id) return
    usersService.getById(id).then((res) => setItem(res || null))
  }, [id])

  return { item, refresh: () => (id ? usersService.getById(id).then((r) => setItem(r || null)) : Promise.resolve(null)) }
}
