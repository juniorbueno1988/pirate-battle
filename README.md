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
* Histórico local de partidas
* Ranking
* Persistência local do histórico
* Integração de API utilizando Axios
* Dados de ranking simulados com MSW
* Testes E2E com Playwright

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
│   │   ├── api.ts
│   │   └── ranking.ts
│   │
│   ├── components/
│   │   └── Ranking.tsx
│   │
│   ├── hooks/
│   │   └── useRanking.ts
│   │
│   ├── mocks/
│   │   └── handlers.ts
│   │
│   ├── testes/
│   │   └── game.spec.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── ARCHITECTURE.md
├── package.json
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

| Ação                     | Controle       |
| ------------------------ | -------------- |
| Avançar                  | `W` ou `↑`     |
| Girar para esquerda      | `A` ou `←`     |
| Girar para direita       | `D` ou `→`     |
| Disparo frontal          | `Espaço`       |
| Disparo lateral esquerdo | `Q`            |
| Disparo lateral direito  | `E`            |
| Pausar                   | Botão de pausa |

## ⚔️ Gameplay

O jogador controla uma embarcação em um cenário 2D.

A embarcação pode avançar, girar e disparar contra os inimigos.

Existem dois tipos principais de inimigos:

### Chaser

Persegue o jogador pelo cenário e representa uma ameaça de colisão direta.

### Shooter

Ataca o jogador à distância utilizando projéteis.

O jogador precisa evitar inimigos, obstáculos e projéteis enquanto tenta conseguir a maior pontuação possível.

Cada inimigo destruído adiciona pontos à pontuação da partida.

## 🧱 Colisões

O jogo possui tratamento de colisões entre diferentes entidades:

* Jogador × inimigos
* Jogador × ilhas
* Projéteis × inimigos
* Projéteis inimigos × jogador
* Projéteis × obstáculos

As colisões influenciam diretamente a vida e o resultado da partida.

## ⏱️ Partida

Cada partida possui um tempo limitado.

Durante a partida:

* O cronômetro é atualizado em tempo real.
* A pontuação é atualizada conforme os inimigos são destruídos.
* A vida do jogador é exibida na interface.
* A partida pode ser pausada.
* O jogo pausa automaticamente quando a janela perde o foco.

Ao finalizar, o jogador recebe uma tela de resultado contendo as informações da partida.

## 🏆 Ranking

O ranking utiliza:

* Axios para comunicação HTTP
* TanStack Query para gerenciamento dos dados
* MSW para simulação da API

O fluxo foi estruturado para permitir posteriormente a substituição do mock por uma API real sem alterar a camada de apresentação.

## 💾 Persistência local

O histórico das partidas é armazenado utilizando `localStorage`.

Isso permite que os resultados permaneçam disponíveis mesmo após recarregar a página.

## 🧪 Testes

O projeto utiliza Playwright para testes End-to-End.

Para executar os testes:

```bash
npx playwright test
```

Os testes atuais verificam:

* Carregamento da aplicação
* Exibição do título do jogo
* Existência do botão de início
* Inicialização de uma partida

Resultado atual:

```text
2 passed
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

Utilizado para estruturar a interface, menus, HUD, ranking e telas relacionadas ao fluxo da aplicação.

### PixiJS

Responsável pela renderização e lógica visual do jogo 2D.

A utilização de PixiJS permite manter o gameplay separado da camada de interface do React.

### TypeScript

Utilizado para tipagem estática e maior segurança durante o desenvolvimento.

### TanStack Query

Responsável pelo gerenciamento do estado assíncrono relacionado aos dados do ranking.

### Axios

Centraliza as requisições HTTP utilizadas pela aplicação.

### MSW

Permite simular as respostas da API durante o desenvolvimento sem depender de um backend externo.

### Playwright

Utilizado para validar os principais fluxos da aplicação diretamente no navegador.

## 📐 Arquitetura

As principais responsabilidades foram separadas entre:

```text
React
  ↓
Interface / Menus / Ranking
  ↓
TanStack Query
  ↓
Axios
  ↓
API / MSW
```

Enquanto o gameplay segue uma camada independente:

```text
React
  ↓
PixiJS
  ↓
Game Loop
  ├── Player
  ├── Enemies
  ├── Projectiles
  ├── Obstacles
  ├── Collision
  └── Score / Health / Timer
```

Mais detalhes sobre as decisões arquiteturais estão documentados em:

```text
ARCHITECTURE.md
```

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
* Organização de código
* Desenvolvimento de uma aplicação frontend completa

## 👨‍💻 Autor

**Edílson José Bueno Júnior**

Frontend Developer em transição de carreira, com experiência profissional em suporte de TI e desenvolvimento de projetos utilizando tecnologias modernas de frontend. Para criação do projeto foi utilizado inteligência artifical para o auxilio.

### Links

* GitHub: `github.com/juniorbueno1988`
* LinkedIn: `linkedin.com/in/juniorbueno1988`
* Portfólio: `juniorbueno1988.github.io/portfolio-junior-bueno`
