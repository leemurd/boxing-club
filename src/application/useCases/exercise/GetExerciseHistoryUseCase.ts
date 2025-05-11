import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository.ts'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'

export class GetExerciseHistoryUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async execute(userId: string, days: number): Promise<TrainingRecord[]> {
    return await this.exerciseRepo.getExerciseHistory(userId, days)
  }
}
