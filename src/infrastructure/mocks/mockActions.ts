import { type PositionedAction } from '@/domain/entities/PositionedAction';
import { ActionCategory } from '@/domain/entities/ActionCategory';
import { Stance } from '@/domain/entities/Stance';

export const MOCK_ACTIONS: PositionedAction[] = [
  // ====== PUNCHES ======
  {
    id: 1,
    name: 'Jab',
    category: ActionCategory.PUNCH,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
  },
  {
    id: 2,
    name: 'Cross',
    category: ActionCategory.PUNCH,
    fromPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
    toPosition: Stance.ORTHO_WEIGHT_ON_BACK,
  },
  {
    id: 3,
    name: 'Lead Hook',
    category: ActionCategory.PUNCH,
    fromPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 4,
    name: 'Rear Hook',
    category: ActionCategory.PUNCH,
    fromPosition: Stance.ORTHO_WEIGHT_ON_BACK,
    toPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
  },
  {
    id: 5,
    name: 'Lead Uppercut',
    category: ActionCategory.PUNCH,
    fromPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 6,
    name: 'Rear Uppercut',
    category: ActionCategory.PUNCH,
    fromPosition: Stance.ORTHO_WEIGHT_ON_BACK,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 7,
    name: 'Overhand',
    category: ActionCategory.PUNCH,
    fromPosition: Stance.ORTHO_WEIGHT_ON_BACK,
    toPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
  },

  // ====== DEFENSE ======
  {
    id: 10,
    name: 'Block Left',
    category: ActionCategory.DEFENSE,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 11,
    name: 'Block Right',
    category: ActionCategory.DEFENSE,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 12,
    name: 'Slip Left',
    category: ActionCategory.DEFENSE,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
  },
  {
    id: 13,
    name: 'Slip Right',
    category: ActionCategory.DEFENSE,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_WEIGHT_ON_BACK,
  },

  // ====== MOVEMENT ======
  {
    id: 20,
    name: 'Duck',
    category: ActionCategory.MOVEMENT,
    fromPosition: Stance.ORTHO_WEIGHT_ON_BACK,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 21,
    name: 'Step Forward',
    category: ActionCategory.MOVEMENT,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
  },
  {
    id: 22,
    name: 'Step Back',
    category: ActionCategory.MOVEMENT,
    fromPosition: Stance.ORTHO_WEIGHT_ON_FRONT,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 23,
    name: 'Pivot Left',
    category: ActionCategory.MOVEMENT,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
  {
    id: 24,
    name: 'Pivot Right',
    category: ActionCategory.MOVEMENT,
    fromPosition: Stance.ORTHO_NEUTRAL,
    toPosition: Stance.ORTHO_NEUTRAL,
  },
];
