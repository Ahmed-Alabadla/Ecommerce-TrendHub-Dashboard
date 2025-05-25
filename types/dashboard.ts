export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalSubCategories: number;
  totalOrders: number;
  totalRevenue: number;
  totalBrands: number;
  totalCarts: number;
  totalCoupons: number;
  totalSuppliers: number;
}

export interface MonthlySales {
  month: string;
  year: number;
  sales: number;
  orders: number;
}
