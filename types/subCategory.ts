import { Category } from "./category";

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  category: Category;
  createAt: string;
  updatedAt: string;
}

export interface CreateSubCategoryDto {
  name: string;
  slug: string;
  categoryId: number;
}
