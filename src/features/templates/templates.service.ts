import type { Template } from './templates.types'
import { templatesMock } from './templates.mock'

export const templatesService = {
  list: async (): Promise<Template[]> => {
    return Promise.resolve(templatesMock)
  },
  get: async (id: string): Promise<Template | undefined> => {
    return templatesMock.find((t) => t.id === id)
  },
  create: async (data: Partial<Template>): Promise<Template> => {
    const nt: Template = {
      id: String(Date.now()),
      name: data.name || 'Sin nombre',
      body: data.body || '',
      variables: data.variables || [],
      createdAt: new Date().toISOString(),
    }
    templatesMock.push(nt)
    return nt
  },
  update: async (id: string, data: Partial<Template>): Promise<Template | undefined> => {
    const idx = templatesMock.findIndex((t) => t.id === id)
    if (idx === -1) return undefined
    const updated = { ...templatesMock[idx], ...data, updatedAt: new Date().toISOString() }
    templatesMock[idx] = updated
    return updated
  },
}
