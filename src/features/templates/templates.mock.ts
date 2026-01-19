import { Template } from './templates.types'

export const templatesMock: Template[] = [
  {
    id: '1',
    name: 'Bienvenida',
    subject: 'Bienvenido',
    body: 'Hola {{firstName}},\n\nBienvenido a nuestra plataforma.',
    variables: ['firstName'],
    createdAt: new Date().toISOString(),
  },
]
