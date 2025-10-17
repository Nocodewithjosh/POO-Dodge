export enum GameState {
  MENU,
  PLAYING,
  GAME_OVER,
}

export enum PoopType {
  NORMAL,
  FAST,
  BIG,
  MEGA,
}

export interface PoopObject {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  type: PoopType;
}

export interface SplatObject {
  id: number;
  x: number;
  size: number;
  rotation: number;
}

export enum PowerUpType {
  SHIELD,
  SCORE_DOUBLER,
  UMBRELLA,
}

export interface PowerUpObject {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
}

export interface EnemyObject {
  id: number;
  x: number;
  y: number;
  direction: 'left' | 'right';
  lastThrowTime: number;
}