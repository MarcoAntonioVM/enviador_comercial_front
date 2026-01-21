import type { Sender } from './senders.types';

export const sendersMock: Sender[] = [
  {
    id: 'snd-001',
    name: 'Soporte Efinfo',
    email: 'soporte@efinfo.com',
    reply_to: 'contacto@efinfo.com',
    signature: 'Equipo de Soporte - Efinfo',
    daily_limit: 500,
    createdAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'snd-002',
    name: 'Marketing',
    email: 'marketing@efinfo.com',
    reply_to: 'marketing@efinfo.com',
    signature: 'Departamento de Marketing',
    daily_limit: 1000,
    createdAt: '2024-02-20T14:00:00.000Z',
  },
  {
    id: 'snd-003',
    name: 'Ventas',
    email: 'ventas@efinfo.com',
    daily_limit: 300,
    createdAt: '2024-03-10T09:15:00.000Z',
  },
  {
    id: 'snd-004',
    name: 'Notificaciones',
    email: 'noreply@efinfo.com',
    createdAt: '2024-01-05T08:00:00.000Z',
  },
];
