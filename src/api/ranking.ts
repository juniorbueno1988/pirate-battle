import { api } from './api'

export type RankingEntry = {
  id: number
  player: string
  score: number
}

export async function getRanking(): Promise<RankingEntry[]> {
  const response = await api.get<RankingEntry[]>('/ranking')

  return response.data
}

export async function submitScore(
  player: string,
  score: number,
): Promise<RankingEntry> {
  const response = await api.post<RankingEntry>('/ranking', {
    player,
    score,
  })

  return response.data
}