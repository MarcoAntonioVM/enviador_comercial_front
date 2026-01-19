import { useState } from 'react'
import { Template } from '../templates.types'
import { templatesService } from '../templates.service'

export default function useUpdateTemplate() {
  const [loading, setLoading] = useState(false)

  const update = async (id: string, data: Partial<Template>) => {
    setLoading(true)
    try {
      const res = await templatesService.update(id, data)
      return res
    } finally {
      setLoading(false)
    }
  }

  return { update, loading }
}
