import { z } from "zod";

/** Elimina etiquetas HTML y devuelve el texto plano */
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

export const templateFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  subject: z.string().optional(),
  body: z
    .string()
    .min(1, "Contenido requerido")
    .refine((v) => stripHtml(v).length > 0, "El contenido no puede estar vacío"),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;
