export type RankingEntry = {
  id: number
  player: string
  score: number
}

type MatchResult = {
  id: string
  score: number
  duration: number
  reason: string
  createdAt: string
}

const HISTORY_KEY = 'pirate-battle-history'

export async function getRanking(): Promise<RankingEntry[]> {
  const stored = localStorage.getItem(HISTORY_KEY)

  if (!stored) {
    return []
  }

  const history: MatchResult[] = JSON.parse(stored)

  return history
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((match) => ({
      id: Number(match.id),
      player: 'Captain Bueno',
      score: match.score,
    }))
}

export async function submitScore(
  player: string,
  score: number,
): Promise<RankingEntry> {
  return {
    id: Date.now(),
    player,
    score,
  }
}