import { useQuery } from "@tanstack/react-query";
import { getRanking } from "../api/ranking";

export function useRanking(page = 1, pageSize = 5) {
  return useQuery({
    queryKey: ["ranking", page, pageSize],
    queryFn: () => getRanking(page, pageSize),
    staleTime: 0,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}