import type { Sector } from './sectors.types';
import { sectorsMock } from './sectors.mock';

export const sectorsService = {
  list: async (): Promise<Sector[]> => {
    return Promise.resolve(sectorsMock);
  },

  get: async (id: string): Promise<Sector | undefined> => {
    return sectorsMock.find((s) => s.id === id);
  },

  create: async (data: Partial<Sector>): Promise<Sector> => {
    const newSector: Sector = {
      id: `s-${Date.now()}`,
      name: data.name || 'Sin nombre',
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };
    sectorsMock.push(newSector);
    return newSector;
  },

  update: async (id: string, data: Partial<Sector>): Promise<Sector | undefined> => {
    const idx = sectorsMock.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    const updated = { ...sectorsMock[idx], ...data, updatedAt: new Date().toISOString() };
    sectorsMock[idx] = updated;
    return updated;
  },
};
