import type { ZodSchema } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "chips"
  | "number"
  | "select"
  | "textarea"
  | "switch"
  | "status-toggle";

export type FieldOption = { label: string; value: string | number };

export type FieldConfig<TForm> = {
  name: keyof TForm;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];     // select
  colSpan?: number;           // layout (1,2,3,4…)
  hiddenWhenEdit?: boolean;
  hiddenWhenCreate?: boolean;
};

export type EntityFormConfig<TEntity, TForm, TPayload> = {
  entityName: string; // "Usuario"
  schema: ZodSchema<TForm>;
  /** Esquema opcional que se usará sólo al crear (validación específica de creación) */
  createSchema?: ZodSchema<TForm>;
  /** Esquema opcional que se usará sólo al editar (validación específica de edición) */
  editSchema?: ZodSchema<TForm>;
  fields: FieldConfig<TForm>[];

  getById: (id: string) => Promise<TEntity>;
  create: (payload: TPayload) => Promise<any>;
  update: (id: string, payload: TPayload) => Promise<any>;

  toForm: (entity: TEntity) => TForm;
  toPayload: (form: TForm) => TPayload;

  listPath: string;  // a dónde regresar al guardar/cancelar
  defaultValues?: Partial<TForm>; // valores por defecto al crear
};