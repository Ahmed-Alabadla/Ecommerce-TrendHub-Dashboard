import { Product } from "./product";
import { User } from "./user";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createAt: string;
  updatedAt: string;
  product: Product;
  user: User;
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
