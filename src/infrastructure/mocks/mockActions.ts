import { Punch } from '@/domain/entities/Punch.ts';
import { Defense } from '@/domain/entities/Defense.ts';
import { Movement } from '@/domain/entities/Movement.ts';

export const MOCK_ACTIONS = [
  // Punches
  new Punch(1, 'Jab', [1, 2, 3, 4, 5, 6]),
  new Punch(2, 'Cross', [3, 5]),
  new Punch(3, 'Lead hook', [2, 4, 6]),
  new Punch(4, 'Rear hook', [3, 5]),
  new Punch(5, 'Lead uppercut', [4, 6]),
  new Punch(6, 'Rear uppercut', [3, 5]),

  // Movements
  new Movement(20, 'Duck', [1, 2]),

  // Defenses
  new Defense(10, 'Block Left', [1, 2]),
];
