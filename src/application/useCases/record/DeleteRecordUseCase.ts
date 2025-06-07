// src/application/useCases/record/DeleteRecordUseCase.ts

import { injectable, inject } from 'inversify'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class DeleteRecordUseCase {
  constructor(
    @inject(TYPES.ITrainingRepository) private repo: ITrainingRepository
  ) {}

  execute(userId: string, recordId: string): Promise<void> {
    return this.repo.deleteRecord(userId, recordId)
  }
}
