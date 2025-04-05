import { CombinationBuilder } from '@/domain/services/CombinationBuilder.ts'
import { Combination } from '@/domain/entities/Combination.ts'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

export class CreateCombinationUseCase {
  private builder: CombinationBuilder

  constructor(builder: CombinationBuilder) {
    this.builder = builder
  }

  addAction(action: BoxingAction) {
    this.builder.addAction(action)
  }

  buildCombination(title: string): Combination {
    return this.builder.build(title)
  }
}
