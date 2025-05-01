import { User } from "./user";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  user: User;
}
export interface ReviewColumn {
  id: number;
  rating: number;
  comment: string;
  createAt: string;
  updatedAt: string;
  productName: string;
  userName: string;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
}

interface Meta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedReviews {
  data: Review[];
  meta: Meta;
}
