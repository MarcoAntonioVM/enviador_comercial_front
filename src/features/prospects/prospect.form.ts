import type { EntityFormConfig } from "@/components/entity/types";
import { prospectFormSchema, type ProspectFormValues } from "./prospects.schema";
import type { Prospect, ProspectPayload } from "./prospects.types";
import { prospectsService } from "./prospects.service";
import { paths } from "@/routes/paths";

export const prospectFormConfig: EntityFormConfig<Prospect, ProspectFormValues, ProspectPayload> = {
  entityName: "Prospecto",
  schema: prospectFormSchema,
  defaultValues: {
    name: "",
    company: "",
    sector_name: "",
    emails: [],
    metadata: [],
  },
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Juan Pérez" },
    { name: "company", label: "Empresa", type: "text", colSpan: 6, placeholder: "Ej. ACME" },
    { name: "sector_name", label: "Sector", type: "text", colSpan: 6, placeholder: "Ej. Tecnologia" },
    { name: "emails", label: "Correo", type: "chips", colSpan: 12, placeholder: "correo1@ejemplo.com" },
    { name: "metadata", label: "Metadatos", type: "chips", colSpan: 12, placeholder: "etiqueta1 etiqueta2" },
  ],

  getById: prospectsService.getById,
  create: prospectsService.create,
  update: prospectsService.update,

  toForm: (p) => ({
    name: p.name,
    company: p.company || "",
    sector_name: p.sector_name ?? "",
    emails: Array.isArray(p.emails) ? p.emails : [],
    metadata: Array.isArray(p.metadata) ? p.metadata : (p.metadata ? Object.values(p.metadata) as string[] : []),
  }),
  toPayload: (f) => ({
    ...f,
    status: "active",
    phone: null,
    email: f.emails?.length ? f.emails[0] : undefined,
    metadata: f.metadata?.length ? f.metadata : undefined,
  }),

  listPath: paths.PROSPECTS,
};
