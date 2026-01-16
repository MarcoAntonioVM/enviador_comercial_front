import { z } from 'zod';

// ✅ Acepta:
// - email: correo@dominio.com
// - username: kminchelle (letras/números/._-)
// Sin espacios
const identifierSchema = z
  .string()
  .trim()
  .min(1, 'El correo o usuario es requerido')
  .refine((value) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isUsername = /^[a-zA-Z0-9._-]{3,}$/.test(value);
    return isEmail || isUsername;
  }, 'Ingresa un correo válido o un usuario válido');

export const loginSchema = z.object({
  email: identifierSchema, // (tu input se llama email, pero acepta user/email)
  password: z
    .string()
    .trim()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .trim()
      .min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Tipos inferidos de los schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
