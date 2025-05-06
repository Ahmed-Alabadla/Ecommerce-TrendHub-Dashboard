import { apiGetSubCategories } from "@/lib/api/subcategory";
import { SubCategory } from "@/types/subCategory";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSubCategories = () => {
  return useSuspenseQuery<SubCategory[]>({
    queryKey: ["subcategories"],
    queryFn: apiGetSubCategories,
    refetchOnWindowFocus: true,
  });
};
