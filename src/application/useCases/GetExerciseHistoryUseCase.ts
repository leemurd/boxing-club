import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'

export class GetExerciseHistoryUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async execute(userId: string, days: number): Promise<TrainingRecord[]> {
    return await this.exerciseRepo.getExerciseHistory(userId, days)
  }
}
