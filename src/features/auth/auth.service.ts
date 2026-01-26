import type { LoginPayload, LoginResponse, User } from './auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    const raw = await response.json();

    // Si la API retorna success: false usamos el campo `error` o `message`
    if (raw?.success === false) {
      const msg = raw?.error ?? raw?.message ?? 'Error al iniciar sesión';
      throw new Error(msg);
    }

    if (!response.ok) {
      // si el backend no devolvió success:false, intentar extraer mensaje de error
      const msg = raw?.error ?? raw?.message ?? 'Error al iniciar sesión';
      throw new Error(msg);
    }

    // Esperamos estructura: { success, message, data: { user, accessToken, refreshToken } }
    const data = raw?.data;
    if (!data || !data.user) {
      throw new Error('Respuesta inválida del servidor');
    }

    const u = data.user;
    const user: User = {
      id: String(u.id),
      email: u.email,
      name: u.name,
      role: (u.role as string) ?? '',
      createdAt: u.created_at ?? u.createdAt ?? new Date().toISOString(),
    };

    const accessToken = data.accessToken ?? data.access_token ?? data.token ?? raw?.accessToken;
    const refreshToken = data.refreshToken ?? data.refresh_token ?? raw?.refreshToken;

    return {
      token: accessToken,
      refreshToken,
      user,
    } as LoginResponse;
  },

  async logout(): Promise<void> {
    // Notificar al backend para invalidar tokens 
    try {
      const accessToken = localStorage.getItem('token') ?? localStorage.getItem('accessToken');
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
    } catch (e) {
      // No bloquear el logout local si la llamada falla
      // console.warn('Logout remoto falló', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};