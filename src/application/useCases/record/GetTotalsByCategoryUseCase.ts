// src/application/useCases/record/GetTotalsByCategoryUseCase.ts

import { injectable, inject } from 'inversify'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import type { ExerciseCategory } from '@/domain/entities/Exercise'
import { TYPES } from '@/infrastructure/di/types'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'

@injectable()
export class GetTotalsByCategoryUseCase {
  constructor(
    @inject(TYPES.ITrainingRepository) private repo: ITrainingRepository
  ) {}

  execute(
    userId: string,
    from: Date,
    to: Date
  ): Promise<ProgressEntity<ExerciseCategory>[]> {
    return this.repo.getTotalsByCategory(userId, from, to)
  }
}
