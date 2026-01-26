import type { Sector, SectorsListResponse, SectorsPagination } from './sectors.types';
import { sectorsMock } from './sectors.mock';

const API_URL = import.meta.env.VITE_API_URL;

type ListParams = {
  page?: number;
  limit?: number;
};

export const sectorsService = {
  async list(params?: ListParams): Promise<SectorsListResponse> {
    const token = localStorage.getItem("token");
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const queryString = searchParams.toString();
    const url = `${API_URL}/sectors${queryString ? `?${queryString}&active=true` : '?active=true'}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener sectores";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener sectores";
      throw new Error(msg);
    }

    // La API devuelve { data: { sectors: [...] } }
    const data = raw?.data?.sectors ?? raw?.data ?? raw;

    if (!Array.isArray(data)) {
      throw new Error("Respuesta inválida del servidor");
    }

    const sectors: Sector[] = data.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      description: u.description,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    }));

    const pagination: SectorsPagination = raw?.pagination ?? {
      page: 1,
      limit: 10,
      total: sectors.length,
      totalPages: 1,
    };

    return { sectors, pagination };
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
