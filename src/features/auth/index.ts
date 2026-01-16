// Tipos
export type { User, LoginPayload, LoginResponse, AuthState } from './auth.types';

// Hooks
export { useLogin } from './hooks/useLogin';
export { useLogout } from './hooks/useLogout';
// `useMe` está comentado/not implemented. Se removió la re-exportación para evitar errores de import.

// Schemas
export { loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema';
export type { LoginFormData, ForgotPasswordFormData, ResetPasswordFormData } from './auth.schema';

// Service
export { authService } from './authService';

// Pages (para rutas)
export { LoginPage } from './pages/LoginPage';
export { ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { ResetPasswordPage } from './pages/ResetPasswordPage';

// Components
export { LoginForm } from './components/LoginForm';
