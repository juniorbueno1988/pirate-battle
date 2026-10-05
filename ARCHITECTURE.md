# 🏗️ Pirate Battle — Architecture

## 1. Visão geral

O Pirate Battle utiliza uma arquitetura híbrida combinando **React** para a interface da aplicação e **PixiJS** para o gameplay 2D.

A separação permite que cada tecnologia seja utilizada na responsabilidade em que apresenta maior vantagem:

* **React:** menus, telas, HUD, ranking e fluxo da aplicação.
* **PixiJS:** renderização, game loop, movimentação, colisões, inimigos e projéteis.
* **TanStack Query:** gerenciamento das requisições assíncronas.
* **Axios:** comunicação HTTP.
* **MSW:** simulação da API durante o desenvolvimento.
* **Playwright:** testes End-to-End.

Visão simplificada:

```text
┌─────────────────────────────────────┐
│               React                 │
│                                     │
│  Menu │ HUD │ Result │ History      │
│              │                      │
│           Ranking                   │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │  PixiJS     │
        │             │
        │ Game Loop   │
        │ Player      │
        │ Enemies     │
        │ Projectiles │
        │ Obstacles   │
        │ Collision   │
        └──────────────┘


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
* Botões de navegação
* HUD complementar
* Fluxo de reinício

O React não controla diretamente cada atualização de posição das entidades do jogo.

---

## 3. PixiJS

PixiJS é responsável pelo ambiente de renderização 2D.

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
React monta o componente
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
Destruição da instância
```

O canvas é anexado ao elemento destinado ao jogo.

Ao finalizar ou reiniciar uma partida, os recursos relacionados ao gameplay são removidos para evitar que múltiplos game loops permaneçam ativos simultaneamente.

---

## 5. Game Loop

O jogo utiliza o ticker do PixiJS para atualizar o estado visual continuamente.

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
```

A movimentação considera a rotação atual da embarcação para determinar a direção de deslocamento.

---

## 7. Sistema de disparos

Existem dois tipos principais de disparo.

### Disparo frontal

Um único projétil é criado na direção frontal da embarcação.

```text
          ↑
          │
          ●
          🚢
```

### Disparos laterais

Os comandos laterais criam três projéteis paralelos.

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
* Projétil × inimigo → inimigo destruído e aumento da pontuação
* Jogador × obstáculo → bloqueio/impacto

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
PAUSED         GAME OVER
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

A partida pode ser pausada manualmente.

Também existe tratamento para perda de foco da janela.

Quando a página perde o foco:

```text
PLAYING
   │
   ▼
PAUSED
```

Isso evita que o jogador continue recebendo dano ou que os elementos continuem avançando enquanto a aplicação não está em primeiro plano.

---

## 12. Temporizador

A partida possui duração limitada.

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

---

## 13. Pontuação

A pontuação é incrementada quando um inimigo é destruído.

```text
Enemy destroyed
       │
       ▼
Score + 1
```

Ao finalizar a partida, o resultado é salvo no histórico local.

---

## 14. Persistência local

O histórico das partidas utiliza `localStorage`.

Fluxo:

```text
Partida finalizada
       │
       ▼
Resultado da partida
       │
       ▼
localStorage
       │
       ▼
Histórico
```

Isso permite recuperar resultados após recarregar a aplicação.

---

## 15. Ranking

O ranking foi separado da lógica de gameplay.

A camada de API possui as funções responsáveis pela comunicação:

```text
src/api/api.ts
src/api/ranking.ts
```

O acesso aos dados pelo React é realizado através do hook:

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

Essa separação permite substituir posteriormente o mock por um backend real com poucas alterações na camada de apresentação.

---

## 16. TanStack Query

TanStack Query é utilizado para controlar o estado assíncrono do ranking.

Responsabilidades:

* Buscar dados
* Controlar estado de carregamento
* Controlar erros
* Armazenar dados em cache
* Reutilizar resultados de consultas

O componente `Ranking` não precisa conhecer os detalhes da implementação HTTP.

Ele apenas utiliza:

```text
useRanking()
```

---

## 17. Axios

O Axios é centralizado em:

```text
src/api/api.ts
```

Isso permite manter a configuração HTTP em um único ponto.

A camada específica do ranking utiliza essa instância para realizar as requisições.

---

## 18. MSW

O Mock Service Worker é utilizado para simular as respostas da API.

Os handlers estão localizados em:

```text
src/mocks/handlers.ts
```

Atualmente são simuladas operações relacionadas ao ranking:

```text
GET /ranking
POST /ranking
```

O objetivo é permitir o desenvolvimento e teste do frontend sem depender de um backend externo.

---

## 19. Testes E2E

Os testes End-to-End são implementados com Playwright.

Localização:

```text
src/testes/game.spec.ts
```

Os testes atuais verificam:

```text
Abrir aplicação
      │
      ▼
Verificar título
      │
      ▼
Verificar botão JOGAR
      │
      ▼
Clicar em JOGAR
      │
      ▼
Verificar inicialização da partida
```

Resultado atual:

```text
2 passed
```

---

## 20. Separação de responsabilidades

A aplicação procura manter as seguintes responsabilidades separadas:

| Camada         | Responsabilidade               |
| -------------- | ------------------------------ |
| React          | Interface e fluxo da aplicação |
| PixiJS         | Gameplay e renderização 2D     |
| TanStack Query | Estado assíncrono              |
| Axios          | Comunicação HTTP               |
| MSW            | Mock da API                    |
| localStorage   | Persistência local             |
| Playwright     | Testes E2E                     |

Essa divisão reduz o acoplamento entre interface, gameplay e comunicação externa.

---

## 21. Performance

Como o gameplay utiliza renderização em tempo real, alguns cuidados foram considerados:

* Atualização das entidades dentro do ticker do PixiJS
* Remoção de projéteis que deixam de ser necessários
* Evitar múltiplos loops simultâneos
* Separação entre React e atualização contínua do gameplay
* Reutilização da estrutura de comunicação de dados através do TanStack Query

A interface React não precisa ser renderizada novamente a cada frame do jogo.

---

## 22. Possível evolução

A arquitetura permite futuras melhorias, como:

* Separação das entidades do jogo em classes/módulos específicos
* Sistema de fases
* Novos tipos de inimigos
* Novos tipos de armas
* Sistema de power-ups
* Backend real para ranking
* Autenticação
* WebSockets para partidas multiplayer
* Sistema mais completo de assets
* Cobertura maior de testes automatizados

A estrutura atual foi mantida simples para priorizar clareza, funcionamento e separação das principais responsabilidades do desafio técnico.
