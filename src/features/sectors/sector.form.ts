import type { EntityFormConfig } from "@/components/entity/types";
import { sectorFormSchema, type SectorFormValues } from "./sectors.schema";
import type { Sector } from "./sectors.types";
import { sectorsService } from "./sectors.service";
import { paths } from "@/routes/paths";

type SectorPayload = {
  name: string;
  description?: string;
};

export const sectorFormConfig: EntityFormConfig<Sector, SectorFormValues, SectorPayload> = {
  entityName: "Sector",
  schema: sectorFormSchema,
  fields: [
    { name: "name", label: "Nombre", type: "text", colSpan: 6, placeholder: "Ej. Comercial" },
    { name: "description", label: "Descripción", type: "textarea", colSpan: 12, placeholder: "Descripción del sector..." },
  ],

  getById: async (id: string) => {
    const sector = await sectorsService.get(id);
    if (!sector) throw new Error("Sector no encontrado");
    return sector;
  },
  create: sectorsService.create,
  update: async (id: string, payload: SectorPayload) => {
    const result = await sectorsService.update(id, payload);
    if (!result) throw new Error("Error al actualizar");
    return result;
  },

  toForm: (s) => ({ name: s.name, description: s.description || "" }),
  toPayload: (f) => ({ ...f }),

  listPath: paths.SECTORS,
};
