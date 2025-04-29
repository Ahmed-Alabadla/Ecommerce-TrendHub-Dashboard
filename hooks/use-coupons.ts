import { apiGetCoupons } from "@/lib/api/coupon";
import { Coupon } from "@/types/coupon";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useCoupons = () => {
  return useSuspenseQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: apiGetCoupons,
    refetchOnWindowFocus: true,
  });
};
