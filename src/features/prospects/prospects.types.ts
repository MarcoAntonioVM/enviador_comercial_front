export type Prospect = {
  id: string;
  email: string;
  name: string;
  company?: string;
  sector_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  metadata?: Record<string, any>;
  createdAt: string;
};

