// Tipos relacionados con autenticación

export interface User {
  id: string;
  email: string;
  name: string;
  // Permitir múltiples roles dinámicos (ej. 'admin', 'editor', 'manager', ...)
  role: string;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string; 
  refreshToken?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

