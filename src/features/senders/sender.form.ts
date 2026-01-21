import type { EntityFormConfig } from "@/components/entity/types";
import { senderFormSchema, type SenderFormValues } from "./senders.schema";
import type { Sender } from "./senders.types";
import { sendersService } from "./senders.service";
import { paths } from "@/routes/paths";

// Tipo del payload que se envía al crear/actualizar
type SenderPayload = {
  name: string;
  email: string;
  reply_to?: string;
  signature?: string;
  daily_limit?: number;
};

export const senderFormConfig: EntityFormConfig<Sender, SenderFormValues, SenderPayload> = {
  // Nombre de la entidad (para títulos)
  entityName: "Remitente",
  
  // Schema de validación (Zod)
  schema: senderFormSchema,
  
  // Campos que se mostrarán en el formulario
  // Mostramos name y email por ahora
  fields: [
    { 
      name: "name", 
      label: "Nombre", 
      type: "text", 
      colSpan: 6, 
      placeholder: "Ej. Marketing",
    },
    { 
      name: "email", 
      label: "Email", 
      type: "text", 
      colSpan: 6, 
      placeholder: "ejemplo@empresa.com",
    },
  ],
  
  // Función para obtener un sender por ID (para editar)
  getById: async (id: string) => {
    const sender = await sendersService.get(id);
    if (!sender) throw new Error("Remitente no encontrado");
    return sender;
  },
  
  // Función para crear
  create: sendersService.create,
  
  // Función para actualizar
  update: async (id: string, payload: SenderPayload) => {
    const result = await sendersService.update(id, payload);
    if (!result) throw new Error("Error al actualizar");
    return result;
  },
  
  // Convierte la entidad → valores del formulario
  toForm: (sender) => ({
    name: sender.name,
    email: sender.email,
    reply_to: sender.reply_to || "",
    signature: sender.signature || "",
    daily_limit: sender.daily_limit,
  }),
  
  // Convierte valores del form → payload para enviar
  toPayload: (formValues) => ({
    name: formValues.name,
    email: formValues.email,
    reply_to: formValues.reply_to || undefined,
    signature: formValues.signature || undefined,
    daily_limit: formValues.daily_limit,
  }),
  
  // Ruta de regreso al listado
  listPath: paths.SENDERS,
};
