import { api } from "./http";

export type MatchResult = {
  id: number;
  player: string;
  score: number;
  duration: number;
  reason: string;
  date: string;
};

export type HistoryResponse = {
  data: MatchResult[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export async function getHistory(
  page = 1,
  pageSize = 5,
): Promise<HistoryResponse> {
  const response = await api.get<HistoryResponse>("/history", {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
}

export async function submitHistory(
  result: Omit<MatchResult, "id">,
): Promise<MatchResult> {
  const response = await api.post<MatchResult>(
    "/history",
    result,
  );

  return response.data;
}