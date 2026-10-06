export type GameConfig = {
  sessionDuration: number
  enemySpawnInterval: number
  playerSpeed: number
  playerRotationSpeed: number
  playerMaxHealth: number
  playerProjectileSpeed: number
  playerProjectileDamage: number
  playerProjectileCooldown: number
  chaserSpeed: number
  chaserMaxHealth: number
  chaserDamage: number
  shooterSpeed: number
  shooterMaxHealth: number
  shooterDamage: number
  shooterAttackRange: number
  shooterProjectileSpeed: number
  shooterProjectileCooldown: number
}

export const defaultGameConfig: GameConfig = {
  sessionDuration: 60,
  enemySpawnInterval: 5,
  playerSpeed: 3,
  playerRotationSpeed: 0.05,
  playerMaxHealth: 100,
  playerProjectileSpeed: 7,
  playerProjectileDamage: 25,
  playerProjectileCooldown: 0.25,
  chaserSpeed: 1.2,
  chaserMaxHealth: 50,
  chaserDamage: 20,
  shooterSpeed: 0.5,
  shooterMaxHealth: 40,
  shooterDamage: 10,
  shooterAttackRange: 300,
  shooterProjectileSpeed: 4,
  shooterProjectileCooldown: 1.5,
}