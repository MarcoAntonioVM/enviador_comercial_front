export type Prospect = {
  id: string;
  emails: string[];
  name: string;
  company?: string;
  sector_id?: string;
  status: 'active' | 'unsubscribed' | 'unknown';
  phone?: string | null;
  metadata?: string[];
  createdAt: string;
};



export type prospectsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};


export type prospectsListResponse = {
  prospects: Prospect[];
  pagination: prospectsPagination;
};

// Payload usado para crear/actualizar prospectos desde el cliente.
export type ProspectPayload = Omit<Prospect, 'id' | 'createdAt'> & {
  // El backend espera un solo correo en `email` al crear/actualizar.
  email?: string;
};
