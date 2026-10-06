import { useQuery } from "@tanstack/react-query";
import { getRanking } from "../api/ranking";

export function useRanking() {
  return useQuery({
    queryKey: ["ranking"],
    queryFn: getRanking,
    staleTime: 0,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}