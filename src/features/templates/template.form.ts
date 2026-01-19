import type { EntityFormConfig } from "@/components/entity/types";
import { templateFormSchema, type TemplateFormValues } from "./templates.schema";
import type { Template } from "./templates.types";
import { templatesService } from "./templates.service";
import { paths } from "@/routes/paths";

type TemplatePayload = {
  name: string;
  subject?: string;
  body: string;
};

export const templateFormConfig: EntityFormConfig<Template, TemplateFormValues, TemplatePayload> = {
  entityName: "Plantilla",
  schema: templateFormSchema,
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Bienvenida" },
    { name: "subject", label: "Asunto", type: "text", colSpan: 6, placeholder: "Asunto del email" },
    { name: "body", label: "Contenido", type: "textarea", colSpan: 12, placeholder: "Escribe el contenido de la plantilla..." },
  ],

  getById: async (id: string) => {
    const template = await templatesService.get(id);
    if (!template) throw new Error("Plantilla no encontrada");
    return template;
  },
  create: templatesService.create,
  update: async (id: string, payload: TemplatePayload) => {
    const result = await templatesService.update(id, payload);
    if (!result) throw new Error("Error al actualizar");
    return result;
  },

  toForm: (t) => ({ name: t.name, subject: t.subject || "", body: t.body }),
  toPayload: (f) => ({ ...f }),

  listPath: paths.TEMPLATES,
};
