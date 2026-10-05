import { http, HttpResponse } from 'msw'

const ranking = [
  {
    id: 1,
    player: 'Captain Bueno',
    score: 120,
  },
  {
    id: 2,
    player: 'Black Pearl',
    score: 95,
  },
  {
    id: 3,
    player: 'Sea Wolf',
    score: 80,
  },
  {
    id: 4,
    player: 'Red Kraken',
    score: 65,
  },
  {
    id: 5,
    player: 'Blue Shark',
    score: 50,
  },
]

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/ranking', () => {
    return HttpResponse.json(
      [...ranking].sort((a, b) => b.score - a.score),
    )
  }),

  http.post(
    'https://jsonplaceholder.typicode.com/ranking',
    async ({ request }) => {
      const body = await request.json() as {
        player: string
        score: number
      }

      const newEntry = {
        id: ranking.length + 1,
        player: body.player,
        score: body.score,
      }

      ranking.push(newEntry)

      return HttpResponse.json(newEntry, {
        status: 201,
      })
    },
  ),
]