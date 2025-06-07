import { type BoxingAction, BoxingActionCategory, BoxingActionSide, BoxingActionType } from '@/domain/entities/BoxingAction.ts'

export function getNextActions(lastAction: BoxingAction, all: BoxingAction[]): BoxingAction[] {
  // Особый случай для джеба (как раньше)
  if (lastAction.category === BoxingActionCategory.PUNCH && lastAction.type === BoxingActionType.Jab) {
    return all
  }

  // Разделяем логику по категориям:
  // Если последний action был PUNCH, то следующий PUNCH идёт другой рукой,
  // но следующий MOVEMENT/DEFENSE идёт той же рукой
  if (lastAction.category === BoxingActionCategory.PUNCH) {
    return all.filter((action) => {
      if (action.category === BoxingActionCategory.PUNCH || action.category === BoxingActionCategory.DEFENSE) {
        if (lastAction.side === BoxingActionSide.LEAD) {
          return action.side === BoxingActionSide.REAR || action.side === BoxingActionSide.ANY
        }
        return action.side === BoxingActionSide.LEAD || action.side === BoxingActionSide.ANY
      }
      if (action.category === BoxingActionCategory.MOVEMENT) {
        return action.side === lastAction.side || action.side === BoxingActionSide.ANY
      }
      return false
    })
  }

  // Если последний action был MOVEMENT или DEFENSE,
  // то следующий PUNCH должен быть «противоположной» рукой,
  // а следующий MOVEMENT/DEFENSE остаётся на той же стороне
  if (lastAction.category === BoxingActionCategory.MOVEMENT || lastAction.category === BoxingActionCategory.DEFENSE) {
    return all.filter((action) => {
      if (action.category === BoxingActionCategory.PUNCH) {
        // if slip next punch from the same side
        if (lastAction.type === BoxingActionType.Slip) {
          return action.side === lastAction.side || action.side === BoxingActionSide.ANY
        }
        // if block next punch from the same side
        if (lastAction.type === BoxingActionType.Block) {
          return action.side !== lastAction.side || action.side === BoxingActionSide.ANY
        }
        if (lastAction.side === BoxingActionSide.LEAD) {
          // if lastAction is left
          return action.side === BoxingActionSide.REAR || action.side === BoxingActionSide.ANY
        }
        if (lastAction.side === BoxingActionSide.REAR) {
          // if lastAction is right
          return action.side === BoxingActionSide.LEAD || action.side === BoxingActionSide.ANY
        }
        return true
      }
      if (action.category === BoxingActionCategory.MOVEMENT || action.category === BoxingActionCategory.DEFENSE) {
        return action.side === lastAction.side || action.side === BoxingActionSide.ANY
      }
      return false
    })
  }

  return all
}
