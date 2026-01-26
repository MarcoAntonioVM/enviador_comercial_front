export type Sector = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
};


export type SectorsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};


export type SectorsListResponse = {
  sectors: Sector[];
  pagination: SectorsPagination;
};