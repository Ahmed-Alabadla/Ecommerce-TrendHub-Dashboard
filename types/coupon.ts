export interface Coupon {
  id: number;
  code: string;
  discount: number;
  expirationDate: Date;
  type: "fixed" | "percentage";
  maxUsage: number;
  currentUsage: number;
  createAt: Date;
  updatedAt: Date;
}

export interface CreateCouponDto {
  code: string;
  discount: number;
  expirationDate: Date;
  type: "fixed" | "percentage";
  maxUsage: number;
}
