export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer' | 'commercial';
  active: boolean;
  createdAt: string; // ISO
};

export type UsersPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UsersListResponse = {
  users: User[];
  pagination: UsersPagination;
};

export type UserPayload = {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer' | 'commercial';
  active: boolean;
  password?: string;
};