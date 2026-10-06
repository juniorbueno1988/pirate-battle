import { api } from "./http";

export type RankingEntry = {
  id: number;
  player: string;
  score: number;
};

export type RankingResponse = {
  data: RankingEntry[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export async function getRanking(
  page = 1,
  pageSize = 5,
): Promise<RankingResponse> {
  const response = await api.get<RankingResponse>("/ranking", {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
}

export async function submitScore(
  player: string,
  score: number,
): Promise<RankingEntry> {
  const response = await api.post<RankingEntry>("/ranking", {
    player,
    score,
  });

  return response.data;
}