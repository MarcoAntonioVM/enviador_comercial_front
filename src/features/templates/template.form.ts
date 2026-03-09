import type { EntityFormConfig } from "@/components/entity/types";
import { templateFormSchema, type TemplateFormValues } from "./templates.schema";
import type { Template, CreateTemplatePayload } from "./templates.types";
import { templatesService } from "./templates.service";
import { paths } from "@/routes/paths";
import TemplatePreviewField from "./components/TemplatePreviewField";

export const templateFormConfig: EntityFormConfig<Template, TemplateFormValues, CreateTemplatePayload> = {
  entityName: "Plantilla",
  schema: templateFormSchema,
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Bienvenida" },
    { name: "subject", label: "Asunto", type: "text", colSpan: 6, placeholder: "Asunto del email" },
    { name: "body", label: "Contenido", type: "custom", colSpan: 12, component: TemplatePreviewField },
  ],

  getById: async (id: string) => {
    return templatesService.getById(id);
  },
  create: (payload: TemplatePayload) => templatesService.create(payload),
  update: (id: string, payload: TemplatePayload) => templatesService.update(id, payload),

  toForm: (t) => ({
    name: t.name,
    subject: t.subject ?? "",
    body: t.body,
  }),
  toPayload: (f) => ({
    name: f.name,
    subject: f.subject,
    html_content: f.body,
    active: true,
  }),

  listPath: paths.TEMPLATES,
};
