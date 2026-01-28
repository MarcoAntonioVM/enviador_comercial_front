import type { Prospect, prospectsListResponse, prospectsPagination, ProspectPayload } from "./prospects.types";

const API_URL = import.meta.env.VITE_API_URL;

type ListParams = {
  page?: number;
  limit?: number;
  status?: string;
  sector_id?: string | number;
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
    if (params?.sector_id) searchParams.set("sector_id", String(params.sector_id));
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
      sector_id: (u.sector_id ?? u.sector?.id) !== undefined && (u.sector_id ?? u.sector?.id) !== null ? String(u.sector_id ?? u.sector?.id) : undefined,
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
      sector_id: (u.sector_id ?? u.sector?.id) !== undefined && (u.sector_id ?? u.sector?.id) !== null ? String(u.sector_id ?? u.sector?.id) : undefined,
      status: (u.status as any) ?? 'unknown',
      phone: u.phone ?? null,
      metadata: Array.isArray(u.metadata) ? u.metadata : (u.metadata ? [u.metadata] : []),
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as Prospect;
  },

  async create(payload: ProspectPayload): Promise<Prospect> {
    const token = localStorage.getItem("token");
    // Normalizar payload para backend: asegurar que exista `email` (extraer de `emails` si alguien lo envió así)
    // Normalizar sector_id: si viene como cadena vacía no la enviamos
    const rawSector = (payload as any).sector_id;
    let normalizedSector: number | string | undefined = undefined;
    if (rawSector !== undefined && rawSector !== "") {
      const n = Number(rawSector);
      normalizedSector = Number.isNaN(n) ? rawSector : n;
    }

    const requestBody: any = {
      name: payload.name,
      email: (payload as any).email ?? ((payload as any).emails ? (Array.isArray((payload as any).emails) ? (payload as any).emails[0] : undefined) : undefined),
      company: payload.company,
      sector_id: normalizedSector,
      status: payload.status,
      phone: payload.phone ?? null,
      metadata: payload.metadata,
    };

    // Eliminar campos undefined o cadenas vacías para evitar inserciones inválidas
    Object.keys(requestBody).forEach((k) => {
      const v = requestBody[k];
      if (v === undefined || v === "") delete requestBody[k];
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
      sector_id: (u.sector_id ?? u.sector?.id) !== undefined && (u.sector_id ?? u.sector?.id) !== null ? String(u.sector_id ?? u.sector?.id) : undefined,
      status: (u.status as any) ?? 'unknown',
      phone: u.phone ?? null,
      metadata: Array.isArray(u.metadata) ? u.metadata : (u.metadata ? [u.metadata] : []),
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as Prospect;
  },

  async update(id: string, payload: ProspectPayload): Promise<Prospect> {
    const token = localStorage.getItem("token");
    const rawSectorUpdate = (payload as any).sector_id;
    let normalizedSectorUpdate: number | string | undefined = undefined;
    if (rawSectorUpdate !== undefined && rawSectorUpdate !== "") {
      const n = Number(rawSectorUpdate);
      normalizedSectorUpdate = Number.isNaN(n) ? rawSectorUpdate : n;
    }

    const requestBody: any = {
      name: payload.name,
      email: (payload as any).email ?? ((payload as any).emails ? (Array.isArray((payload as any).emails) ? (payload as any).emails[0] : undefined) : undefined),
      company: payload.company,
      sector_id: normalizedSectorUpdate,
      status: payload.status,
      phone: payload.phone ?? null,
      metadata: payload.metadata,
    };

    Object.keys(requestBody).forEach((k) => {
      const v = requestBody[k];
      if (v === undefined || v === "") delete requestBody[k];
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
      sector_id: u.sector_id ?? u.sector?.id,
      status: (u.status as any) ?? 'unknown',
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
      sector_id: (u.sector_id ?? u.sector?.id) !== undefined && (u.sector_id ?? u.sector?.id) !== null ? String(u.sector_id ?? u.sector?.id) : undefined,
      status: (u.status as any) ?? 'unknown',
      phone: u.phone ?? null,
      metadata: u.metadata ?? [],
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as Prospect;
  },
};