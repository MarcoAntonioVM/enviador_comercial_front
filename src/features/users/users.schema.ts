import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "user", "viewer", "commercial"]),
  active: z.boolean(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;