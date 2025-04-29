export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  createAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierDto {
  name: string;
  email: string;
  phone?: string;
  website: string;
}
