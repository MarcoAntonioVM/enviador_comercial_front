import type { EntityFormConfig } from "@/components/entity/types";
import { userFormSchema, type UserFormValues } from "./users.schema";
import type { User } from "./users.types";
import { usersService } from "./users.service";
import { paths } from "@/routes/paths";

type UserPayload = {
  name: string;
  email: string;
  role: "admin" | "user" | "viewer" | "commercial";
  active: boolean;
};

export const userFormConfig: EntityFormConfig<User, UserFormValues, UserPayload> = {
  entityName: "Usuario",
  schema: userFormSchema,
  fields: [
    { name: "name", label: "Nombre Completo", type: "text", colSpan: 6, placeholder: "Ej. María Gómez" },
    { name: "email", label: "Correo Electrónico", type: "email", colSpan: 6, placeholder: "maria.gomez@example.com" },
    {
      name: "role",
      label: "Rol del Usuario",
      type: "select",
      colSpan: 6,
      options: [
        { label: "Usuario", value: "user" },
        { label: "Administrador", value: "admin" },
        { label: "Visor", value: "viewer" },
        { label: "Comercial", value: "commercial" },
      ],
    },
    {
      name: "active",
      label: "Estado de la cuenta", 
      type: "status-toggle",
      colSpan: 6,
    },
  ],

  getById: usersService.getById,
  create: usersService.create,
  update: usersService.update,

  toForm: (u) => ({ name: u.name, email: u.email, role: u.role, active: u.active ?? true }),
  toPayload: (f) => ({ ...f }),

  listPath: paths.USERS,

  defaultValues: {
    name: "",
    email: "",
    role: "user",
    active: true,
  },
};