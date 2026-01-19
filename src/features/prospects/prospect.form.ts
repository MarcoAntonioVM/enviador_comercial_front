import type { EntityFormConfig } from "@/components/entity/types";
import { prospectFormSchema, type ProspectFormValues } from "./prospects.schema";
import type { Prospect } from "./prospects.types";
import { prospectsService } from "./prospectsService";
import { paths } from "@/routes/paths";

type ProspectPayload = {
  name: string;
  email: string;
  company?: string;
  sector_id?: string;
  status: "new" | "contacted" | "qualified" | "lost";
};

export const prospectFormConfig: EntityFormConfig<Prospect, ProspectFormValues, ProspectPayload> = {
  entityName: "Prospecto",
  schema: prospectFormSchema,
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Ana López" },
    { name: "email", label: "Email", type: "email", colSpan: 6, placeholder: "ana.lopez@example.com" },
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
  ],

  getById: prospectsService.getById,
  create: prospectsService.create,
  update: prospectsService.update,

  toForm: (p) => ({ name: p.name, email: p.email, company: p.company || "", sector_id: p.sector_id || "", status: p.status }),
  toPayload: (f) => ({ ...f }),

  listPath: paths.PROSPECTS,
};
