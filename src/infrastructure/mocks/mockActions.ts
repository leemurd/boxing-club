import {
  type BoxingAction,
  BoxingActionCategory,
  BoxingActionSide,
  BoxingActionType
} from '@/domain/entities/BoxingAction'

export const MOCK_ACTIONS: BoxingAction[] = [
  // punches
  {
    id: 1,
    name: 'Jab',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Jab
  },
  {
    id: 2,
    name: 'Cross',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Cross
  },
  {
    id: 3,
    name: 'L hook',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Hook
  },
  {
    id: 4,
    name: 'R hook',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Hook
  },
  {
    id: 5,
    name: 'L uppercut',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Uppercut
  },
  {
    id: 6,
    name: 'R uppercut',
    category: BoxingActionCategory.PUNCH,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Uppercut
  },
  // movements

  {
    id: 21,
    name: 'Slip L',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Slip
  },
  {
    id: 22,
    name: 'Slip R',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Slip
  },
  {
    id: 23,
    name: 'Roll LR',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Roll
  },
  {
    id: 24,
    name: 'Roll RL',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Roll
  },
  {
    id: 26,
    name: 'Circle L',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Pivot
  },
  {
    id: 27,
    name: 'Circle R',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Pivot
  },
  {
    id: 28,
    name: 'Shift L',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Shift
  },
  {
    id: 29,
    name: 'Shift R',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Shift
  },
  // { id: 20, name: 'Duck', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: BoxingActionType.Duck },
  {
    id: 25,
    name: 'Step back',
    category: BoxingActionCategory.MOVEMENT,
    side: BoxingActionSide.ANY,
    type: BoxingActionType.Step
  },
  // defense
  {
    id: 40,
    name: 'Block L',
    category: BoxingActionCategory.DEFENSE,
    side: BoxingActionSide.LEAD,
    type: BoxingActionType.Block
  },
  {
    id: 41,
    name: 'Block R',
    category: BoxingActionCategory.DEFENSE,
    side: BoxingActionSide.REAR,
    type: BoxingActionType.Block
  }
]
