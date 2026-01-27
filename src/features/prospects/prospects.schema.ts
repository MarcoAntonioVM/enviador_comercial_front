import { z } from "zod";

export const prospectFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  company: z.string().optional(),
  sector_id: z.string().optional(),
  emails: z.array(z.string().email("Email inválido")).min(1, "Al menos un email es requerido"),
  metadata: z.array(z.string()).optional(),
});

export type ProspectFormValues = z.infer<typeof prospectFormSchema>;
