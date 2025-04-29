import { apiProfile } from "@/lib/api/profile";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: apiProfile,

    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: true,
  });
};
