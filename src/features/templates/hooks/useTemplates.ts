import { useEffect, useState } from 'react'
import { Template } from '../templates.types'
import { templatesService } from '../templates.service'

export default function useTemplates() {
  const [items, setItems] = useState<Template[]>([])

  useEffect(() => {
    templatesService.list().then(setItems)
  }, [])

  return { items, refresh: () => templatesService.list().then(setItems) }
}
