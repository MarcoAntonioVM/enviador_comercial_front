import { useEffect, useState } from 'react'
import type { User } from '../users.types'
import { usersService } from '../users.service'

export default function useUsers() {
  const [items, setItems] = useState<User[]>([])

  useEffect(() => {
    usersService.list().then(setItems)
  }, [])

  return { items, refresh: () => usersService.list().then(setItems) }
}
