import { z } from "zod";

export const prospectFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  sector_id: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "lost"]),
});

export type ProspectFormValues = z.infer<typeof prospectFormSchema>;
