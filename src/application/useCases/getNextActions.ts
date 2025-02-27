import { type BoxingAction, BoxingActionCategory, BoxingActionSide, BoxingActionType } from '@/domain/entities/BoxingAction'

export function getNextActions(lastAction: BoxingAction, all: BoxingAction[]): BoxingAction[] {
  // if jab return all
  if (lastAction.category === BoxingActionCategory.PUNCH && lastAction.type === BoxingActionType.Jab) {
    return all
  }
  if (lastAction.category === BoxingActionCategory.PUNCH) {
    if (lastAction.side === BoxingActionSide.LEAD) {
      return all.filter(a => {
        if (a.side === BoxingActionSide.REAR) return true
        if (a.side === BoxingActionSide.ANY) return true
        return false
      })
    } else {
      return all.filter(a => {
        if (a.side === BoxingActionSide.LEAD) return true
        if (a.side === BoxingActionSide.ANY) return true
        return false
      })
    }
  }
  if (lastAction.category === BoxingActionCategory.MOVEMENT) {
    if (lastAction.side === BoxingActionSide.LEAD) {
      return all.filter(a => {
        if (a.side === BoxingActionSide.REAR) return true
        if (a.side === BoxingActionSide.ANY) return true
        return false
      })
    } else if (lastAction.side === BoxingActionSide.REAR) {
      return all.filter(a => {
        if (a.side === BoxingActionSide.LEAD) return true
        if (a.side === BoxingActionSide.ANY) return true
        return false
      })
    } else {
      return all
    }
  }
  if (lastAction.category === BoxingActionCategory.DEFENSE) {
    if (lastAction.side === BoxingActionSide.LEAD) {
      return all.filter(a => {
        if (a.side === BoxingActionSide.REAR) return true
        if (a.side === BoxingActionSide.ANY) return true
        return false
      })
    } else {
      return all.filter(a => {
        if (a.side === BoxingActionSide.LEAD) return true
        if (a.side === BoxingActionSide.ANY) return true
        return false
      })
    }
  }
  return all
}
