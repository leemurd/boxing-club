// src/application/useCases/record/GetTotalsByTagUseCase.ts

import { injectable, inject } from 'inversify'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import { TYPES } from '@/infrastructure/di/types'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'
import type { DefaultTagId } from '@/domain/constants/defaultTags.ts'

@injectable()
export class GetTotalsByTagUseCase {
  constructor(
    @inject(TYPES.ITrainingRepository) private repo: ITrainingRepository
  ) {}

  execute(
    userId: string,
    from: Date,
    to: Date
  ): Promise<ProgressEntity<DefaultTagId>[]> {
    return this.repo.getTotalsByTag(userId, from, to)
  }
}
