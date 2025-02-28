import { type BoxingAction, BoxingActionType } from '@/domain/entities/BoxingAction'
import { getNextActions } from './getNextActions'
import { BoxingActionCategory } from '@/domain/entities/BoxingAction'

export function generateRandomCombo(allActions: BoxingAction[], counter: number = 5): BoxingAction[] {
  const combo: BoxingAction[] = []

  // Начинаем с джеба
  const jab = allActions.find(a => a.type === BoxingActionType.Jab)
  if (!jab) return combo

  combo.push(jab)
  let lastAction = jab

  // Счётчик промежуточных действий (movement/defense) с момента последнего удара
  let nonPunchCount = 0

  for (let i = 0; i < counter - 1; i++) {
    const rawNext = getNextActions(lastAction, allActions)

    // Отфильтруем кандидатов с учётом «не более 1 движения/защиты» между ударами
    const possibleNext = rawNext.filter(a => {
      // Если уже есть 1 nonPunch подряд, то следующий шаг должен быть удар
      if (nonPunchCount >= 1 && a.category !== BoxingActionCategory.PUNCH) {
        return false
      }
      return true
    })

    if (possibleNext.length === 0) break

    const randomIndex = Math.floor(Math.random() * possibleNext.length)
    const chosen = possibleNext[randomIndex]
    combo.push(chosen)

    // Обновляем lastAction
    lastAction = chosen

    // Если выбрали Punch, сбрасываем счётчик. Если Movement/Defense, увеличиваем
    if (chosen.category === BoxingActionCategory.PUNCH) {
      nonPunchCount = 0
    } else {
      nonPunchCount++
    }
  }

  return combo
}
