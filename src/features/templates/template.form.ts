import type { EntityFormConfig } from "@/components/entity/types";
import { templateFormSchema, type TemplateFormValues } from "./templates.schema";
import type { Template } from "./templates.types";
import { templatesService } from "./templates.service";
import { paths } from "@/routes/paths";

type TemplatePayload = {
  name: string;
  subject?: string;
  html_content: string;
  active: true;
};

export const templateFormConfig: EntityFormConfig<Template, TemplateFormValues, TemplatePayload> = {
  entityName: "Plantilla",
  schema: templateFormSchema,
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Bienvenida" },
    { name: "subject", label: "Asunto", type: "text", colSpan: 6, placeholder: "Asunto del email" },
    { name: "body", label: "Contenido", type: "richtext", colSpan: 12, placeholder: "Escribe el contenido de la plantilla..." },
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
