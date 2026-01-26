import type { User, UsersListResponse, UsersPagination } from "./users.types";

const API_URL = import.meta.env.VITE_API_URL;

type ListParams = {
  page?: number;
  limit?: number;
};

export const usersService = {
  async list(params?: ListParams): Promise<UsersListResponse> {
    const token = localStorage.getItem("token");
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    
    const queryString = searchParams.toString();
    const url = `${API_URL}/users${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener usuarios";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al obtener usuarios";
      throw new Error(msg);
    }

    const data = raw?.data ?? raw;
    
    if (!Array.isArray(data)) {
      throw new Error("Respuesta inválida del servidor");
    }

    const users: User[] = data.map((u: any) => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
      role: u.role ?? "user",
      active: u.active ?? true,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    }));

    const pagination: UsersPagination = raw?.pagination ?? {
      page: 1,
      limit: 10,
      total: users.length,
      totalPages: 1,
    };

    return { users, pagination };
  },

  async getById(id: string): Promise<User> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Usuario no encontrado";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Usuario no encontrado";
      throw new Error(msg);
    }

    // La API devuelve { success, message, data: { user: {...} } }
    const u = raw?.data?.user ?? raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      role: u.role ?? "user",
      active: u.active ?? true,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    };
  },

  async create(payload: { name: string; email: string; role: "admin" | "user" | "viewer" | "commercial"; active?: boolean }): Promise<User> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear usuario";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al crear usuario";
      throw new Error(msg);
    }

    const u = raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      role: u.role ?? "user",
      active: u.active ?? true,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    };
  },

  async update(id: string, payload: { name: string; email: string; role: "admin" | "user" | "viewer" | "commercial"; active?: boolean }): Promise<User> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.json();

    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar usuario";
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = raw?.error ?? raw?.message ?? "Error al actualizar usuario";
      throw new Error(msg);
    }

    const u = raw?.data ?? raw;

    return {
      id: String(u.id),
      name: u.name,
      email: u.email,
      role: u.role ?? "user",
      active: u.active ?? true,
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    };
  },
};