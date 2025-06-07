// src/application/useCases/record/GetDailyTotalsUseCase.ts

import { injectable, inject } from 'inversify'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import { TYPES } from '@/infrastructure/di/types'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'

@injectable()
export class GetDailyTotalsUseCase {
  constructor(
    @inject(TYPES.ITrainingRepository) private repo: ITrainingRepository
  ) {}

  execute(
    userId: string,
    from: Date,
    to: Date
  ): Promise<ProgressEntity<string>[]> {
    return this.repo.getDailyTotals(userId, from, to)
  }
}
