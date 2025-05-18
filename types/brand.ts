export interface Brand {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDto {
  name: string;
  slug: string;
  image?: string | File;
}
