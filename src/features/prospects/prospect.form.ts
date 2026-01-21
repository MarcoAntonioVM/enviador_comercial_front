import type { EntityFormConfig } from "@/components/entity/types";
import { prospectFormSchema, type ProspectFormValues } from "./prospects.schema";
import type { Prospect } from "./prospects.types";
import { prospectsService } from "./prospects.service";
import { paths } from "@/routes/paths";

type ProspectPayload = {
  name: string;
  emails: string[];
  company?: string;
  sector_id?: string;
  status: "new" | "contacted" | "qualified" | "lost";
  metadata?: string[];
};

export const prospectFormConfig: EntityFormConfig<Prospect, ProspectFormValues, ProspectPayload> = {
  entityName: "Prospecto",
  schema: prospectFormSchema,
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Ana López" },
    { name: "company", label: "Empresa", type: "text", colSpan: 6, placeholder: "Nombre empresa" },
    { name: "sector_id", label: "Sector ID", type: "text", colSpan: 6, placeholder: "s-1000" },
    {
      name: "status",
      label: "Estado",
      type: "select",
      colSpan: 6,
      options: [
        { label: "Nuevo", value: "new" },
        { label: "Contactado", value: "contacted" },
        { label: "Calificado", value: "qualified" },
        { label: "Perdido", value: "lost" },
      ],
    },
    { name: "emails", label: "Correos", type: "chips", colSpan: 12, placeholder: "correo1@ejemplo.com correo2@ejemplo.com" },
    { name: "metadata", label: "Metadatos", type: "chips", colSpan: 12, placeholder: "etiqueta1 etiqueta2" },
  ],

  getById: prospectsService.getById,
  create: prospectsService.create,
  update: prospectsService.update,

  toForm: (p) => ({
    name: p.name,
    company: p.company || "",
    sector_id: p.sector_id || "",
    status: p.status,
    emails: Array.isArray(p.emails) ? p.emails : [],
    metadata: Array.isArray(p.metadata) ? p.metadata : (p.metadata ? Object.values(p.metadata) as string[] : []),
  }),
  toPayload: (f) => ({
    ...f,
    emails: f.emails && f.emails.length ? f.emails : [],
    metadata: f.metadata && f.metadata.length ? f.metadata : undefined,
  }),

  listPath: paths.PROSPECTS,
};
