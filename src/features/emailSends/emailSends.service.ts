import type { EmailSend, EmailSendsStats, EmailSendsListResponse } from './emailSends.types';

const API_URL = import.meta.env.VITE_API_URL;

export const emailSendsService = {
  list: async (params?: { page?: number; limit?: number; campaignId?: string }): Promise<EmailSendsListResponse> => {
    const token = localStorage.getItem('token');
    const sp = new URLSearchParams();

    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.campaignId) sp.set('campaignId', String(params.campaignId));
    const url = `${API_URL}/email-sends${sp.toString() ? `?${sp.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    let raw: any;
    try {
      raw = await response.json();
    } catch (err) {
      throw new Error('Respuesta inválida del servidor');
    }

    if (raw?.success === false) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al obtener envíos de email');
    }

    if (!response.ok) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al obtener envíos de email');
    }

    // La API devuelve { success, data: [...], pagination }
    const data = raw?.data;

    if (!Array.isArray(data)) {
      throw new Error('Respuesta inválida del servidor');
    }

    const emailSends: EmailSend[] = data.map((u: any) => ({
      id: String(u.id),
      templateName: u.template_name,
      recipientEmail: u.prospect_email ?? '',
      recipientName: u.prospect_name,
      subject: u.template_subject ?? '',
      status: (u.status ?? 'pending') as any,
      sentAt: u.sent_at,
      deliveredAt: u.delivered_at,
      openedAt: u.opened_at,
      clickedAt: u.clicked_at,
      errorMessage: u.error_message,
      createdAt: u.sent_at ?? new Date().toISOString(),
    }));

    const pagination = raw?.pagination ?? {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      total: emailSends.length,
      totalPages: 1,
    };

    return { emailSends, pagination };
  },

  getStats: async (): Promise<EmailSendsStats> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/email-sends/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al obtener estadísticas');
    }
    if (!response.ok) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al obtener estadísticas');
    }

    const s = raw?.data?.stats ?? raw?.data ?? raw;

    return {
      total: s.total ?? 0,
      sent: s.sent ?? 0,
      delivered: s.delivered ?? 0,
      opened: s.opened ?? 0,
      clicked: s.clicked ?? 0,
      bounced: s.bounced ?? 0,
      failed: s.failed ?? 0,
      pending: s.pending ?? 0,
    };
  },

  get: async (id: string): Promise<EmailSend | undefined> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/email-sends/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? 'Envío no encontrado';
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? 'Envío no encontrado';
      throw new Error(msg);
    }

    const u = raw?.data?.emailSend ?? raw?.data ?? raw;
    if (!u) return undefined;

    return {
      id: String(u.id),
      campaignId: u.campaign_id ?? u.campaignId ?? u.campaign?.id,
      campaignName: u.campaign_name ?? u.campaign?.name,
      templateId: u.template_id ?? u.templateId,
      templateName: u.template_name ?? u.template?.name,
      recipientEmail: u.recipient_email ?? u.recipientEmail ?? u.email ?? '',
      recipientName: u.recipient_name ?? u.recipientName,
      subject: u.subject ?? '',
      status: (u.status ?? 'pending') as any,
      sentAt: u.sent_at ?? u.sentAt,
      deliveredAt: u.delivered_at ?? u.deliveredAt,
      openedAt: u.opened_at ?? u.openedAt,
      clickedAt: u.clicked_at ?? u.clickedAt,
      errorMessage: u.error_message ?? u.errorMessage,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    } as EmailSend;
  },
};
