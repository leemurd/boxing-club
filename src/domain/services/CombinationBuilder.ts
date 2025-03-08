import { Combination } from '../entities/Combination'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

export class CombinationBuilder {
  private actions: BoxingAction[] = []

  addAction(action: BoxingAction): CombinationBuilder {
    this.actions.push(action)
    return this
  }

  reset(): CombinationBuilder {
    this.actions = []
    return this
  }

  build(title: string): Combination {
    // В реальном случае тут могла бы быть логика валидации и т.д.
    return new Combination(Date.now(), title, [...this.actions])
  }
}
