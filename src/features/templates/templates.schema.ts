import { z } from "zod";

export const templateFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  subject: z.string().optional(),
  body: z.string().min(1, "Contenido requerido"),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;
