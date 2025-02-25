import { Punch } from '@/domain/entities/Punch.ts';
import { Defense } from '@/domain/entities/Defense.ts';
import { Movement } from '@/domain/entities/Movement.ts';

export const MOCK_ACTIONS = [
  // Punches
  new Punch(1, 'Jab', [1, 2, 3, 4, 5, 6]),
  new Punch(2, 'Cross', [1, 3, 5]),
  new Punch(3, 'Lead hook', [2, 4, 6]),
  new Punch(4, 'Rear hook', [1, 3, 5]),
  new Punch(5, 'Lead uppercut', [2, 4, 6]),
  new Punch(6, 'Rear uppercut', [1, 3, 5]),
  // new Punch(7, 'lead overhand', [2, 4, 6]),
  // new Punch(8, 'Rear overhand', [1, 3, 5]),

  // Movements
  new Movement(20, 'Duck', [1, 2, 3, 4, 5, 6]),
  new Movement(21, 'Slip lead', [1, 3, 5]),
  new Movement(22, 'Slip rear', [2, 4, 6]),
  new Movement(23, 'Roll lead-rear', [1, 2, 4, 6]),
  new Movement(24, 'Roll rear-lead', [1, 3, 5]),
  new Movement(25, 'Step back', [1, 2, 3, 4, 5, 6]),
  new Movement(26, 'Pivot left', [1, 2, 3, 4, 5, 6]),
  new Movement(27, 'Pivot right', [1, 2, 3, 4, 5, 6]),
  new Movement(28, 'Shift left', [2, 4, 6]),
  new Movement(29, 'Shift right', [1, 3, 5]),

  // Defenses
  new Defense(40, 'Block lead', [2, 4, 6]),
  new Defense(41, 'Block rear', [1, 3, 5]),
  new Defense(42, 'Catch left', [1, 2]),
  new Defense(43, 'Catch rear', [1, 2]),
];
