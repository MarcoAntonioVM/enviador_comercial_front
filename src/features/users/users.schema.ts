import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "user", "viewer", "commercial"]),
  active: z.boolean(),
  // contraseña opcional en el esquema base; la validación obligatoria se aplica en createSchema
  password: z.string().optional(),
});

export const userCreateSchema = userFormSchema.extend({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;