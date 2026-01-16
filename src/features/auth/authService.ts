import type {
  LoginPayload,
  LoginResponse,
  DummyJsonLoginResponse,
  User,
} from './auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: payload.email, // DummyJSON usa username
        password: payload.password,
      }),
    });

    const data = (await response.json()) as DummyJsonLoginResponse;

    if (!response.ok) {
      throw new Error('Error al iniciar sesión');
    }

    const user: User = {
      id: String(data.id),
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      role: 'user', // DummyJSON no maneja roles → default
      createdAt: new Date().toISOString(), // DummyJSON no lo trae
    };

    return {
      token: data.accessToken,
      user,
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
