import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../api/history";

export function useHistory(page = 1, pageSize = 5) {
  return useQuery({
    queryKey: ["history", page, pageSize],
    queryFn: () => getHistory(page, pageSize),
    staleTime: 0,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}