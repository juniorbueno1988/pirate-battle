import { http, HttpResponse } from "msw";

const ranking = [
  {
    id: 1,
    player: "Captain Bueno",
    score: 120,
  },
  {
    id: 2,
    player: "Black Pearl",
    score: 95,
  },
  {
    id: 3,
    player: "Sea Wolf",
    score: 80,
  },
  {
    id: 4,
    player: "Red Kraken",
    score: 65,
  },
  {
    id: 5,
    player: "Blue Shark",
    score: 50,
  },
];

const history: Array<{
  id: number;
  player: string;
  score: number;
  duration: number;
  reason: string;
  date: string;
}> = [];

export const handlers = [
  http.get("/api/ranking", ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "5");

    const sortedRanking = [...ranking].sort((a, b) => b.score - a.score);

    const total = sortedRanking.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = sortedRanking.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      page,
      pageSize,
      total,
      totalPages,
    });
  }),

  http.post("/api/ranking", async ({ request }) => {
    const body = (await request.json()) as {
      player: string;
      score: number;
    };

    const newEntry = {
      id: ranking.length + 1,
      player: body.player,
      score: body.score,
    };

    ranking.push(newEntry);

    return HttpResponse.json(newEntry, {
      status: 201,
    });
  }),

  http.get("/api/history", ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "5");

    const total = history.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = history.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      page,
      pageSize,
      total,
      totalPages,
    });
  }),

  http.post("/api/history", async ({ request }) => {
    const body = (await request.json()) as {
      player: string;
      score: number;
      duration: number;
      reason: string;
      date: string;
    };

    const newEntry = {
      id: Date.now(),
      ...body,
    };

    history.unshift(newEntry);

    return HttpResponse.json(newEntry, {
      status: 201,
    });
  }),
];
