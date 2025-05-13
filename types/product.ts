import { Brand } from "./brand";
import { Category } from "./category";
import { SubCategory } from "./subCategory";

export interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
}

export enum ProductStatus {
  ACTIVE = "Active",
  OUT_OF_STOCK = "OutOfStock",
  DISCONTINUED = "Discontinued",
}

export interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount: number | null;
  imageCover: string;
  images: string[];
  // colors: (string | undefined)[];
  sold: number;
  ratingsAverage: string;
  ratingsQuantity: number;
  status: ProductStatus;
  warranty: string | null;
  weight: number | null;
  dimensions: Dimensions | null;
  createAt: Date;
  updatedAt: Date;
  category: Category;
  subCategory: SubCategory | null;
  brand: Brand | null;
  // reviews: Review[];
}

export interface CreateProductDto {
  name: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number | null;
  imageCover: string | File;
  images: string[] | File[];
  // colors?: (string | undefined)[];
  warranty?: string;
  weight?: number;
  dimensions?: Dimensions;
  status?: ProductStatus;
  categoryId: number;
  subCategoryId?: number | null;
  brandId?: number | null;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
}

interface Meta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedProducts {
  data: Product[];
  meta: Meta;
}
