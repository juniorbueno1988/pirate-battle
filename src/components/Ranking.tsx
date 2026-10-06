import { useRanking } from "../hooks/useRanking";

export function Ranking() {
  const {
    data,
    isLoading,
    isError,
  } = useRanking();

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

      {!data || data.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Nenhuma pontuação registrada ainda.
        </p>
      ) : (
        <ol>
          {data.map((player) => (
            <li key={player.id}>
              {player.player} —{" "}
              {player.score} pontos
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}