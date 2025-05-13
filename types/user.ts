export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  isAccountVerified: boolean;
  avatar?: string | null;
  birth_date?: string | Date | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean | undefined;
  gender?: string | null;
  createAt: string;
  updatedAt: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
}

interface Meta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedUsers {
  data: User[];
  meta: Meta;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string | File;
  address?: string;
  birth_date?: Date | string;
  gender?: string;
}
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}
