import { useEffect, useState } from 'react'
import type { User, UsersPagination } from '../users.types'
import { usersService } from '../users.service'

type UseUsersParams = {
  page?: number;
  limit?: number;
};

export default function useUsers(params?: UseUsersParams) {
  const [items, setItems] = useState<User[]>([])
  const [pagination, setPagination] = useState<UsersPagination | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async (fetchParams?: UseUsersParams) => {
    setLoading(true)
    try {
      const response = await usersService.list(fetchParams ?? params)
      setItems(response.users)
      setPagination(response.pagination)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [params?.page, params?.limit])

  return { 
    items, 
    pagination,
    loading,
    refresh: () => fetchUsers(),
    goToPage: (page: number) => fetchUsers({ ...params, page }),
  }
}
