import type { Sector } from './sectors.types';

export const sectorsMock: Sector[] = [
  {
    id: 's-1000',
    name: 'Comercial',
    description: 'Actividades relacionadas con ventas y atención al cliente',
    createdAt: '2024-01-10T09:00:00.000Z',
  },
  {
    id: 's-1001',
    name: 'Marketing',
    description: 'Estrategias de marca y campañas publicitarias',
    createdAt: '2024-02-14T11:30:00.000Z',
  },
  {
    id: 's-1002',
    name: 'Operaciones',
    description: 'Gestión de procesos internos y logística',
    createdAt: '2024-03-03T08:15:00.000Z',
  },
  {
    id: 's-1003',
    name: 'Recursos Humanos',
    description: 'Selección, contratación y bienestar del personal',
    createdAt: '2024-04-20T10:45:00.000Z',
  },
  {
    id: 's-1004',
    name: 'Finanzas',
    description: 'Contabilidad, tesorería y control financiero',
    createdAt: '2024-05-01T13:20:00.000Z',
  },
];
