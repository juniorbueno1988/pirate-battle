# 🏴‍☠️ Pirate Battle

Pirate Battle é um jogo 2D top-down de batalha naval desenvolvido como desafio técnico para uma posição de **Junior Frontend Developer**.

O projeto utiliza **React, TypeScript e PixiJS** para combinar uma interface web com uma experiência de gameplay em tempo real.

## 🎮 Demonstração

O projeto foi desenvolvido para execução diretamente no navegador.

### Principais recursos

* Movimentação da embarcação do jogador
* Rotação para esquerda e direita
* Disparo frontal
* Disparos laterais com múltiplos projéteis
* Sistema de vida do jogador
* Sistema de pontuação
* Inimigos do tipo **Chaser**
* Inimigos do tipo **Shooter**
* Projéteis inimigos
* Ilhas e obstáculos
* Colisão entre entidades
* Temporizador da partida
* Sistema de pausa
* Pausa automática quando a janela perde foco
* Tela inicial
* Tela de resultado
* Reinício de partida
* Histórico de partidas
* Ranking
* Persistência das configurações no `localStorage`
* Integração com API utilizando Axios
* Gerenciamento de dados com TanStack Query
* API simulada com MSW
* Testes E2E com Playwright
* Teste de regressão visual com Playwright

## 🛠️ Tecnologias

### Frontend

* React
* TypeScript
* Vite
* PixiJS

### Dados e comunicação

* TanStack Query
* Axios
* REST API
* MSW (Mock Service Worker)

### Testes

* Playwright

### Ferramentas

* Git
* GitHub
* ESLint
* npm

## 📁 Estrutura do projeto

```text
pirate-battle/
├── public/
│   └── mockServiceWorker.js
│
├── src/
│   ├── api/
│   │   ├── http.ts
│   │   ├── history.ts
│   │   └── ranking.ts
│   │
│   ├── components/
│   │   ├── History.tsx
│   │   ├── Options.tsx
│   │   └── Ranking.tsx
│   │
│   ├── config/
│   │   └── gameConfig.ts
│   │
│   ├── hooks/
│   │   ├── useHistory.ts
│   │   └── useRanking.ts
│   │
│   ├── mocks/
│   │   ├── browser.ts
│   │   └── handlers.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── tests/
│   ├── api-error.spec.ts
│   ├── main-menu.spec.ts
│   ├── options.spec.ts
│   └── visual.spec.ts
│
├── ARCHITECTURE.md
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Como executar

### 1. Clonar o projeto

```bash
git clone https://github.com/juniorbueno1988/pirate-battle.git
```

### 2. Entrar na pasta

```bash
cd pirate-battle
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível no endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

## 🎯 Controles

| Ação                     | Controle   |
| ------------------------ | ---------- |
| Avançar                  | `W` ou `↑` |
| Girar para esquerda      | `A` ou `←` |
| Girar para direita       | `D` ou `→` |
| Disparo frontal          | `Espaço`   |
| Disparo lateral esquerdo | `Q`        |
| Disparo lateral direito  | `E`        |
| Pausar                   | `P`        |

## ⚔️ Gameplay

O jogador controla uma embarcação em um cenário 2D.

A embarcação pode avançar, girar e disparar contra os inimigos.

Existem dois tipos principais de inimigos:

### Chaser

Persegue o jogador pelo cenário e representa uma ameaça de colisão direta.

### Shooter

Ataca o jogador à distância utilizando projéteis.

O jogador precisa evitar inimigos, obstáculos e projéteis enquanto tenta conseguir a maior pontuação possível.

Cada inimigo destruído aumenta a pontuação da partida.

## 🧱 Colisões

O jogo possui tratamento de colisões entre diferentes entidades, incluindo:

* Jogador × inimigos
* Jogador × ilhas
* Projéteis × inimigos
* Projéteis inimigos × jogador
* Projéteis × obstáculos

As colisões influenciam diretamente a vida do jogador e o resultado da partida.

## ⏱️ Partida

Cada partida possui um tempo limitado.

Durante a partida:

* O cronômetro é atualizado em tempo real.
* A pontuação é atualizada conforme os inimigos são destruídos.
* A vida do jogador é exibida na interface.
* A partida pode ser pausada manualmente.
* O jogo pausa automaticamente quando a janela perde foco.

Ao finalizar, o jogador recebe uma tela de resultado contendo as informações da partida.

## 🏆 Ranking

O ranking utiliza:

* Axios para comunicação HTTP
* TanStack Query para gerenciamento das requisições assíncronas
* MSW para simulação da API

O ranking possui paginação e os dados são ordenados pela pontuação.

A camada de API foi separada da interface para permitir posteriormente a substituição do mock por um backend real sem alterar significativamente os componentes de apresentação.

## 📜 Histórico de partidas

O histórico registra os resultados das partidas e apresenta informações como:

* Jogador
* Pontuação
* Duração
* Motivo do encerramento
* Data da partida

O histórico possui paginação e utiliza a camada de API simulada pelo MSW.

## ⚙️ Opções

A aplicação possui uma tela de configurações que permite alterar parâmetros da partida, incluindo:

* Duração da partida
* Intervalo de surgimento dos inimigos

As configurações são persistidas utilizando `localStorage`, permanecendo disponíveis após o recarregamento da página.

## 💾 Persistência local

O projeto utiliza `localStorage` para persistir configurações da partida.

Os dados utilizados pelo frontend são mantidos através das camadas de API e MSW durante a execução da aplicação.

## 🧪 Testes

O projeto utiliza **Playwright** para testes End-to-End e regressão visual.

Para executar os testes:

```bash
npm run test:e2e
```

Os testes atuais verificam:

* Carregamento da aplicação
* Exibição do menu principal
* Existência dos principais botões
* Inicialização de uma partida
* Abertura da tela de opções
* Abertura do ranking
* Abertura do histórico
* Persistência das opções após recarregar a página
* Simulação de erro HTTP 500 no ranking
* Regressão visual do menu principal

Resultado atual:

```text
8 passed
```

### Regressão visual

O Playwright também mantém um snapshot visual do menu principal:

```text
tests/visual.spec.ts-snapshots/
└── main-menu-chromium-win32.png
```

Para atualizar os snapshots:

```bash
npm run test:e2e:update
```

## 🏗️ Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta:

```text
dist/
```

## 🔍 Lint

Para verificar problemas de código:

```bash
npm run lint
```

## 🧠 Decisões técnicas

### React

Utilizado para estruturar a interface, menus, HUD, ranking, histórico, opções e telas relacionadas ao fluxo da aplicação.

### PixiJS

Responsável pela renderização e lógica visual do jogo 2D.

A utilização de PixiJS permite manter o gameplay separado da camada de interface do React.

### TypeScript

Utilizado para tipagem estática e maior segurança durante o desenvolvimento.

### TanStack Query

Responsável pelo gerenciamento do estado assíncrono relacionado ao ranking e histórico.

### Axios

Centraliza as requisições HTTP utilizadas pela aplicação.

### MSW

Permite simular as respostas da API durante o desenvolvimento e os testes sem depender de um backend externo.

### Playwright

Utilizado para validar os principais fluxos da aplicação diretamente no navegador, incluindo testes funcionais, persistência, tratamento de erro e regressão visual.

## 📐 Arquitetura

As principais responsabilidades foram separadas entre:

```text
React
  │
  ├── Interface / Menus / HUD
  ├── Ranking
  ├── Histórico
  └── Opções
       │
       ▼
TanStack Query
       │
       ▼
Axios
       │
       ▼
API / MSW
```

Enquanto o gameplay segue uma estrutura independente:

```text
React
  │
  ▼
PixiJS
  │
  ▼
Game Loop
  ├── Player
  ├── Enemies
  ├── Projectiles
  ├── Obstacles
  ├── Collision
  └── Score / Health / Timer
```

Mais detalhes sobre as decisões arquiteturais estão documentados em `ARCHITECTURE.md`.

## 📌 Objetivo do projeto

O objetivo deste projeto foi demonstrar conhecimentos práticos de desenvolvimento frontend, incluindo:

* Desenvolvimento com React e TypeScript
* Renderização 2D com PixiJS
* Manipulação de eventos e game loop
* Gerenciamento de estado
* Integração com APIs
* Mock de APIs
* Persistência local
* Testes End-to-End
* Testes de regressão visual
* Organização de código
* Desenvolvimento de uma aplicação frontend completa

O projeto foi desenvolvido com auxílio de ferramentas de Inteligência Artificial durante o processo de implementação, revisão e aprendizado.

## 👨‍💻 Autor

**Edílson José Bueno Júnior**

Frontend Developer em transição de carreira, com experiência profissional em suporte de TI e desenvolvimento de projetos utilizando tecnologias modernas de frontend.

### Links

* GitHub: `github.com/juniorbueno1988`
* LinkedIn: `linkedin.com/in/juniorbueno1988`
* Portfólio: `juniorbueno1988.github.io/portfolio-junior-bueno`
