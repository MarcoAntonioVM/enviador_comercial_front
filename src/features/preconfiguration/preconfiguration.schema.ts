import { z } from "zod";
import { WEEKDAYS } from "./preconfiguration.types";

/**
 * IDs son number en API y en `reset()`; `z.coerce` cubre el string que devuelve el <select> nativo al elegir opción.
 */
export const preconfigurationFormSchema = z.object({
  sender_id: z.coerce.number(),
  template_id: z.coerce.number(),
  prospect_id: z.coerce.number().optional(),
  days_week: z.array(z.enum(WEEKDAYS)).optional(),
  hour: z.string().optional(),
  cc: z.array(z.string().email("Email inválido")).optional(),
  bcc: z.array(z.string().email("Email inválido")).optional(),
});

export type PreconfigurationFormValues = z.infer<typeof preconfigurationFormSchema>;
