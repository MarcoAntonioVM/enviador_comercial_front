export type Sender = {
  id: string;
  name: string;           // Nombre del remitente (obligatorio)
  email: string;          // Email del remitente (obligatorio)
  reply_to?: string;      // Email de respuesta (opcional)
  signature?: string;     // Firma del email (opcional)
  daily_limit?: number;   // Límite diario de envíos (opcional)
  createdAt: string;
  updatedAt?: string;
};


export type SenderPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};


export type SendersListResponse = {
  senders: Sender[];
  pagination: SenderPagination;
};
