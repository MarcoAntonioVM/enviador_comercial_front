import type { Sector, SectorsListResponse, SectorsPagination } from './sectors.types';

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

  async getById(id: string): Promise<Sector> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sectors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Sector no encontrado";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Sector no encontrado";
      throw new Error(msg);
    }

    // La API devuelve { success, message, data: { sector: {...} } }
    const u = raw?.data?.sector ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      description: u.description ?? '',
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    };
  },

  create: async (data: Partial<Sector>): Promise<Sector> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sectors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear sector";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear sector";
      throw new Error(msg);
    }

    const u = raw?.data?.sector ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      description: u.description ?? '',
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    } as Sector;
  },

  update: async (id: string, data: Partial<Sector>): Promise<Sector> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sectors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar sector";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar sector";
      throw new Error(msg);
    }

    const u = raw?.data?.sector ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      description: u.description ?? '',
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    } as Sector;
  },

  async delete(id: string): Promise<Sector> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/sectors/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar sector";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar sector";
      throw new Error(msg);
    }

    const u = raw?.data?.sector ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      description: u.description ?? '',
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    } as Sector;
  },
};
