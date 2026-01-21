export type Prospect = {
  id: string;
  emails: string[];
  name: string;
  company?: string;
  sector_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  metadata?: string[];
  createdAt: string;
};

