import { apiGetCategories } from "@/lib/api/category";
import { Category } from "@/types/category";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useCategory = () => {
  return useSuspenseQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: apiGetCategories,
    refetchOnWindowFocus: true,
  });
};
