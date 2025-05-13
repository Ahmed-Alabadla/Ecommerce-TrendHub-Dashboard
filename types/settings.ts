export interface Settings {
  id: number;
  store_name?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  store_logo?: string;
  tax_rate?: number;
  tax_enabled?: boolean;
  shipping_rate?: number;
  shipping_enabled?: boolean;
  createAt: Date;
  updatedAt: Date;
}

export interface CreateSettings {
  store_name?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  store_logo?: string | File;
  tax_rate?: number;
  tax_enabled?: boolean;
  shipping_rate?: number;
  shipping_enabled?: boolean;
}
