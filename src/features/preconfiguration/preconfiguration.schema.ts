import { z } from "zod";
import { WEEKDAYS } from "./preconfiguration.types";

export const preconfigurationFormSchema = z.object({
  sender_id: z.string().min(1, "Sender required"),
  template_id: z.string().min(1, "Template required"),
  prospect_id: z.string().optional(),
  days_week: z.array(z.enum(WEEKDAYS)).optional(),
  hour: z.string().optional(),
});

export type PreconfigurationFormValues = z.infer<typeof preconfigurationFormSchema>;
