import { type BoxingAction, BoxingActionCategory, BoxingActionSide } from '@/domain/entities/BoxingAction'

export const MOCK_ACTIONS: BoxingAction[] = [
  { id: 1, name: 'Jab', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: 'jab' },
  { id: 2, name: 'Cross', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: 'cross' },
  { id: 3, name: 'Lead hook', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: 'hook' },
  { id: 4, name: 'Rear hook', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: 'hook' },
  { id: 5, name: 'Lead uppercut', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: 'uppercut' },
  { id: 6, name: 'Rear uppercut', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: 'uppercut' },
  { id: 20, name: 'Duck', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: 'duck' },
  { id: 21, name: 'Slip lead', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: 'slip' },
  { id: 22, name: 'Slip rear', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: 'slip' },
  { id: 23, name: 'Roll lead-rear', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: 'roll' },
  { id: 24, name: 'Roll rear-lead', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: 'roll' },
  { id: 25, name: 'Step back', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: 'step' },
  { id: 26, name: 'Pivot left', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: 'pivot' },
  { id: 27, name: 'Pivot right', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: 'pivot' },
  { id: 28, name: 'Shift left', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: 'shift' },
  { id: 29, name: 'Shift right', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: 'shift' },
  { id: 40, name: 'Block lead', category: BoxingActionCategory.DEFENSE, side: BoxingActionSide.LEAD, type: 'block' },
  { id: 41, name: 'Block rear', category: BoxingActionCategory.DEFENSE, side: BoxingActionSide.REAR, type: 'block' }
]
