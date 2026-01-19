import { useState } from 'react'
import { Template } from '../templates.types'
import { templatesService } from '../templates.service'

export default function useCreateTemplate() {
  const [loading, setLoading] = useState(false)

  const create = async (data: Partial<Template>) => {
    setLoading(true)
    try {
      const res = await templatesService.create(data)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { create, loading }
}
