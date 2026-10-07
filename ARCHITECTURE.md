# 🏗️ Pirate Battle — Architecture

## 1. Visão geral

O Pirate Battle utiliza uma arquitetura híbrida combinando **React** para a interface da aplicação e **PixiJS** para o gameplay 2D.

A separação permite que cada tecnologia seja utilizada na responsabilidade em que apresenta maior vantagem:

* **React:** menus, telas, HUD, ranking, histórico e opções.
* **PixiJS:** renderização, game loop, movimentação, colisões, inimigos e projéteis.
* **TanStack Query:** gerenciamento das requisições e estado assíncrono.
* **Axios:** comunicação HTTP.
* **MSW:** simulação da API.
* **Playwright:** testes E2E e regressão visual.

Visão simplificada:

```text
┌─────────────────────────────────────┐
│               React                 │
│                                     │
│  Menu │ HUD │ Result │ History      │
│                                     │
│  Ranking │ Options                  │
└──────────────┬──────────────────────┘
               │
       ┌───────▼────────┐
       │     PixiJS     │
       │                │
       │   Game Loop    │
       │   Player       │
       │   Enemies      │
       │   Projectiles  │
       │   Obstacles    │
       │   Collision    │
       └────────────────┘

React
  │
  ▼
TanStack Query
  │
  ▼
Axios
  │
  ▼
REST API / MSW
```

---

## 2. Estrutura de responsabilidades

### React

React controla o estado de alto nível da aplicação e a interface HTML.

Responsabilidades:

* Tela inicial
* Início da partida
* Tela de resultado
* Histórico
* Ranking
* Opções
* Botões de navegação
* HUD complementar
* Fluxo de reinício

O React não controla diretamente cada atualização de posição das entidades do jogo.

---

## 3. PixiJS

PixiJS é responsável pelo ambiente de renderização 2D e pelo gameplay.

Responsabilidades:

* Criação do canvas
* Renderização das entidades
* Game loop
* Movimentação do jogador
* Rotação da embarcação
* Movimentação dos inimigos
* Movimentação dos projéteis
* Detecção de colisões
* Criação e remoção de objetos
* Atualização visual do jogo

O gameplay é executado dentro do ciclo de atualização do PixiJS.

Conceitualmente:

```text
Ticker
  │
  ├── Atualiza jogador
  ├── Atualiza inimigos
  ├── Atualiza projéteis
  ├── Verifica colisões
  ├── Atualiza pontuação
  ├── Atualiza vida
  └── Verifica fim da partida
```

---

## 4. Ciclo de vida do PixiJS

A instância do PixiJS é criada quando uma partida é inicializada.

Fluxo:

```text
React monta a área do jogo
        │
        ▼
Inicialização do PixiJS
        │
        ▼
Criação do canvas
        │
        ▼
Criação das entidades
        │
        ▼
Game Loop
        │
        ▼
Partida
        │
        ▼
Finalização / retorno ao menu
        │
        ▼
Limpeza dos recursos
```

O canvas é anexado ao elemento destinado ao jogo.

Ao finalizar ou reiniciar uma partida, os recursos relacionados ao gameplay são removidos para evitar múltiplas instâncias do jogo executando simultaneamente.

---

## 5. Game Loop

O jogo utiliza o ticker do PixiJS para atualizar o gameplay continuamente.

A cada atualização são processados:

1. Entrada do jogador
2. Movimento
3. Rotação
4. Movimento dos inimigos
5. Movimento dos projéteis
6. Colisões
7. Vida
8. Pontuação
9. Temporizador
10. Condição de fim da partida

O loop é interrompido durante o estado de pausa.

---

## 6. Jogador

O jogador possui:

* Posição
* Rotação
* Velocidade
* Vida
* Controle de movimento
* Controle de disparo

Controles principais:

```text
W / ↑       → movimentar para frente
A / ←       → girar para esquerda
D / →       → girar para direita
Espaço      → disparo frontal
Q           → disparo lateral esquerdo
E           → disparo lateral direito
P           → pausar
```

A movimentação considera a rotação atual da embarcação para determinar a direção de deslocamento.

---

## 7. Sistema de disparos

Existem dois tipos principais de disparo.

### Disparo frontal

Um projétil é criado na direção frontal da embarcação.

```text
          ↑
          │
          ●
          🚢
```

### Disparos laterais

Os comandos laterais criam múltiplos projéteis.

```text
●
●   🚢
●
```

Os projéteis possuem velocidade própria e são removidos quando deixam de ser necessários.

---

## 8. Inimigos

O jogo possui dois comportamentos principais.

### Chaser

O Chaser persegue diretamente o jogador.

```text
Chaser ─────────► Player
```

Seu comportamento é baseado na direção entre sua posição atual e a posição do jogador.

### Shooter

O Shooter permanece como uma ameaça à distância e dispara projéteis contra o jogador.

```text
Shooter ───► ● ● ● ───► Player
```

---

## 9. Colisões

As colisões são verificadas durante o game loop.

Principais relações:

```text
Player × Enemy
Player × Island
Player × Enemy Projectile
Player Projectile × Enemy
Player Projectile × Obstacle
```

Quando uma colisão relevante é detectada, a consequência correspondente é aplicada.

Exemplos:

* Jogador × inimigo → perda de vida
* Jogador × projétil → perda de vida
* Projétil × inimigo → dano/destruição e aumento da pontuação
* Jogador × obstáculo → impacto/bloqueio

---

## 10. Estado da partida

O fluxo principal da partida pode ser representado por:

```text
MENU
  │
  ▼
PLAYING
  │
  ├──────────────┐
  │              │
  ▼              ▼
PAUSED        GAME OVER
  │              │
  └──► PLAYING   ▼
              RESULT
                │
                ▼
               MENU
```

O estado da partida controla o comportamento da interface e do gameplay.

---

## 11. Pausa

A partida pode ser pausada manualmente utilizando `P`.

Também existe tratamento para perda de foco da janela.

Quando a página perde o foco:

```text
PLAYING
   │
   ▼
PAUSED
```

Isso evita que o gameplay continue avançando enquanto a aplicação não está em primeiro plano.

---

## 12. Temporizador

A partida possui duração configurável.

O temporizador é atualizado durante o estado `PLAYING`.

Quando o tempo chega ao limite:

```text
PLAYING
   │
   ▼
TIME UP
   │
   ▼
GAME OVER
   │
   ▼
RESULT
```

A duração da partida pode ser configurada na tela de opções.

---

## 13. Configuração da partida

As configurações relacionadas ao gameplay são centralizadas em:

```text
src/config/gameConfig.ts
```

O tipo `GameConfig` define os parâmetros utilizados pelo jogo.

Entre eles estão:

* Duração da sessão
* Intervalo de surgimento dos inimigos
* Velocidade do jogador
* Velocidade de rotação
* Vida do jogador
* Velocidade e dano dos projéteis
* Configurações dos inimigos
* Configurações dos projéteis inimigos

A configuração padrão é definida por `defaultGameConfig`.

As opções modificáveis pela interface são persistidas localmente.

---

## 14. Pontuação

A pontuação é incrementada quando inimigos são destruídos.

Fluxo:

```text
Enemy destroyed
       │
       ▼
Score updated
       │
       ▼
Result
```

Ao finalizar a partida, o resultado é enviado para o fluxo de histórico.

Pontuações maiores que zero também podem ser enviadas para o ranking.

---

## 15. Histórico de partidas

O histórico é acessado através da camada de API:

```text
src/api/history.ts
```

O componente utiliza o hook:

```text
src/hooks/useHistory.ts
```

Fluxo:

```text
History Component
       │
       ▼
useHistory()
       │
       ▼
TanStack Query
       │
       ▼
getHistory()
       │
       ▼
Axios
       │
       ▼
MSW
```

Cada resultado contém informações como:

* Jogador
* Pontuação
* Duração
* Motivo do encerramento
* Data

O histórico também possui paginação.

---

## 16. Ranking

O ranking foi separado da lógica de gameplay.

A camada de API possui:

```text
src/api/ranking.ts
```

O acesso aos dados pelo React é realizado através de:

```text
src/hooks/useRanking.ts
```

Fluxo:

```text
Ranking Component
       │
       ▼
useRanking()
       │
       ▼
TanStack Query
       │
       ▼
getRanking()
       │
       ▼
Axios
       │
       ▼
MSW
```

O ranking possui paginação e ordenação por pontuação.

Essa separação permite substituir posteriormente o mock por um backend real com poucas alterações na camada de apresentação.

---

## 17. TanStack Query

TanStack Query é utilizado para controlar o estado assíncrono relacionado ao ranking e ao histórico.

Responsabilidades:

* Buscar dados
* Controlar estado de carregamento
* Controlar erros
* Gerenciar cache
* Invalidar consultas após alterações
* Reutilizar resultados de consultas

Os componentes não precisam conhecer os detalhes da implementação HTTP.

Eles utilizam os hooks:

```text
useRanking()
useHistory()
```

---

## 18. Axios

A configuração central do Axios está localizada em:

```text
src/api/http.ts
```

As operações específicas são separadas em módulos:

```text
src/api/ranking.ts
src/api/history.ts
```

Essa organização evita concentrar toda a comunicação HTTP em um único arquivo e facilita a substituição futura do mock por um backend real.

---

## 19. MSW

O Mock Service Worker é utilizado para simular as respostas da API.

Os handlers estão localizados em:

```text
src/mocks/handlers.ts
```

Atualmente são simuladas operações relacionadas ao ranking e histórico:

```text
GET  /api/ranking
POST /api/ranking

GET  /api/history
POST /api/history
```

Também existe um cenário de erro HTTP 500 para o endpoint de ranking.

O MSW permite desenvolver e testar o frontend sem depender de um backend externo.

---

## 20. Testes E2E

Os testes End-to-End são implementados com Playwright.

A configuração está localizada em:

```text
playwright.config.ts
```

Os testes ficam em:

```text
tests/
├── api-error.spec.ts
├── main-menu.spec.ts
├── options.spec.ts
└── visual.spec.ts
```

Os testes verificam atualmente:

* Carregamento da aplicação
* Exibição do menu principal
* Exibição dos principais botões
* Inicialização de uma partida
* Abertura das opções
* Abertura do ranking
* Abertura do histórico
* Persistência das opções após recarregar a página
* Simulação de erro HTTP 500
* Regressão visual do menu principal

Resultado atual:

```text
8 passed
```

---

## 21. Regressão visual

O projeto possui um teste de snapshot visual utilizando Playwright.

O teste está localizado em:

```text
tests/visual.spec.ts
```

O snapshot atual está em:

```text
tests/visual.spec.ts-snapshots/
└── main-menu-chromium-win32.png
```

O objetivo é detectar alterações visuais inesperadas no menu principal.

Os snapshots podem ser atualizados utilizando:

```bash
npm run test:e2e:update
```

---

## 22. Separação de responsabilidades

A aplicação procura manter as seguintes responsabilidades separadas:

| Camada         | Responsabilidade               |
| -------------- | ------------------------------ |
| React          | Interface e fluxo da aplicação |
| PixiJS         | Gameplay e renderização 2D     |
| TanStack Query | Estado assíncrono              |
| Axios          | Comunicação HTTP               |
| MSW            | Mock da API                    |
| localStorage   | Persistência de configurações  |
| Playwright     | Testes E2E e regressão visual  |

Essa divisão reduz o acoplamento entre interface, gameplay e comunicação externa.

---

## 23. Performance

Como o gameplay utiliza renderização em tempo real, alguns cuidados foram considerados:

* Atualização das entidades dentro do ticker do PixiJS
* Remoção de projéteis que deixam de ser necessários
* Evitar múltiplos loops simultâneos
* Separação entre React e atualização contínua do gameplay
* Limpeza dos recursos do PixiJS ao finalizar a partida

A interface React não precisa ser renderizada novamente a cada frame do jogo.

---

## 24. Possível evolução

A arquitetura permite futuras melhorias, como:

* Separação das entidades do jogo em classes/módulos específicos
* Sistema de fases
* Novos tipos de inimigos
* Novos tipos de armas
* Sistema de power-ups
* Backend real para ranking e histórico
* Autenticação
* WebSockets para partidas multiplayer
* Sistema mais completo de assets
* Cobertura maior de testes automatizados
* Estratégias mais robustas para persistência e sincronização de resultados

A estrutura atual foi mantida simples para priorizar clareza, funcionamento e separação das principais responsabilidades do desafio técnico.
