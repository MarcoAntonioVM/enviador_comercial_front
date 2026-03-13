import type { Preconfiguration, PreconfigurationPagination, PreconfigurationsListResponse } from './preconfiguration.types';
const API_URL = import.meta.env.VITE_API_URL;


function toCapitalizedDay(d: string): string {
  return d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
}

function normalizePreconfiguration(u: any) {
  const senderName = u.sender_name ?? u.sender?.name ?? u.sender?.title ?? (typeof u.sender === 'string' ? u.sender : undefined);
  const templateName = u.template_name ?? u.template?.name ?? u.template?.title ?? (typeof u.template === 'string' ? u.template : undefined);
  const prospectName = u.prospect_name ?? u.prospect?.name ?? u.prospect?.title ?? (typeof u.prospect === 'string' ? u.prospect : undefined);
  const days_week = (u.days_week ?? u.days ?? []).map((d: string) => toCapitalizedDay(String(d)));

  const recipient_email =
    u.recipient_email
    ?? u.recipient?.email
    ?? u.recipient?.reply_to
    ?? u.prospect?.email
    ?? u.prospect?.emails?.[0]
    ?? undefined;


  const dayMapEs: Record<string, string> = {
    Monday: 'Lun',
    Tuesday: 'Mar',
    Wednesday: 'Mié',
    Thursday: 'Jue',
    Friday: 'Vie',
    Saturday: 'Sáb',
    Sunday: 'Dom',
  };

  const days_week_es = days_week.map((d: string) => dayMapEs[d] ?? d);
  const days_week_display = days_week_es.join(', ');
  const hour_display = u.hour ?? u.time ?? '-';
  const sender_email = u.sender_email ?? u.sender?.email ?? u.sender?.reply_to ?? undefined;

  return {
    id: String(u.id),
    sender_id: u.sender_id ?? u.sender?.id ?? u.sender_id,
    sender_name: senderName,
    sender_email,
    template_id: u.template_id ?? u.template?.id ?? u.template_id,
    template_name: templateName,
    prospect_id: u.prospect_id ?? u.prospect?.id ?? u.prospect_id,
    prospect_name: prospectName,
    days_week,
    days_week_es,
    days_week_display,
    hour: u.hour,
    hour_display,
    createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    recipient_email
  };
}

type ListParams = {
  page?: number;
  limit?: number;
};

export const preconfigurationsService = {
  async list(params?: ListParams): Promise<PreconfigurationsListResponse> {
    const token = localStorage.getItem("token");
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const queryString = searchParams.toString();
    const url = `${API_URL}/preconfigurations${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener precongiguración";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener Preconfiguración";
      throw new Error(msg);
    }

    // La API devuelve { data: { senders: [...] } }
    const data = raw?.data?.preconfigurations ?? raw?.data ?? raw;

    if (!Array.isArray(data)) {
      throw new Error("Respuesta inválida del servidor");
    }

    const preconfigurations: Preconfiguration[] = data.map((u: any) => normalizePreconfiguration(u));

    const pagination: PreconfigurationPagination = raw?.pagination ?? {
      page: 1,
      limit: 10,
      total: preconfigurations.length,
      totalPages: 1,
    };

    return { preconfigurations, pagination };
  },

  async getById(id: string): Promise<Preconfiguration> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/preconfigurations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const raw = await response.json();
    if (!response.ok) throw new Error('Preconfiguración no encontrada');
    const preconfiguration = raw.data?.preconfiguration ?? raw.data ?? raw;
    return normalizePreconfiguration(preconfiguration);
  },

  async create(data: Partial<Preconfiguration>): Promise<Preconfiguration> {
    const daysWeek = (data.days_week ?? []).map((d) => String(d).toLowerCase());
    const newItem = {
      sender_id: data.sender_id ?? null,
      template_id: data.template_id ?? null,
      prospect_id: data.prospect_id ?? null,
      days_week: daysWeek,
      hour: data.hour,
      createdAt: new Date().toISOString(),
    };
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/preconfigurations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(newItem),
    });
    const raw = await response.json();
    if (!response.ok) throw new Error('Error al crear Preconfiguración');
    return normalizePreconfiguration(raw.data.preconfiguration ?? raw.data ?? raw);
  },

  async update(id: string, data: Partial<Preconfiguration>): Promise<Preconfiguration> {
    const daysWeek = (data.days_week ?? []).map((d) => String(d).toLowerCase());
    const payload = {
      ...data,
      prospect_id: data.prospect_id ?? null,
      days_week: daysWeek,
    };
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/preconfigurations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });
    const raw = await response.json();
    if (!response.ok) throw new Error('Error al actualizar Preconfiguración');
    return normalizePreconfiguration(raw.data.preconfiguration ?? raw.data ?? raw);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/preconfigurations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const raw = await response.json();
    if (!response.ok) throw new Error(raw?.error ?? raw?.message ?? 'Error al eliminar Preconfiguración');
    return { success: true } as { success: boolean };
  },


  //Envio de mail ahora
  async sendNow(id: number): Promise<{ success: boolean }> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/email/send-by-preconfiguration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ preconfiguration_id: id }),
    });
    const raw = await response.json();
    if (!response.ok) throw new Error(raw?.error ?? raw?.message ?? 'Error al enviar mail ahora');
    return { success: true } as { success: boolean };
  }
};
