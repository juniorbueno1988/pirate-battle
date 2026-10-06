import { useState } from "react";
import { useRanking } from "../hooks/useRanking";

export function Ranking() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useRanking(page, 5);

  if (isLoading) {
    return <p>Carregando ranking...</p>;
  }

  if (isError) {
    return (
      <p>
        Não foi possível carregar o ranking.
      </p>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(0, 0, 0, 0.6)",
        color: "#fff",
        width: "100%",
        maxWidth: "500px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          textAlign: "center",
        }}
      >
        🏆 Ranking
      </h2>

      {data.data.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Nenhuma pontuação registrada ainda.
        </p>
      ) : (
        <>
          <ol>
            {data.data.map((player) => (
              <li key={player.id}>
                {player.player} — {player.score} pontos
              </li>
            ))}
          </ol>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Anterior
            </button>

            <span>
              Página {data.page} de {data.totalPages}
            </span>

            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}