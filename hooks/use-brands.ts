import { apiGetBrands } from "@/lib/api/brand";
import { Brand } from "@/types/brand";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useBrands = () => {
  return useSuspenseQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: apiGetBrands,
    refetchOnWindowFocus: true,
  });
};
