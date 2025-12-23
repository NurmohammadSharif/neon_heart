export type ColorTheme = {
  name: string;
  color: string;
  secondaryColor?: string;
  glow: string;
};

export type Stage = 'scattered' | 'forming' | 'stable' | 'pulse' | 'birthday';

export interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}