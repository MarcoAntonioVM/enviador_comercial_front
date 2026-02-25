import type { Template, TemplatesListResponse, TemplatesPagination } from './templates.types';

const API_URL = import.meta.env.VITE_API_URL;

type ListParams = {
  page?: number;
  limit?: number;
};

/** Normaliza un objeto raw de la API a nuestro tipo Template */
function mapTemplate(u: any): Template {
  return {
    id: String(u.id),
    name: u.name,
    subject: u.subject ?? '',
    body: u.html_content ?? u.body ?? '',
    active: u.active ?? true,
    createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    updatedAt: u.updated_at ?? u.updatedAt,
  };
}

export const templatesService = {
  async list(params?: ListParams): Promise<TemplatesListResponse> {
    const token = localStorage.getItem('token');
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString();
    const url = `${API_URL}/templates${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al obtener plantillas');
    }
    if (!response.ok) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al obtener plantillas');
    }

    const data = raw?.data?.templates ?? raw?.data ?? raw;

    if (!Array.isArray(data)) {
      throw new Error('Respuesta inválida del servidor');
    }

    const templates: Template[] = data.map(mapTemplate);

    const pagination: TemplatesPagination = raw?.pagination ?? {
      page: 1,
      limit: 10,
      total: templates.length,
      totalPages: 1,
    };

    return { templates, pagination };
  },

  async getById(id: string): Promise<Template> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      throw new Error(raw?.error ?? raw?.message ?? 'Plantilla no encontrada');
    }
    if (!response.ok) {
      throw new Error(raw?.error ?? raw?.message ?? 'Plantilla no encontrada');
    }

    const u = raw?.data?.template ?? raw?.data ?? raw;
    return mapTemplate(u);
  },

  /** Alias para compatibilidad con EntityFormConfig */
  async get(id: string): Promise<Template> {
    return this.getById(id);
  },

  create: async (data: {
    name: string;
    subject?: string;
    html_content: string;
    active?: boolean;
  }): Promise<Template> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al crear plantilla');
    }
    if (!response.ok) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al crear plantilla');
    }

    const u = raw?.data?.template ?? raw?.data ?? raw;
    return mapTemplate(u);
  },

  update: async (
    id: string,
    data: {
      name?: string;
      subject?: string;
      html_content?: string;
      active?: boolean;
    }
  ): Promise<Template> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al actualizar plantilla');
    }
    if (!response.ok) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al actualizar plantilla');
    }

    const u = raw?.data?.template ?? raw?.data ?? raw;
    return mapTemplate(u);
  },

  async delete(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al eliminar plantilla');
    }
    if (!response.ok) {
      throw new Error(raw?.error ?? raw?.message ?? 'Error al eliminar plantilla');
    }
  },
};
