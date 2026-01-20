import { z } from "zod";

export const sectorFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
});

export type SectorFormValues = z.infer<typeof sectorFormSchema>;
