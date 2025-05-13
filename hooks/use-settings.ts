import { apiGetSettings } from "@/lib/api/settings";
import { Settings } from "@/types/settings";
import { useQuery } from "@tanstack/react-query";

export const useSettings = () => {
  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: apiGetSettings,
    staleTime: Infinity, // never becomes stale
    refetchOnWindowFocus: false, // no need to refetch on focus
    refetchOnReconnect: false, // no need to refetch on reconnect
  });
};
