import { useRanking } from '../hooks/useRanking'

export function Ranking() {
  const { data, isLoading, isError } = useRanking()

  if (isLoading) {
    return <p>Carregando ranking...</p>
  }

  if (isError) {
    return <p>Não foi possível carregar o ranking.</p>
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '20px',
        borderRadius: '12px',
        background: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
      }}
    >
      <h2>🏆 Ranking</h2>

      <ol>
        {data?.map((player) => (
          <li key={player.id}>
            {player.player} — {player.score} pontos
          </li>
        ))}
      </ol>
    </div>
  )
}