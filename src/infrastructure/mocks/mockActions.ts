import { type BoxingAction, BoxingActionCategory, BoxingActionSide, BoxingActionType } from '@/domain/entities/BoxingAction'

export const MOCK_ACTIONS: BoxingAction[] = [
  // punches
  { id: 1, name: 'jab', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: BoxingActionType.Jab },
  { id: 2, name: 'Кросс', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: BoxingActionType.Cross },
  { id: 3, name: 'Левый hook', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: BoxingActionType.Hook },
  { id: 4, name: 'Правый hook', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: BoxingActionType.Hook },
  { id: 5, name: 'Левый uppercut', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.LEAD, type: BoxingActionType.Uppercut },
  { id: 6, name: 'Правый uppercut', category: BoxingActionCategory.PUNCH, side: BoxingActionSide.REAR, type: BoxingActionType.Uppercut },
  // movements

  { id: 21, name: 'Уклон влево', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Slip },
  { id: 22, name: 'Уклон вправо', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Slip },
  { id: 23, name: 'Нырок lead-rear', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Roll },
  { id: 24, name: 'Нырок rear-lead', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Roll },
  { id: 26, name: 'Циркуль влево', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Pivot },
  { id: 27, name: 'Циркуль вправо', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Pivot },
  { id: 28, name: 'Смена позиции влево', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.LEAD, type: BoxingActionType.Shift },
  { id: 29, name: 'Смена позиции вправо', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.REAR, type: BoxingActionType.Shift },
  { id: 20, name: 'Пригнуться', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: BoxingActionType.Duck },
  { id: 25, name: 'Шаг назад', category: BoxingActionCategory.MOVEMENT, side: BoxingActionSide.ANY, type: BoxingActionType.Step },
  // defense
  { id: 40, name: 'Блок влево', category: BoxingActionCategory.DEFENSE, side: BoxingActionSide.LEAD, type: BoxingActionType.Block },
  { id: 41, name: 'Блок вправо', category: BoxingActionCategory.DEFENSE, side: BoxingActionSide.REAR, type: BoxingActionType.Block },
]
