import { apiGetCustomers } from "@/lib/api/user";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useCustomers = () => {
  return useQuery<User[]>({
    queryKey: ["customers"],
    queryFn: apiGetCustomers,
    refetchOnWindowFocus: true,
  });
};
