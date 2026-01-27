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
