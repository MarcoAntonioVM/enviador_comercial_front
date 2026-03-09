export type Template = {
  id: string;
  name: string;
  subject?: string;
  /** Contenido HTML de la plantilla (mapeado desde html_content en la API) */
  body: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TemplatesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TemplatesListResponse = {
  templates: Template[];
  pagination: TemplatesPagination;
};

export type CreateTemplatePayload = {
  name: string;
  subject?: string;
  html_content: string;
  active?: boolean;
};

export type UpdateTemplatePayload = Partial<CreateTemplatePayload>;
