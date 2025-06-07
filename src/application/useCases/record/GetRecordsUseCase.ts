// src/application/useCases/record/GetRecordsUseCase.ts

import { injectable, inject } from 'inversify'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetRecordsUseCase {
  constructor(
    @inject(TYPES.ITrainingRepository) private repo: ITrainingRepository
  ) {}

  execute(
    userId: string,
    from: Date,
    to: Date
  ): Promise<TrainingRecord[]> {
    return this.repo.getRecords(userId, from, to)
  }
}
