export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierDto {
  name: string;
  email: string;
  phone?: string;
  website: string;
}
