import type { EntityFormConfig } from "@/components/entity/types";
import { prospectFormSchema, type ProspectFormValues } from "./prospects.schema";
import type { Prospect, ProspectPayload } from "./prospects.types";
import { prospectsService } from "./prospects.service";
import { paths } from "@/routes/paths";

export const buildProspectFormConfig = (sectors: { id: string; name: string }[] = []) : EntityFormConfig<Prospect, ProspectFormValues, ProspectPayload> => ({
  entityName: "Prospecto",
  schema: prospectFormSchema,
  // Valor por defecto: seleccionar el primer sector disponible si existe
  defaultValues: {
    sector_id: sectors[0]?.id ? String(sectors[0].id) : "",
  },
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Prospecto Nombre" },
    { name: "company", label: "Empresa", type: "text", colSpan: 6, placeholder: "Nombre empresa" },
    {
      name: "sector_id",
      label: "Sector",
      type: "select",
      colSpan: 6,
      options: sectors.map((s) => ({ label: s.name, value: String(s.id) })),
    },
    // El estado se gestiona internamente como 'active' y no se muestra al usuario.
    { name: "emails", label: "Correo", type: "chips", colSpan: 12, placeholder: "correo1@ejemplo.com" },
    { name: "metadata", label: "Metadatos", type: "chips", colSpan: 12, placeholder: "etiqueta1 etiqueta2" },
  ],

  getById: prospectsService.getById,
  create: prospectsService.create,
  update: prospectsService.update,

  toForm: (p) => ({
    name: p.name,
    company: p.company || "",
    sector_id: p.sector_id ? String(p.sector_id) : "",
    // no incluir `status` en el form
    emails: Array.isArray(p.emails) ? p.emails : [],
    metadata: Array.isArray(p.metadata) ? p.metadata : (p.metadata ? Object.values(p.metadata) as string[] : []),
  }),
  toPayload: (f) => ({
    ...f,
    // Forzar estado interno a 'active' y enviar phone como null por ahora
    status: 'active',
    phone: null,
    // Enviar un solo correo como campo `email` (backend espera solo uno)
    email: f.emails && f.emails.length ? f.emails[0] : undefined,
    metadata: f.metadata && f.metadata.length ? f.metadata : undefined,
  }),

  listPath: paths.PROSPECTS,
});
