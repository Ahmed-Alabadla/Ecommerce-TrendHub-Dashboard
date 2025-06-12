import { apiProfile } from "@/lib/api/profile";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: apiProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
};
