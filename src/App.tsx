import { useEffect, useRef, useState } from 'react'
import { Application, Graphics, Text } from 'pixi.js'

type MatchResult = {
  id: string
  score: number
  duration: number
  reason: string
  createdAt: string
}

const HISTORY_KEY = 'pirate-battle-history'

function saveMatchResult(result: MatchResult) {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)

    const history: MatchResult[] = stored
      ? JSON.parse(stored)
      : []

    history.unshift(result)

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, 20)),
    )

    console.log('Resultado salvo:', result)
  } catch (error) {
    console.error('Erro ao salvar resultado:', error)
  }
}

function getMatchHistory(): MatchResult[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)

    if (!stored) {
      return []
    }

    return JSON.parse(stored)
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

function App() {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)

  const [showMenu, setShowMenu] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<MatchResult[]>([])

  useEffect(() => {
    if (!gameContainerRef.current) {
      return
    }

    const container = gameContainerRef.current
    const pixiApp = new Application()

    let destroyed = false

    const initializeGame = async () => {
      await pixiApp.init({
        width: 800,
        height: 600,
        backgroundColor: 0x0b1726,
        antialias: true,
      })

      if (destroyed) {
        pixiApp.destroy(true)
        return
      }

      container.appendChild(pixiApp.canvas)

      /*
       * =========================
       * ESTADO DO JOGO
       * =========================
       */

      let health = 100
      let score = 0
      let timeRemaining = 60

      let paused = true
      let gameOver = false

      let gameTimer = 0
      let shooterTimer = 0

      /*
       * =========================
       * HUD
       * =========================
       */

      const healthText = new Text({
        text: 'Vida: 100',
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      })

      healthText.x = 20
      healthText.y = 20

      const scoreText = new Text({
        text: 'Pontos: 0',
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      })

      scoreText.x = 20
      scoreText.y = 50

      const timerText = new Text({
        text: 'Tempo: 60',
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      })

      timerText.x = 20
      timerText.y = 80

      pixiApp.stage.addChild(
        healthText,
        scoreText,
        timerText,
      )

      /*
       * =========================
       * PAUSE
       * =========================
       */

      const pauseText = new Text({
        text: 'PAUSADO',
        style: {
          fill: 0xffffff,
          fontSize: 48,
          fontWeight: 'bold',
        },
      })

      pauseText.anchor.set(0.5)
      pauseText.x = 400
      pauseText.y = 300
      pauseText.visible = true

      pixiApp.stage.addChild(pauseText)

      /*
       * =========================
       * GAME OVER
       * =========================
       */

      const gameOverBackground = new Graphics()

      gameOverBackground
        .rect(150, 110, 500, 390)
        .fill({
          color: 0x000000,
          alpha: 0.9,
        })

      gameOverBackground.visible = false

      pixiApp.stage.addChild(gameOverBackground)

      const gameOverTitle = new Text({
        text: 'FIM DE JOGO',
        style: {
          fill: 0xffffff,
          fontSize: 42,
          fontWeight: 'bold',
        },
      })

      gameOverTitle.anchor.set(0.5)
      gameOverTitle.x = 400
      gameOverTitle.y = 170
      gameOverTitle.visible = false

      pixiApp.stage.addChild(gameOverTitle)

      const finalScoreText = new Text({
        text: 'Pontuação: 0',
        style: {
          fill: 0xffffff,
          fontSize: 26,
        },
      })

      finalScoreText.anchor.set(0.5)
      finalScoreText.x = 400
      finalScoreText.y = 230
      finalScoreText.visible = false

      pixiApp.stage.addChild(finalScoreText)

      const gameOverReasonText = new Text({
        text: '',
        style: {
          fill: 0xffffff,
          fontSize: 20,
        },
      })

      gameOverReasonText.anchor.set(0.5)
      gameOverReasonText.x = 400
      gameOverReasonText.y = 270
      gameOverReasonText.visible = false

      pixiApp.stage.addChild(gameOverReasonText)

      /*
       * BOTÃO JOGAR NOVAMENTE
       */

      const restartButton = new Graphics()

      restartButton
        .roundRect(270, 320, 260, 60, 10)
        .fill(0x1976d2)

      restartButton.eventMode = 'static'
      restartButton.cursor = 'pointer'
      restartButton.visible = false

      pixiApp.stage.addChild(restartButton)

      const restartText = new Text({
        text: 'JOGAR NOVAMENTE',
        style: {
          fill: 0xffffff,
          fontSize: 20,
          fontWeight: 'bold',
        },
      })

      restartText.anchor.set(0.5)
      restartText.x = 400
      restartText.y = 350
      restartText.visible = false

      pixiApp.stage.addChild(restartText)

      /*
       * BOTÃO VOLTAR AO MENU
       */

      const menuButton = new Graphics()

      menuButton
        .roundRect(270, 400, 260, 60, 10)
        .fill(0x455a64)

      menuButton.eventMode = 'static'
      menuButton.cursor = 'pointer'
      menuButton.visible = false

      pixiApp.stage.addChild(menuButton)

      const menuText = new Text({
        text: 'VOLTAR AO MENU',
        style: {
          fill: 0xffffff,
          fontSize: 20,
          fontWeight: 'bold',
        },
      })

      menuText.anchor.set(0.5)
      menuText.x = 400
      menuText.y = 430
      menuText.visible = false

      pixiApp.stage.addChild(menuText)

      /*
       * =========================
       * PLAYER
       * =========================
       */

      const player = new Graphics()

      player
        .moveTo(0, -20)
        .lineTo(15, 20)
        .lineTo(0, 12)
        .lineTo(-15, 20)
        .closePath()
        .fill(0x00aaff)

      player.x = 400
      player.y = 500

      pixiApp.stage.addChild(player)

      /*
       * =========================
       * ILHAS
       * =========================
       */

      const islands: Graphics[] = []

      function createIsland(
        x: number,
        y: number,
        radius: number,
      ) {
        const island = new Graphics()

        island
          .circle(0, 0, radius)
          .fill(0x4f6f3f)

        island.x = x
        island.y = y

        pixiApp.stage.addChild(island)

        islands.push(island)
      }

      createIsland(400, 350, 55)
      createIsland(200, 180, 45)
      createIsland(620, 200, 50)

      /*
       * =========================
       * PROJÉTEIS
       * =========================
       */

      type Projectile = {
        graphic: Graphics
        vx: number
        vy: number
        enemy: boolean
      }

      const projectiles: Projectile[] = []

      function createProjectile(
        x: number,
        y: number,
        angle: number,
        enemy = false,
      ) {
        const projectile = new Graphics()

        projectile
          .circle(0, 0, enemy ? 5 : 4)
          .fill(enemy ? 0xff8800 : 0x00ffff)

        projectile.x = x
        projectile.y = y

        const speed = enemy ? 4 : 7

        projectiles.push({
          graphic: projectile,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          enemy,
        })

        pixiApp.stage.addChild(projectile)
      }

      /*
       * =========================
       * INIMIGOS
       * =========================
       */

      type Enemy = {
        graphic: Graphics
        type: 'chaser' | 'shooter'
        speed: number
        shootTimer: number
      }

      const enemies: Enemy[] = []

      function createChaser() {
        const enemyGraphic = new Graphics()

        enemyGraphic
          .circle(0, 0, 18)
          .fill(0xff3333)

        enemyGraphic.x = Math.random() * 700 + 50
        enemyGraphic.y = Math.random() * 300 + 50

        enemies.push({
          graphic: enemyGraphic,
          type: 'chaser',
          speed: 1.2,
          shootTimer: 0,
        })

        pixiApp.stage.addChild(enemyGraphic)
      }

      function createShooter() {
        const enemyGraphic = new Graphics()

        enemyGraphic
          .circle(0, 0, 18)
          .fill(0xff8800)

        enemyGraphic.x = Math.random() * 700 + 50
        enemyGraphic.y = Math.random() * 300 + 50

        enemies.push({
          graphic: enemyGraphic,
          type: 'shooter',
          speed: 0.5,
          shootTimer: 0,
        })

        pixiApp.stage.addChild(enemyGraphic)
      }

      createChaser()
      createChaser()
      createShooter()

      /*
       * =========================
       * CONTROLES
       * =========================
       */

      const keys: Record<string, boolean> = {}

      const handleKeyDown = (
        event: KeyboardEvent,
      ) => {
        keys[event.key.toLowerCase()] = true

        if (event.key.toLowerCase() === 'p') {
          if (!gameOver) {
            paused = !paused
            pauseText.visible = paused
          }
        }

        if (event.key === ' ') {
          event.preventDefault()
        }
      }

      const handleKeyUp = (
        event: KeyboardEvent,
      ) => {
        keys[event.key.toLowerCase()] = false
      }

      const handleBlur = () => {
        if (!gameOver) {
          paused = true
          pauseText.visible = true
        }
      }

      window.addEventListener(
        'keydown',
        handleKeyDown,
      )

      window.addEventListener(
        'keyup',
        handleKeyUp,
      )

      window.addEventListener(
        'blur',
        handleBlur,
      )

      /*
       * =========================
       * COLISÃO
       * =========================
       */

      function distance(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) {
        const dx = x1 - x2
        const dy = y1 - y2

        return Math.sqrt(
          dx * dx + dy * dy,
        )
      }

      function collidesWithIsland(
        x: number,
        y: number,
        radius: number,
      ) {
        return islands.some((island) => {
          return (
            distance(
              x,
              y,
              island.x,
              island.y,
            ) <
            radius + island.width / 2
          )
        })
      }

      /*
       * =========================
       * GAME OVER
       * =========================
       */

      function finishGame(
        reason: string,
      ) {
        if (gameOver) {
          return
        }

        gameOver = true
        paused = false

        const duration =
          60 - timeRemaining

        finalScoreText.text =
          `Pontuação: ${score}`

        gameOverReasonText.text =
          reason

        gameOverBackground.visible = true
        gameOverTitle.visible = true
        finalScoreText.visible = true
        gameOverReasonText.visible = true

        restartButton.visible = true
        restartText.visible = true

        menuButton.visible = true
        menuText.visible = true

        /*
         * Salva resultado.
         */

        const result: MatchResult = {
          id: Date.now().toString(),
          score,
          duration,
          reason,
          createdAt:
            new Date().toISOString(),
        }

        saveMatchResult(result)

        setHistory(getMatchHistory())
      }

      /*
       * =========================
       * VOLTAR AO MENU
       * =========================
       */

      function returnToMenu() {
        gameOver = true
        paused = true

        /*
         * Remove projéteis.
         */

        for (const projectile of projectiles) {
          projectile.graphic.destroy()
        }

        projectiles.length = 0

        /*
         * Remove inimigos.
         */

        for (const enemy of enemies) {
          enemy.graphic.destroy()
        }

        enemies.length = 0

        /*
         * Esconde a tela de game over.
         */

        gameOverBackground.visible = false
        gameOverTitle.visible = false
        finalScoreText.visible = false
        gameOverReasonText.visible = false

        restartButton.visible = false
        restartText.visible = false

        menuButton.visible = false
        menuText.visible = false

        pauseText.visible = true

        /*
         * Mostra o menu React.
         */

        setShowMenu(true)
      }

      /*
       * =========================
       * RESET
       * =========================
       */

      function resetGame() {
        health = 100
        score = 0
        timeRemaining = 60

        gameTimer = 0
        shooterTimer = 0

        gameOver = false
        paused = false

        player.x = 400
        player.y = 500
        player.rotation = 0

        healthText.text = 'Vida: 100'
        scoreText.text = 'Pontos: 0'
        timerText.text = 'Tempo: 60'

        pauseText.visible = false

        gameOverBackground.visible = false
        gameOverTitle.visible = false
        finalScoreText.visible = false
        gameOverReasonText.visible = false

        restartButton.visible = false
        restartText.visible = false

        menuButton.visible = false
        menuText.visible = false

        /*
         * Remove projéteis.
         */

        for (const projectile of projectiles) {
          projectile.graphic.destroy()
        }

        projectiles.length = 0

        /*
         * Remove inimigos.
         */

        for (const enemy of enemies) {
          enemy.graphic.destroy()
        }

        enemies.length = 0

        /*
         * Cria novos inimigos.
         */

        createChaser()
        createChaser()
        createShooter()

        setShowMenu(false)
      }

      /*
       * =========================
       * BOTÕES
       * =========================
       */

      restartButton.on(
        'pointerdown',
        () => {
          resetGame()
        },
      )

      menuButton.on(
        'pointerdown',
        () => {
          returnToMenu()
        },
      )

      /*
       * =========================
       * START GAME
       * =========================
       */

      const startGame = () => {
        paused = false
        pauseText.visible = false

        setShowMenu(false)
      }

      window.addEventListener(
        'start-game',
        startGame,
      )

      /*
       * =========================
       * GAME LOOP
       * =========================
       */

      pixiApp.ticker.add((ticker) => {
        if (gameOver || paused) {
          return
        }

        const deltaTime =
          ticker.deltaTime

        /*
         * PLAYER
         */

        const rotationSpeed = 0.05
        const movementSpeed = 3

        if (
          keys['arrowleft'] ||
          keys['a']
        ) {
          player.rotation -=
            rotationSpeed *
            deltaTime
        }

        if (
          keys['arrowright'] ||
          keys['d']
        ) {
          player.rotation +=
            rotationSpeed *
            deltaTime
        }

        let moveX = 0
        let moveY = 0

        if (
          keys['arrowup'] ||
          keys['w']
        ) {
          moveX =
            Math.sin(player.rotation) *
            movementSpeed *
            deltaTime

          moveY =
            -Math.cos(player.rotation) *
            movementSpeed *
            deltaTime
        }

        const nextPlayerX =
          player.x + moveX

        const nextPlayerY =
          player.y + moveY

        if (
          nextPlayerX > 20 &&
          nextPlayerX < 780 &&
          !collidesWithIsland(
            nextPlayerX,
            player.y,
            20,
          )
        ) {
          player.x = nextPlayerX
        }

        if (
          nextPlayerY > 20 &&
          nextPlayerY < 580 &&
          !collidesWithIsland(
            player.x,
            nextPlayerY,
            20,
          )
        ) {
          player.y = nextPlayerY
        }

        /*
         * TIRO FRONTAL
         */

        if (keys[' ']) {
          keys[' '] = false

          createProjectile(
            player.x,
            player.y,
            player.rotation -
              Math.PI / 2,
          )
        }

        /*
         * TIRO LATERAL ESQUERDO
         */

        if (keys['q']) {
          keys['q'] = false

          const sideAngle =
            player.rotation - Math.PI

          for (let i = -1; i <= 1; i++) {
            createProjectile(
              player.x,
              player.y,
              sideAngle + i * 0.08,
            )
          }
        }

        /*
         * TIRO LATERAL DIREITO
         */

        if (keys['e']) {
          keys['e'] = false

          const sideAngle =
            player.rotation

          for (let i = -1; i <= 1; i++) {
            createProjectile(
              player.x,
              player.y,
              sideAngle + i * 0.08,
            )
          }
        }

        /*
         * PROJÉTEIS
         */

        for (
          let i = projectiles.length - 1;
          i >= 0;
          i--
        ) {
          const projectile =
            projectiles[i]

          projectile.graphic.x +=
            projectile.vx *
            deltaTime

          projectile.graphic.y +=
            projectile.vy *
            deltaTime

          /*
           * Saiu da tela.
           */

          if (
            projectile.graphic.x < -20 ||
            projectile.graphic.x > 820 ||
            projectile.graphic.y < -20 ||
            projectile.graphic.y > 620
          ) {
            projectile.graphic.destroy()

            projectiles.splice(i, 1)

            continue
          }

          /*
           * Colisão com ilha.
           */

          if (
            collidesWithIsland(
              projectile.graphic.x,
              projectile.graphic.y,
              5,
            )
          ) {
            projectile.graphic.destroy()

            projectiles.splice(i, 1)

            continue
          }

          /*
           * Projétil inimigo contra player.
           */

          if (projectile.enemy) {
            if (
              distance(
                projectile.graphic.x,
                projectile.graphic.y,
                player.x,
                player.y,
              ) < 25
            ) {
              health -= 10

              healthText.text =
                `Vida: ${Math.max(
                  health,
                  0,
                )}`

              projectile.graphic.destroy()

              projectiles.splice(i, 1)

              if (health <= 0) {
                finishGame(
                  'Seu navio foi destruído.',
                )
              }

              continue
            }
          } else {
            /*
             * Projétil do player contra inimigos.
             */

            let hitEnemy = false

            for (
              let enemyIndex =
                enemies.length - 1;
              enemyIndex >= 0;
              enemyIndex--
            ) {
              const enemy =
                enemies[enemyIndex]

              if (
                distance(
                  projectile.graphic.x,
                  projectile.graphic.y,
                  enemy.graphic.x,
                  enemy.graphic.y,
                ) < 23
              ) {
                enemy.graphic.destroy()

                enemies.splice(
                  enemyIndex,
                  1,
                )

                projectile.graphic.destroy()

                projectiles.splice(
                  i,
                  1,
                )

                score++

                scoreText.text =
                  `Pontos: ${score}`

                hitEnemy = true

                break
              }
            }

            if (hitEnemy) {
              continue
            }
          }
        }

        /*
         * INIMIGOS
         */

        for (const enemy of enemies) {
          const dx =
            player.x -
            enemy.graphic.x

          const dy =
            player.y -
            enemy.graphic.y

          const angle =
            Math.atan2(dy, dx)

          /*
           * CHASER
           */

          if (enemy.type === 'chaser') {
            const nextX =
              enemy.graphic.x +
              Math.cos(angle) *
                enemy.speed *
                deltaTime

            const nextY =
              enemy.graphic.y +
              Math.sin(angle) *
                enemy.speed *
                deltaTime

            if (
              !collidesWithIsland(
                nextX,
                nextY,
                18,
              )
            ) {
              enemy.graphic.x = nextX
              enemy.graphic.y = nextY
            }

            /*
             * Colisão direta com player.
             */

            if (
              distance(
                enemy.graphic.x,
                enemy.graphic.y,
                player.x,
                player.y,
              ) < 35
            ) {
              health -= 20

              healthText.text =
                `Vida: ${Math.max(
                  health,
                  0,
                )}`

              enemy.graphic.x =
                Math.random() *
                  700 +
                50

              enemy.graphic.y =
                Math.random() *
                  300 +
                50

              if (health <= 0) {
                finishGame(
                  'Seu navio foi destruído.',
                )
              }
            }
          }

          /*
           * SHOOTER
           */

          if (enemy.type === 'shooter') {
            enemy.shootTimer +=
              deltaTime

            if (
              enemy.shootTimer > 90
            ) {
              enemy.shootTimer = 0

              createProjectile(
                enemy.graphic.x,
                enemy.graphic.y,
                angle,
                true,
              )
            }
          }
        }

        /*
         * TIMER
         */

        gameTimer += deltaTime

        if (gameTimer >= 60) {
          gameTimer = 0
          timeRemaining--

          timerText.text =
            `Tempo: ${timeRemaining}`

          if (timeRemaining <= 0) {
            finishGame(
              'Tempo esgotado.',
            )
          }
        }

        /*
         * Reposição dos inimigos.
         */

        if (enemies.length < 3) {
          createChaser()
        }
      })

      /*
       * =========================
       * LIMPEZA
       * =========================
       */

      return () => {
        window.removeEventListener(
          'keydown',
          handleKeyDown,
        )

        window.removeEventListener(
          'keyup',
          handleKeyUp,
        )

        window.removeEventListener(
          'blur',
          handleBlur,
        )

        window.removeEventListener(
          'start-game',
          startGame,
        )

        restartButton.removeAllListeners()
        menuButton.removeAllListeners()

        pixiApp.destroy(true)
      }
    }

    initializeGame()

    return () => {
      destroyed = true

      if (pixiApp) {
        pixiApp.destroy(true)
      }
    }
  }, [])

  /*
   * =========================
   * CARREGAR HISTÓRICO
   * =========================
   */

  useEffect(() => {
    setHistory(getMatchHistory())
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07111d',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      /*
       * =========================
       * MENU PRINCIPAL
       * =========================
       */

      {showMenu && (
        <section
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            background:
              'linear-gradient(180deg, #07111d, #12304a)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
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
            onClick={() => {
              window.dispatchEvent(
                new Event('start-game'),
              )
            }}
            style={{
              padding: '15px 50px',
              fontSize: 22,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            JOGAR
          </button>

          <button
            onClick={() => {
              setHistory(
                getMatchHistory(),
              )

              setShowHistory(true)
            }}
            style={{
              padding: '10px 35px',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            HISTÓRICO
          </button>

          <div
            style={{
              textAlign: 'center',
              lineHeight: 1.7,
            }}
          >
            <strong>Controles</strong>

            <div>W / ↑ — mover</div>
            <div>A / D — girar</div>
            <div>
              Espaço — tiro frontal
            </div>
            <div>
              Q — tiros laterais esquerdos
            </div>
            <div>
              E — tiros laterais direitos
            </div>
            <div>P — pausar</div>
          </div>
        </section>
      )}

      /*
       * =========================
       * HISTÓRICO
       * =========================
       */

      {showHistory && (
        <section
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20,
            background: '#07111d',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 40,
            overflowY: 'auto',
          }}
        >
          <h2>
            HISTÓRICO DE PARTIDAS
          </h2>

          {history.length === 0 ? (
            <p>
              Nenhuma partida registrada
              ainda.
            </p>
          ) : (
            <div
              style={{
                width: '100%',
                maxWidth: 700,
              }}
            >
              {history.map(
                (result, index) => (
                  <div
                    key={result.id}
                    style={{
                      border:
                        '1px solid #345',
                      borderRadius: 8,
                      padding: 15,
                      marginBottom: 10,
                      background:
                        '#102233',
                    }}
                  >
                    <strong>
                      Partida #{index + 1}
                    </strong>

                    <div>
                      Pontuação:{' '}
                      {result.score}
                    </div>

                    <div>
                      Duração:{' '}
                      {result.duration}s
                    </div>

                    <div>
                      Resultado:{' '}
                      {result.reason}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        opacity: 0.7,
                        marginTop: 5,
                      }}
                    >
                      {new Date(
                        result.createdAt,
                      ).toLocaleString(
                        'pt-BR',
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          <button
            onClick={() => {
              setShowHistory(false)
            }}
            style={{
              marginTop: 20,
              padding: '10px 30px',
              cursor: 'pointer',
            }}
          >
            VOLTAR AO MENU
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
  )
}

export default App