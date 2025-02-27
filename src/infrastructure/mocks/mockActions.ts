import { type BoxingAction, BoxingActionCategory, BoxingActionSide, BoxingActionType } from '@/domain/entities/BoxingAction'

export const MOCK_ACTIONS: BoxingAction[] = [
  // punches
  { id: 1, name: 'Jab', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: BoxingActionType.Jab },
  { id: 2, name: 'Cross', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: BoxingActionType.Cross },
  { id: 3, name: 'Lead hook', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: BoxingActionType.Hook },
  { id: 4, name: 'Rear hook', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: BoxingActionType.Hook },
  { id: 5, name: 'Lead uppercut', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: BoxingActionType.Uppercut },
  { id: 6, name: 'Rear uppercut', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: BoxingActionType.Uppercut },
  // movements
  { id: 20, name: 'Duck', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: BoxingActionType.Duck },
  { id: 21, name: 'Slip lead', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Slip },
  { id: 22, name: 'Slip rear', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Slip },
  { id: 23, name: 'Roll lead-rear', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Roll },
  { id: 24, name: 'Roll rear-lead', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Roll },
  { id: 25, name: 'Step back', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: BoxingActionType.Step },
  { id: 26, name: 'Pivot left', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Pivot },
  { id: 27, name: 'Pivot right', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Pivot },
  { id: 28, name: 'Shift left', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Shift },
  { id: 29, name: 'Shift right', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Shift },
  // defense
  { id: 40, name: 'Block lead', category: BoxingActionCategory.DEFENSE, side: BoxingActionSide.LEAD, type: BoxingActionType.Block },
  { id: 41, name: 'Block rear', category: BoxingActionCategory.DEFENSE, side: BoxingActionSide.REAR, type: BoxingActionType.Block },
]
