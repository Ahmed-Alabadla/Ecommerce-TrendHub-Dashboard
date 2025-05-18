import { SubCategory } from "./subCategory";

export interface Category {
  id: number;
  name: string;
  slug: string;
  subCategories: SubCategory[];
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  image?: string | File;
}
