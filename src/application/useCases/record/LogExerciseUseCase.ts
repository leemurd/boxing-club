// src/application/useCases/record/LogExerciseUseCase.ts

import { injectable, inject } from 'inversify'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import { TYPES } from '@/infrastructure/di/types'
import type { ExerciseCategory } from '@/domain/entities/Exercise.ts'

@injectable()
export class LogExerciseUseCase {
  constructor(
    @inject(TYPES.ITrainingRepository) private repo: ITrainingRepository
  ) {}

  execute(
    userId: string,
    exerciseId: string,
    category: ExerciseCategory,
    amount: number,
    unit: 'seconds' | 'repetitions',
    tagIds: string[],
    comboId: string | null
  ): Promise<void> {
    return this.repo.logExercise(userId, exerciseId, category, amount, unit, tagIds, comboId)
  }
}
