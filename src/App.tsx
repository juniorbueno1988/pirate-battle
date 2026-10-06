import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Application, Graphics, Text } from "pixi.js";
import { Ranking } from "./components/Ranking";
import { Options } from "./components/Options";
import { submitScore } from "./api/ranking";
import { useHistory } from "./hooks/useHistory";
import { submitHistory } from "./api/history";
import { defaultGameConfig, type GameConfig } from "./config/gameConfig";
const CONFIG_KEY = "pirate-battle-config";

function getStoredGameConfig(): GameConfig {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);

    if (!stored) {
      return defaultGameConfig;
    }

    const savedConfig = JSON.parse(stored);

    return {
      ...defaultGameConfig,
      ...savedConfig,
    };
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    return defaultGameConfig;
  }
}

function App() {
  const [historyPage, setHistoryPage] = useState(1);
  const historyQuery = useHistory(historyPage, 5);
  const queryClient = useQueryClient();
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  const gameConfigRef = useRef<GameConfig>(getStoredGameConfig());

  const [gameConfig, setGameConfig] = useState<GameConfig>(
    getStoredGameConfig(),
  );

  const [showMenu, setShowMenu] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const history = historyQuery.data?.data ?? [];
  function handleSaveConfig(config: GameConfig) {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));

      gameConfigRef.current = config;
      setGameConfig(config);
      setShowOptions(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  }

  useEffect(() => {
    if (!gameContainerRef.current) {
      return;
    }

    const container = gameContainerRef.current;
    const pixiApp = new Application();

    let destroyed = false;

    const initializeGame = async () => {
      await pixiApp.init({
        width: 800,
        height: 600,
        backgroundColor: 0x0b1726,
        antialias: true,
      });

      if (destroyed) {
        pixiApp.destroy(true);
        return;
      }

      container.appendChild(pixiApp.canvas);

      let health = gameConfigRef.current.playerMaxHealth;
      let score = 0;
      let timeRemaining = gameConfigRef.current.sessionDuration;
      let paused = true;
      let gameOver = false;
      let gameTimer = 0;
      let enemySpawnTimer = 0;

      const healthText = new Text({
        text: `Vida: ${health}`,
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      });

      healthText.x = 20;
      healthText.y = 20;

      const scoreText = new Text({
        text: "Pontuação: 0",
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      });

      scoreText.x = 20;
      scoreText.y = 50;

      const timerText = new Text({
        text: `Tempo: ${timeRemaining}`,
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      });

      timerText.x = 20;
      timerText.y = 80;

      pixiApp.stage.addChild(healthText, scoreText, timerText);

      const pauseText = new Text({
        text: "PAUSADO",
        style: {
          fill: 0xffffff,
          fontSize: 48,
          fontWeight: "bold",
        },
      });

      pauseText.anchor.set(0.5);
      pauseText.x = 400;
      pauseText.y = 300;
      pauseText.visible = true;

      pixiApp.stage.addChild(pauseText);

      const gameOverBackground = new Graphics();

      gameOverBackground.rect(150, 110, 500, 390).fill({
        color: 0x000000,
        alpha: 0.9,
      });

      gameOverBackground.visible = false;

      pixiApp.stage.addChild(gameOverBackground);

      const gameOverTitle = new Text({
        text: "FIM DE JOGO",
        style: {
          fill: 0xffffff,
          fontSize: 42,
          fontWeight: "bold",
        },
      });

      gameOverTitle.anchor.set(0.5);
      gameOverTitle.x = 400;
      gameOverTitle.y = 170;
      gameOverTitle.visible = false;

      pixiApp.stage.addChild(gameOverTitle);

      const finalScoreText = new Text({
        text: "Pontuação: 0",
        style: {
          fill: 0xffffff,
          fontSize: 26,
        },
      });

      finalScoreText.anchor.set(0.5);
      finalScoreText.x = 400;
      finalScoreText.y = 230;
      finalScoreText.visible = false;

      pixiApp.stage.addChild(finalScoreText);

      const gameOverReasonText = new Text({
        text: "",
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      });

      gameOverReasonText.anchor.set(0.5);
      gameOverReasonText.x = 400;
      gameOverReasonText.y = 270;
      gameOverReasonText.visible = false;

      pixiApp.stage.addChild(gameOverReasonText);

      const restartButton = new Graphics();

      restartButton.roundRect(270, 320, 260, 60, 10).fill(0x1976d2);

      restartButton.eventMode = "static";
      restartButton.cursor = "pointer";
      restartButton.visible = false;

      pixiApp.stage.addChild(restartButton);

      const restartText = new Text({
        text: "JOGAR NOVAMENTE",
        style: {
          fill: 0xffffff,
          fontSize: 20,
          fontWeight: "bold",
        },
      });

      restartText.anchor.set(0.5);
      restartText.x = 400;
      restartText.y = 350;
      restartText.visible = false;

      pixiApp.stage.addChild(restartText);

      const menuButton = new Graphics();

      menuButton.roundRect(270, 400, 260, 60, 10).fill(0x455a64);

      menuButton.eventMode = "static";
      menuButton.cursor = "pointer";
      menuButton.visible = false;

      pixiApp.stage.addChild(menuButton);

      const menuText = new Text({
        text: "MENU PRINCIPAL",
        style: {
          fill: 0xffffff,
          fontSize: 20,
          fontWeight: "bold",
        },
      });

      menuText.anchor.set(0.5);
      menuText.x = 400;
      menuText.y = 430;
      menuText.visible = false;

      pixiApp.stage.addChild(menuText);

      const player = new Graphics();

      player
        .moveTo(0, -20)
        .lineTo(15, 20)
        .lineTo(0, 12)
        .lineTo(-15, 20)
        .closePath()
        .fill(0x00aaff);

      player.x = 400;
      player.y = 500;

      pixiApp.stage.addChild(player);

      const islands: Graphics[] = [];

      function createIsland(x: number, y: number, radius: number) {
        const island = new Graphics();

        island.circle(0, 0, radius).fill(0x4f6f3f);

        island.x = x;
        island.y = y;

        pixiApp.stage.addChild(island);
        islands.push(island);
      }

      createIsland(400, 350, 55);
      createIsland(200, 180, 45);
      createIsland(620, 200, 50);

      type Projectile = {
        graphic: Graphics;
        vx: number;
        vy: number;
        enemy: boolean;
      };

      const projectiles: Projectile[] = [];

      function createProjectile(
        x: number,
        y: number,
        angle: number,
        enemy = false,
      ) {
        const config = gameConfigRef.current;

        const projectile = new Graphics();

        projectile
          .circle(0, 0, enemy ? 5 : 4)
          .fill(enemy ? 0xff8800 : 0x00ffff);

        projectile.x = x;
        projectile.y = y;

        const speed = enemy
          ? config.shooterProjectileSpeed
          : config.playerProjectileSpeed;

        projectiles.push({
          graphic: projectile,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          enemy,
        });

        pixiApp.stage.addChild(projectile);
      }

      type Enemy = {
        graphic: Graphics;
        type: "chaser" | "shooter";
        speed: number;
        shootTimer: number;
        health: number;
        maxHealth: number;
      };

      const enemies: Enemy[] = [];

      function createChaser() {
        const config = gameConfigRef.current;

        const enemyGraphic = new Graphics();

        enemyGraphic.circle(0, 0, 18).fill(0xff3333);

        enemyGraphic.x = Math.random() * 700 + 50;
        enemyGraphic.y = Math.random() * 300 + 50;

        enemies.push({
          graphic: enemyGraphic,
          type: "chaser",
          speed: config.chaserSpeed,
          shootTimer: 0,
          health: config.chaserMaxHealth,
          maxHealth: config.chaserMaxHealth,
        });

        pixiApp.stage.addChild(enemyGraphic);
      }

      function createShooter() {
        const config = gameConfigRef.current;

        const enemyGraphic = new Graphics();

        enemyGraphic.circle(0, 0, 18).fill(0xff8800);

        enemyGraphic.x = Math.random() * 700 + 50;
        enemyGraphic.y = Math.random() * 300 + 50;

        enemies.push({
          graphic: enemyGraphic,
          type: "shooter",
          speed: config.shooterSpeed,
          shootTimer: 0,
          health: config.shooterMaxHealth,
          maxHealth: config.shooterMaxHealth,
        });

        pixiApp.stage.addChild(enemyGraphic);
      }

      createChaser();
      createChaser();
      createShooter();

      const keys: Record<string, boolean> = {};

      const handleKeyDown = (event: KeyboardEvent) => {
        keys[event.key.toLowerCase()] = true;

        if (event.key.toLowerCase() === "p") {
          if (!gameOver) {
            paused = !paused;
            pauseText.visible = paused;
          }
        }

        if (event.key === " ") {
          event.preventDefault();
        }
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        keys[event.key.toLowerCase()] = false;
      };

      const handleBlur = () => {
        if (!gameOver) {
          paused = true;
          pauseText.visible = true;
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      window.addEventListener("keyup", handleKeyUp);

      window.addEventListener("blur", handleBlur);

      function distance(x1: number, y1: number, x2: number, y2: number) {
        const dx = x1 - x2;
        const dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);
      }

      function collidesWithIsland(x: number, y: number, radius: number) {
        return islands.some(
          (island) =>
            distance(x, y, island.x, island.y) < radius + island.width / 2,
        );
      }

      function finishGame(reason: string) {
        if (gameOver) {
          return;
        }

        const config = gameConfigRef.current;

        gameOver = true;
        paused = false;

        const duration = config.sessionDuration - timeRemaining;

        finalScoreText.text = `Pontuação: ${score}`;
        gameOverReasonText.text = reason;

        gameOverBackground.visible = true;
        gameOverTitle.visible = true;
        finalScoreText.visible = true;
        gameOverReasonText.visible = true;

        restartButton.visible = true;
        restartText.visible = true;
        menuButton.visible = true;
        menuText.visible = true;

        pixiApp.stage.setChildIndex(
          gameOverBackground,
          pixiApp.stage.children.length - 1,
        );

        pixiApp.stage.setChildIndex(
          gameOverTitle,
          pixiApp.stage.children.length - 1,
        );

        pixiApp.stage.setChildIndex(
          finalScoreText,
          pixiApp.stage.children.length - 1,
        );

        pixiApp.stage.setChildIndex(
          gameOverReasonText,
          pixiApp.stage.children.length - 1,
        );

        pixiApp.stage.setChildIndex(
          restartButton,
          pixiApp.stage.children.length - 1,
        );

        pixiApp.stage.setChildIndex(
          restartText,
          pixiApp.stage.children.length - 1,
        );

        pixiApp.stage.setChildIndex(
          menuButton,
          pixiApp.stage.children.length - 1,
        );

        pixiApp.stage.setChildIndex(
          menuText,
          pixiApp.stage.children.length - 1,
        );

        const result = {
          player: "Captain Bueno",
          score,
          duration,
          reason,
          date: new Date().toISOString(),
        };

        submitHistory(result)
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["history"],
            });

            queryClient.invalidateQueries({
              queryKey: ["ranking"],
            });
          })

          .catch((error) => console.error("Erro ao salvar histórico:", error));

        if (score > 0) {
          submitScore("Captain Bueno", score).catch((error) =>
            console.error("Erro ao enviar pontuação:", error),
          );
        }
      }

      function resetGame() {
        const config = gameConfigRef.current;

        health = config.playerMaxHealth;
        score = 0;
        timeRemaining = config.sessionDuration;
        gameTimer = 0;
        enemySpawnTimer = 0;
        gameOver = false;
        paused = false;

        player.x = 400;
        player.y = 500;
        player.rotation = 0;

        healthText.text = `Vida: ${health}`;
        scoreText.text = "Pontuação: 0";
        timerText.text = `Tempo: ${timeRemaining}`;

        pauseText.visible = false;

        gameOverBackground.visible = false;
        gameOverTitle.visible = false;
        finalScoreText.visible = false;
        gameOverReasonText.visible = false;

        restartButton.visible = false;
        restartText.visible = false;
        menuButton.visible = false;
        menuText.visible = false;

        for (const projectile of projectiles) {
          projectile.graphic.destroy();
        }

        projectiles.length = 0;

        for (const enemy of enemies) {
          enemy.graphic.destroy();
        }

        enemies.length = 0;

        createChaser();
        createChaser();
        createShooter();

        setShowMenu(false);
        setShowHistory(false);
        setShowOptions(false);
      }

      function returnToMenu() {
        gameOver = true;
        paused = true;

        for (const projectile of projectiles) {
          projectile.graphic.destroy();
        }

        projectiles.length = 0;

        for (const enemy of enemies) {
          enemy.graphic.destroy();
        }

        enemies.length = 0;

        gameOverBackground.visible = false;
        gameOverTitle.visible = false;
        finalScoreText.visible = false;
        gameOverReasonText.visible = false;

        restartButton.visible = false;
        restartText.visible = false;
        menuButton.visible = false;
        menuText.visible = false;

        pauseText.visible = true;

        setShowMenu(true);
        setShowHistory(false);
        setShowOptions(false);
      }

      restartButton.on("pointerdown", () => resetGame());

      menuButton.on("pointerdown", () => returnToMenu());

      const startGame = () => resetGame();

      window.addEventListener("start-game", startGame);

      pixiApp.ticker.add((ticker) => {
        if (gameOver || paused) {
          return;
        }

        const config = gameConfigRef.current;

        const deltaTime = ticker.deltaTime;
        const deltaSeconds = ticker.deltaMS / 1000;

        const rotationSpeed = config.playerRotationSpeed;

        const movementSpeed = config.playerSpeed;

        if (keys["arrowleft"] || keys["a"]) {
          player.rotation -= rotationSpeed * deltaTime;
        }

        if (keys["arrowright"] || keys["d"]) {
          player.rotation += rotationSpeed * deltaTime;
        }

        let moveX = 0;
        let moveY = 0;

        if (keys["arrowup"] || keys["w"]) {
          moveX = Math.sin(player.rotation) * movementSpeed * deltaTime;

          moveY = -Math.cos(player.rotation) * movementSpeed * deltaTime;
        }

        const nextPlayerX = player.x + moveX;

        const nextPlayerY = player.y + moveY;

        if (
          nextPlayerX > 20 &&
          nextPlayerX < 780 &&
          !collidesWithIsland(nextPlayerX, player.y, 20)
        ) {
          player.x = nextPlayerX;
        }

        if (
          nextPlayerY > 20 &&
          nextPlayerY < 580 &&
          !collidesWithIsland(player.x, nextPlayerY, 20)
        ) {
          player.y = nextPlayerY;
        }

        if (keys[" "]) {
          keys[" "] = false;

          createProjectile(player.x, player.y, player.rotation - Math.PI / 2);
        }

        if (keys["q"]) {
          keys["q"] = false;

          const sideAngle = player.rotation - Math.PI;

          for (let i = -1; i <= 1; i++) {
            createProjectile(player.x, player.y, sideAngle + i * 0.08);
          }
        }

        if (keys["e"]) {
          keys["e"] = false;

          const sideAngle = player.rotation;

          for (let i = -1; i <= 1; i++) {
            createProjectile(player.x, player.y, sideAngle + i * 0.08);
          }
        }

        for (let i = projectiles.length - 1; i >= 0; i--) {
          const projectile = projectiles[i];

          projectile.graphic.x += projectile.vx * deltaTime;

          projectile.graphic.y += projectile.vy * deltaTime;

          if (
            projectile.graphic.x < -20 ||
            projectile.graphic.x > 820 ||
            projectile.graphic.y < -20 ||
            projectile.graphic.y > 620
          ) {
            projectile.graphic.destroy();
            projectiles.splice(i, 1);
            continue;
          }

          if (
            collidesWithIsland(projectile.graphic.x, projectile.graphic.y, 5)
          ) {
            projectile.graphic.destroy();
            projectiles.splice(i, 1);
            continue;
          }

          if (projectile.enemy) {
            if (
              distance(
                projectile.graphic.x,
                projectile.graphic.y,
                player.x,
                player.y,
              ) < 25
            ) {
              health -= config.shooterDamage;

              healthText.text = `Vida: ${Math.max(health, 0)}`;

              projectile.graphic.destroy();
              projectiles.splice(i, 1);

              if (health <= 0) {
                finishGame("Seu navio foi destruído.");
              }

              continue;
            }
          } else {
            let hitEnemy = false;

            for (
              let enemyIndex = enemies.length - 1;
              enemyIndex >= 0;
              enemyIndex--
            ) {
              const enemy = enemies[enemyIndex];

              if (
                distance(
                  projectile.graphic.x,
                  projectile.graphic.y,
                  enemy.graphic.x,
                  enemy.graphic.y,
                ) < 23
              ) {
                enemy.health -= config.playerProjectileDamage;

                projectile.graphic.destroy();
                projectiles.splice(i, 1);

                if (enemy.health <= 0) {
                  enemy.graphic.destroy();

                  enemies.splice(enemyIndex, 1);

                  score++;

                  scoreText.text = `Pontuação: ${score}`;
                }

                hitEnemy = true;
                break;
              }
            }

            if (hitEnemy) {
              continue;
            }
          }
        }

        for (
          let enemyIndex = enemies.length - 1;
          enemyIndex >= 0;
          enemyIndex--
        ) {
          const enemy = enemies[enemyIndex];

          const dx = player.x - enemy.graphic.x;

          const dy = player.y - enemy.graphic.y;

          const angle = Math.atan2(dy, dx);

          enemy.graphic.rotation = angle;

          if (enemy.type === "chaser") {
            const nextX =
              enemy.graphic.x + Math.cos(angle) * enemy.speed * deltaTime;

            const nextY =
              enemy.graphic.y + Math.sin(angle) * enemy.speed * deltaTime;

            if (!collidesWithIsland(nextX, nextY, 18)) {
              enemy.graphic.x = nextX;

              enemy.graphic.y = nextY;
            }

            if (
              distance(enemy.graphic.x, enemy.graphic.y, player.x, player.y) <
              35
            ) {
              health -= config.chaserDamage;

              healthText.text = `Vida: ${Math.max(health, 0)}`;

              enemy.graphic.destroy();

              enemies.splice(enemyIndex, 1);

              if (health <= 0) {
                finishGame("Seu navio foi destruído.");
              }

              continue;
            }
          }

          if (enemy.type === "shooter") {
            const currentDistance = distance(
              enemy.graphic.x,
              enemy.graphic.y,
              player.x,
              player.y,
            );

            if (currentDistance > config.shooterAttackRange) {
              const nextX =
                enemy.graphic.x + Math.cos(angle) * enemy.speed * deltaTime;

              const nextY =
                enemy.graphic.y + Math.sin(angle) * enemy.speed * deltaTime;

              if (!collidesWithIsland(nextX, nextY, 18)) {
                enemy.graphic.x = nextX;

                enemy.graphic.y = nextY;
              }
            }

            enemy.shootTimer += deltaSeconds;

            if (
              currentDistance <= config.shooterAttackRange &&
              enemy.shootTimer >= config.shooterProjectileCooldown
            ) {
              enemy.shootTimer = 0;

              createProjectile(enemy.graphic.x, enemy.graphic.y, angle, true);
            }
          }
        }

        gameTimer += deltaSeconds;

        if (gameTimer >= 1) {
          gameTimer -= 1;
          timeRemaining--;

          timerText.text = `Tempo: ${timeRemaining}`;

          if (timeRemaining <= 0) {
            finishGame("O tempo acabou.");
          }
        }

        enemySpawnTimer += deltaSeconds;

        if (enemySpawnTimer >= config.enemySpawnInterval) {
          enemySpawnTimer -= config.enemySpawnInterval;

          if (Math.random() < 0.5) {
            createChaser();
          } else {
            createShooter();
          }
        }
      });

      return () => {
        window.removeEventListener("keydown", handleKeyDown);

        window.removeEventListener("keyup", handleKeyUp);

        window.removeEventListener("blur", handleBlur);

        window.removeEventListener("start-game", startGame);

        restartButton.removeAllListeners();
        menuButton.removeAllListeners();

        pixiApp.destroy(true);
      };
    };

    initializeGame();

    return () => {
      destroyed = true;
      pixiApp.destroy(true);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07111d",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showMenu && (
        <section
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10,
            background: "linear-gradient(180deg,#07111d,#12304a)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            overflowY: "auto",
            padding: 30,
          }}
        >
          <h1
            style={{
              fontSize: 56,
              margin: 0,
            }}
          >
            PIRATE BATTLE
          </h1>

          <p
            style={{
              fontSize: 20,
              margin: 0,
            }}
          >
            Batalha naval em alto-mar
          </p>

          <button
            onClick={() => window.dispatchEvent(new Event("start-game"))}
            style={{
              padding: "15px 50px",
              fontSize: 22,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            JOGAR
          </button>

          <button
            onClick={() => setShowOptions(true)}
            style={{
              padding: "10px 35px",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            OPÇÕES
          </button>

          <button
            onClick={() => {
              setShowHistory(true);
            }}
            style={{
              padding: "10px 35px",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            HISTÓRICO DE PARTIDAS
          </button>

          <div
            style={{
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            <strong>Controles</strong>

            <div>W / ↑ — mover</div>

            <div>A / D — girar</div>

            <div>Espaço — tiro frontal</div>

            <div>Q — tiros laterais à esquerda</div>

            <div>E — tiros laterais à direita</div>

            <div>P — pausar</div>
          </div>

          <Ranking />
        </section>
      )}

      {showOptions && (
        <Options
          config={gameConfig}
          onSave={handleSaveConfig}
          onBack={() => setShowOptions(false)}
        />
      )}

      {showHistory && (
        <section
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            background: "#07111d",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 40,
            overflowY: "auto",
          }}
        >
          <h2>HISTÓRICO DE PARTIDAS</h2>

          {history.length === 0 ? (
            <p>Nenhuma partida registrada.</p>
          ) : (
            <>
              <div
                style={{
                  width: "100%",
                  maxWidth: 700,
                }}
              >
                {history.map((result, index) => (
                  <div
                    key={result.id}
                    style={{
                      border: "1px solid #345",
                      borderRadius: 8,
                      padding: 15,
                      marginBottom: 10,
                      background: "#102233",
                    }}
                  >
                    <strong>
                      Partida #{(historyPage - 1) * 5 + index + 1}
                    </strong>

                    <div>Pontuação: {result.score}</div>
                    <div>Duração: {result.duration}s</div>
                    <div>Resultado: {result.reason}</div>

                    <div
                      style={{
                        fontSize: 13,
                        opacity: 0.7,
                        marginTop: 5,
                      }}
                    >
                      {new Date(result.date).toLocaleString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 10,
                }}
              >
                <button
                  disabled={historyPage === 1}
                  onClick={() => setHistoryPage((current) => current - 1)}
                >
                  Anterior
                </button>

                <span>
                  Página {historyQuery.data?.page ?? historyPage} de{" "}
                  {historyQuery.data?.totalPages ?? 1}
                </span>

                <button
                  disabled={historyPage >= (historyQuery.data?.totalPages ?? 1)}
                  onClick={() => setHistoryPage((current) => current + 1)}
                >
                  Próxima
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => {
              setShowHistory(false);
              setHistoryPage(1);
            }}
            style={{
              marginTop: 20,
              padding: "10px 30px",
              cursor: "pointer",
            }}
          >
            MENU PRINCIPAL
          </button>
        </section>
      )}

      <div
        ref={gameContainerRef}
        style={{
          width: 800,
          height: 600,
        }}
      />

      <p
        style={{
          opacity: 0.6,
          marginTop: 10,
        }}
      >
        PixiJS + React + TypeScript
      </p>
    </div>
  );
}

export default App;
