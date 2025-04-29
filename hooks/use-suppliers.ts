import { apiGetSuppliers } from "@/lib/api/supplier";
import { Supplier } from "@/types/supplier";
import { useQuery } from "@tanstack/react-query";

export const useSuppliers = () => {
  return useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: apiGetSuppliers,
    refetchOnWindowFocus: true,
  });
};
