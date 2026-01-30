import type { Sender, SenderPagination, SendersListResponse } from './senders.types';

const API_URL = import.meta.env.VITE_API_URL;

type ListParams = {
  page?: number;
  limit?: number;
};

export const sendersService = {
  // Obtener todos los remitentes
  async list(params?: ListParams): Promise<SendersListResponse> {
    const token = localStorage.getItem("token");
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const queryString = searchParams.toString();
    const url = `${API_URL}/senders${queryString ? `?${queryString}&active=true` : '?active=true'}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener remitentes";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener remitentes";
      throw new Error(msg);
    }

    // La API devuelve { data: { senders: [...] } }
    const data = raw?.data?.senders ?? raw?.data ?? raw;

    if (!Array.isArray(data)) {
      throw new Error("Respuesta inválida del servidor");
    }

    const senders: Sender[] = data.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
      reply_to: u.reply_to,
      signature: u.signature,
      daily_limit: u.daily_limit,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    }));

    const pagination: SenderPagination = raw?.pagination ?? {
      page: 1,
      limit: 10,
      total: senders.length,
      totalPages: 1,
    };

    return { senders, pagination };
  },

  async getById(id: string): Promise<Sender> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/senders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Remitente no encontrado";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Remitente no encontrado";
      throw new Error(msg);
    }

    const u = raw?.data?.sender ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      reply_to: u.reply_to ?? u.replyTo ?? undefined,
      signature: u.signature ?? undefined,
      daily_limit: typeof u.daily_limit !== 'undefined' ? u.daily_limit : u.dailyLimit,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    } as Sender;
  },

  // Crear un nuevo remitente
  create: async (data: Partial<Sender>): Promise<Sender> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/senders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear remitente";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear remitente";
      throw new Error(msg);
    }

    const u = raw?.data?.sender ?? raw?.data ?? raw;
    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      reply_to: u.reply_to ?? u.replyTo ?? undefined,
      signature: u.signature ?? undefined,
      daily_limit: typeof u.daily_limit !== 'undefined' ? u.daily_limit : u.dailyLimit,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    } as Sender;
  },
  // Actualizar un remitente existente
  update: async (id: string, data: Partial<Sender>): Promise<Sender> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/senders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar remitente";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar remitente";
      throw new Error(msg);
    }

    const u = raw?.data?.sender ?? raw?.data ?? raw;
    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      reply_to: u.reply_to ?? u.replyTo ?? undefined,
      signature: u.signature ?? undefined,
      daily_limit: typeof u.daily_limit !== 'undefined' ? u.daily_limit : u.dailyLimit,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    } as Sender;
  },

  async delete(id: string): Promise<Sender> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/senders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar remitente";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar remitente";
      throw new Error(msg);
    }

    const u = raw?.data?.sender ?? raw?.data ?? raw;
    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      reply_to: u.reply_to ?? u.replyTo ?? undefined,
      signature: u.signature ?? undefined,
      daily_limit: typeof u.daily_limit !== 'undefined' ? u.daily_limit : u.dailyLimit,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    } as Sender;
  },

  // Crear múltiples remitentes (envía los objetos con la misma forma que `create`)
  createMultiple: async (senders: Partial<Sender>[]): Promise<Sender[]> => {
    const token = localStorage.getItem("token");

    const payloadSenders = senders.map((s) => ({
      name: s.name,
      email: s.email,
      daily_limit: typeof (s as any).daily_limit !== 'undefined' ? (s as any).daily_limit : (s as any).dailyLimit ?? 100,
    }));

    const response = await fetch(`${API_URL}/senders/multiple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ senders: payloadSenders }),
    });

    const raw = await response.json();

    // No lanzar excepción aquí: la API puede devolver created/errors/summary.
    if (!response.ok && raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear remitentes";
      throw new Error(msg);
    }

    const createdRaw = raw?.data?.created ?? raw?.data?.senders ?? raw?.data ?? [];
    const createdArray = Array.isArray(createdRaw) ? createdRaw : [];
    const errors = raw?.data?.errors ?? [];
    const summary = raw?.data?.summary ?? null;

    const created = createdArray.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
      reply_to: u.reply_to ?? u.replyTo ?? undefined,
      signature: u.signature ?? undefined,
      daily_limit: typeof u.daily_limit !== 'undefined' ? u.daily_limit : u.dailyLimit,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updated_at ?? u.updatedAt,
    })) as Sender[];

    return {
      success: Boolean(raw?.success),
      message: raw?.message ?? '',
      created,
      errors,
      summary,
    } as any;
  },

  // Eliminar múltiples remitentes
  deleteMultiple: async (ids: string[]): Promise<any> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/senders/multiple`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ ids }),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar remitentes";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al eliminar remitentes";
      throw new Error(msg);
    }

    return {
      success: Boolean(raw?.success),
      message: raw?.message ?? `Se eliminaron ${ids.length} remitente(s) correctamente`,
      deleted: raw?.data?.deleted ?? ids.length,
      errors: raw?.data?.errors ?? [],
    };
  },
};
