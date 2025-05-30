import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository.ts'

@injectable()
export class GetExerciseHistoryUseCase {
  constructor(@inject(TYPES.ITrainingRepository) private repo: ITrainingRepository) {}

  async execute(userId: string, days: number): Promise<TrainingRecord[]> {
    return await this.repo.getExerciseHistory(userId, days)
  }
}
