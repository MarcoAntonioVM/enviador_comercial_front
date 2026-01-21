import { z } from "zod";

export const senderFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  // Campos opcionales (no se muestran en el form por ahora)
  reply_to: z.string().email("Email inválido").optional().or(z.literal("")),
  signature: z.string().optional(),
  daily_limit: z.number().optional(),
});

export type SenderFormValues = z.infer<typeof senderFormSchema>;
