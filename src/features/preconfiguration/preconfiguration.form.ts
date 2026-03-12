import type { EntityFormConfig } from "@/components/entity/types";
import type { FieldOption } from "@/components/entity/types";
import { preconfigurationFormSchema, type PreconfigurationFormValues } from "./preconfiguration.schema";
import type { Preconfiguration } from "./preconfiguration.types";
import { preconfigurationsService } from "./preconfiguration.service";
import { paths } from "@/routes/paths";

export type PreconfigurationFormOptions = {
  senderOptions: FieldOption[];
  templateOptions: FieldOption[];
  prospectOptions: FieldOption[];
};

function resolveNames(payload: PreconfigurationFormValues, { senderOptions, templateOptions, prospectOptions }: PreconfigurationFormOptions) {
  return {
    sender_name: senderOptions.find((s) => s.value === payload.sender_id)?.label,
    template_name: templateOptions.find((t) => t.value === payload.template_id)?.label,
    prospect_name: prospectOptions.find((p) => p.value === payload.prospect_id)?.label,
  };
}

/** Genera la config del formulario con las opciones cargadas desde la API (remitentes, plantillas, prospectos). */
export function getPreconfigurationFormConfig(
  options: PreconfigurationFormOptions
): EntityFormConfig<Preconfiguration, PreconfigurationFormValues, PreconfigurationFormValues> {
  const { senderOptions, templateOptions, prospectOptions } = options;

  return {
    entityName: "Preconfiguración",

    schema: preconfigurationFormSchema,

    fields: [
      {
        name: "sender_id",
        label: "Remitente",
        type: "select",
        colSpan: 6,
        options: senderOptions,
      },
      {
        name: "template_id",
        label: "Plantilla",
        type: "select",
        colSpan: 6,
        options: templateOptions,
      },
      {
        name: "prospect_id",
        label: "Prospecto",
        type: "select",
        colSpan: 6,
        options: prospectOptions,
      },
      {
        name: "days_week",
        label: "Días de envío",
        type: "days",
        colSpan: 6,
      },
      {
        name: "hour",
        label: "Hora de envío",
        type: "time",
        colSpan: 6,
      },
    ],

    getById: async (id: string) => {
      const item = await preconfigurationsService.getById(id);
      if (!item) throw new Error("Preconfiguración no encontrada");
      return item;
    },

    create: async (payload) =>
      preconfigurationsService.create({ ...payload, ...resolveNames(payload, options) }),

    update: async (id, payload) =>
      preconfigurationsService.update(id, { ...payload, ...resolveNames(payload, options) }),

    toForm: (item) => ({
      sender_id: item.sender_id,
      template_id: item.template_id,
      prospect_id: item.prospect_id,
      days_week: item.days_week ?? [],
      hour: item.hour ?? "",
    }),

    toPayload: (formValues) => ({
      sender_id: formValues.sender_id,
      template_id: formValues.template_id,
      prospect_id: formValues.prospect_id || undefined,
      days_week: formValues.days_week?.length ? formValues.days_week : undefined,
      hour: formValues.hour || undefined,
    }),

    listPath: paths.PRECONFIGURATIONS,
  };
}
