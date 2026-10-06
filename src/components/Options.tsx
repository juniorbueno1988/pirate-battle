import { useState } from "react";
import {
  defaultGameConfig,
  type GameConfig,
} from "../config/gameConfig";

type OptionsProps = {
  config: GameConfig;
  onSave: (config: GameConfig) => void;
  onBack: () => void;
};

export function Options({
  config,
  onSave,
  onBack,
}: OptionsProps) {
  const [sessionDuration, setSessionDuration] = useState(
    config.sessionDuration,
  );

  const [enemySpawnInterval, setEnemySpawnInterval] =
    useState(config.enemySpawnInterval);

  const [error, setError] = useState("");

  function handleSave() {
    if (
      !Number.isFinite(sessionDuration) ||
      sessionDuration < 60 ||
      sessionDuration > 180
    ) {
      setError(
        "A duração da partida deve estar entre 60 e 180 segundos.",
      );
      return;
    }

    if (
      !Number.isFinite(enemySpawnInterval) ||
      enemySpawnInterval < 1 ||
      enemySpawnInterval > 30
    ) {
      setError(
        "O intervalo de surgimento dos inimigos deve estar entre 1 e 30 segundos.",
      );
      return;
    }

    setError("");

    onSave({
      ...defaultGameConfig,
      ...config,
      sessionDuration,
      enemySpawnInterval,
    });
  }

  return (
    <section
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 30,
        background: "#07111d",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "#102233",
          border: "1px solid #345",
          borderRadius: 12,
          padding: 30,
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            textAlign: "center",
            fontSize: 32,
          }}
        >
          OPÇÕES
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 25,
          }}
        >
          <label htmlFor="session-duration">
            Duração da partida
          </label>

          <input
            id="session-duration"
            type="number"
            min={60}
            max={180}
            value={sessionDuration}
            onChange={(event) =>
              setSessionDuration(
                Number(event.target.value),
              )
            }
            style={{
              padding: 10,
              fontSize: 18,
              borderRadius: 6,
              border: "1px solid #567",
            }}
          />

          <small style={{ opacity: 0.7 }}>
            Informe um valor entre 60 e 180 segundos.
          </small>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <label htmlFor="enemy-spawn-interval">
            Intervalo de surgimento dos inimigos
          </label>

          <input
            id="enemy-spawn-interval"
            type="number"
            min={1}
            max={30}
            value={enemySpawnInterval}
            onChange={(event) =>
              setEnemySpawnInterval(
                Number(event.target.value),
              )
            }
            style={{
              padding: 10,
              fontSize: 18,
              borderRadius: 6,
              border: "1px solid #567",
            }}
          />

          <small style={{ opacity: 0.7 }}>
            Informe um valor entre 1 e 30 segundos.
          </small>
        </div>

        {error && (
          <div
            style={{
              background: "#5c1f1f",
              border: "1px solid #a33",
              borderRadius: 6,
              padding: 12,
              marginBottom: 20,
              color: "#fff",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleSave}
            style={{
              padding: "12px 25px",
              fontSize: 17,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            SALVAR
          </button>

          <button
            onClick={onBack}
            style={{
              padding: "12px 25px",
              fontSize: 17,
              cursor: "pointer",
            }}
          >
            VOLTAR
          </button>
        </div>
      </div>
    </section>
  );
}