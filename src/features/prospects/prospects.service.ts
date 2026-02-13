import type { Prospect, prospectsListResponse, prospectsPagination, ProspectPayload } from "./prospects.types";

const API_URL = import.meta.env.VITE_API_URL;

type ListParams = {
  page?: number;
  limit?: number;
  status?: string;
  sector_name?: string;
  consent_status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};


export const prospectsService = {
 async list(params?: ListParams): Promise<prospectsListResponse> {
     const token = localStorage.getItem("token");
     const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", String(params.status));
    if (params?.sector_name) searchParams.set("sector_name", String(params.sector_name));
    if (params?.consent_status) searchParams.set("consent_status", String(params.consent_status));
    if (params?.search) searchParams.set("search", String(params.search));
    if (params?.sortBy) searchParams.set("sortBy", String(params.sortBy));
    if (params?.sortOrder) searchParams.set("sortOrder", String(params.sortOrder));
 
    const queryString = searchParams.toString();
    const url = `${API_URL}/prospects${queryString ? `?${queryString}` : ''}`;
 
     const response = await fetch(url, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
         ...(token && { Authorization: `Bearer ${token}` }),
       },
     });
 
     const raw = await response.json();
 
     if (raw?.success === false) {
       const msg = raw?.error ?? raw?.message ?? "Error al obtener prospectos";
       throw new Error(msg);
     }
 
     if (!response.ok) {
       const msg = raw?.error ?? raw?.message ?? "Error al obtener prospectos";
       throw new Error(msg);
     }
 
     // La API devuelve { data: { prospects: [...] } }
     const data = raw?.data?.prospects ?? raw?.data ?? raw;
 
     if (!Array.isArray(data)) {
       throw new Error("Respuesta inválida del servidor");
     }
 
    const prospects: Prospect[] = data.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      emails: u.emails ?? (u.email ? [u.email] : []),
      company: u.company,
      sector_name: u.sector_name ?? u.sector?.name ?? undefined,
      status: u.status,
      metadata: Array.isArray(u.metadata) ? u.metadata : (u.metadata ? [u.metadata] : []),
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    }));
 
     const pagination: prospectsPagination = raw?.pagination ?? {
       page: 1,
       limit: 10,
       total: prospects.length,
       totalPages: 1,
     };
 
     return { prospects, pagination };
   },

  async getById(id: string): Promise<Prospect> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/prospects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Prospecto no encontrado";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Prospecto no encontrado";
      throw new Error(msg);
    }

    const u = raw?.data?.prospect ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      emails: u.emails ?? (u.email ? [u.email] : []),
      company: u.company,
      sector_name: u.sector_name ?? u.sector?.name ?? undefined,
      status: (u.status as any) ?? "unknown",
      phone: u.phone ?? null,
      metadata: Array.isArray(u.metadata) ? u.metadata : (u.metadata ? [u.metadata] : []),
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as Prospect;
  },

  async create(payload: ProspectPayload): Promise<Prospect> {
    const token = localStorage.getItem("token");
    const email = (payload as any).email ?? ((payload as any).emails?.[0]);
    const requestBody: Record<string, unknown> = {
      company: payload.company,
      sector_name: (payload as any).sector_name ?? "",
      name: payload.name,
      email: email ?? "",
    };
    Object.keys(requestBody).forEach((k) => {
      if (requestBody[k] === undefined) delete requestBody[k];
    });

    const response = await fetch(`${API_URL}/prospects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(requestBody),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear prospecto";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear prospecto";
      throw new Error(msg);
    }

    const u = raw?.data?.prospect ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      emails: u.emails ?? (u.email ? [u.email] : []),
      company: u.company,
      sector_name: u.sector_name ?? u.sector?.name ?? undefined,
      status: (u.status as any) ?? "unknown",
      phone: u.phone ?? null,
      metadata: Array.isArray(u.metadata) ? u.metadata : (u.metadata ? [u.metadata] : []),
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as Prospect;
  },

  async update(id: string, payload: ProspectPayload): Promise<Prospect> {
    const token = localStorage.getItem("token");
    const email = (payload as any).email ?? (payload as any).emails?.[0];
    const requestBody: Record<string, unknown> = {
      company: payload.company,
      sector_name: (payload as any).sector_name ?? "",
      name: payload.name,
      email: email ?? "",
      active: true,
    };
    Object.keys(requestBody).forEach((k) => {
      if (requestBody[k] === undefined) delete requestBody[k];
    });

    const response = await fetch(`${API_URL}/prospects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(requestBody),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar prospecto";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar prospecto";
      throw new Error(msg);
    }

    const u = raw?.data?.prospect ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      emails: u.emails ?? (u.email ? [u.email] : []),
      company: u.company,
      sector_name: u.sector_name ?? u.sector?.name ?? undefined,
      status: (u.status as any) ?? "unknown",
      phone: u.phone ?? null,
      metadata: Array.isArray(u.metadata) ? u.metadata : (u.metadata ? [u.metadata] : []),
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as Prospect;
  },

  async delete(id: string): Promise<Prospect> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/prospects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar prospecto";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar prospecto";
      throw new Error(msg);
    }

    const u = raw?.data?.prospect ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      emails: u.emails ?? [],
      company: u.company,
      sector_name: u.sector_name ?? u.sector?.name ?? undefined,
      status: (u.status as any) ?? "unknown",
      phone: u.phone ?? null,
      metadata: u.metadata ?? [],
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as Prospect;
  },
};