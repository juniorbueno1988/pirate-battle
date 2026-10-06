import { api } from "./http";

export type MatchResult = {
  id: number;
  player: string;
  score: number;
  duration: number;
  reason: string;
  date: string;
};

export async function getHistory(): Promise<MatchResult[]> {
  const response = await api.get<MatchResult[]>("/history");

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