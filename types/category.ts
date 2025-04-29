import { SubCategory } from "./subCategory";

export interface Category {
  id: number;
  name: string;
  slug: string;
  subCategories: SubCategory[];
  image?: string | null;
  createAt: string;
  updatedAt: string;
}
