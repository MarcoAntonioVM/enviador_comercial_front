export const WEEKDAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
export type Weekday = typeof WEEKDAYS[number];

export type Preconfiguration = {
  id: string;
  recipient_email: string;
  sender_id: string;       // ID of the sender
  sender_name?: string;    // sender display name (optional)
  template_id: string;     // ID of the template
  template_name?: string;  // template display name (optional)
  prospect_id?: string;    // ID of a prospect (optional)
  prospect_name?: string;  // prospect display name (optional)
  days_week?: Weekday[];   // days of week
  hour?: string;           // send time in HH:mm format
  createdAt: string;
  updatedAt?: string;
};

export type PreconfigurationPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PreconfigurationsListResponse = {
  preconfigurations: Preconfiguration[];
  pagination: PreconfigurationPagination;
};
