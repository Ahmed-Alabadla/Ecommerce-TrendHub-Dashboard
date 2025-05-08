import { apiGetCarts } from "@/lib/api/cart";
import { Cart } from "@/types/cart";
import { useQuery } from "@tanstack/react-query";

export const useCarts = () => {
  return useQuery<Cart[]>({
    queryKey: ["carts"],
    queryFn: apiGetCarts,
    refetchOnWindowFocus: true,
  });
};
