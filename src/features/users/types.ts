export interface User {
  [x: string]: any;
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string | null;
  role: 'admin' | 'superadmin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PaginatedUsers {
  current_page: number;
  data: User[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_used_at: string;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
} 