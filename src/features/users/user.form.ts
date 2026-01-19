import type { EntityFormConfig } from "@/components/entity/types";
import { userFormSchema, type UserFormValues } from "./users.schema";
import type { User } from "./users.types";
import { usersService } from "./users.service";
import { paths } from "@/routes/paths";

type UserPayload = {
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
  status: "active" | "inactive";
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
        { label: "Usuario (user)", value: "user" },
        { label: "Administrador (admin)", value: "admin" },
        { label: "Visor (viewer)", value: "viewer" },
      ],
    },
    {
      name: "status",
      label: "Estado de la cuenta", 
      type: "status-toggle",
      colSpan: 6,
    },
  ],

  getById: usersService.getById,
  create: usersService.create,
  update: usersService.update,

  toForm: (u) => ({ name: u.name, email: u.email, role: u.role, status: u.status || "active" }),
  toPayload: (f) => ({ ...f }),

  listPath: paths.USERS,

  defaultValues: {
    name: "",
    email: "",
    role: "user",
    status: "active",
  },
};