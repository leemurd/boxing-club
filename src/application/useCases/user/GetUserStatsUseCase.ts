import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository.ts'

export class GetUserStatsUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async execute(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }> {
    return await this.exerciseRepo.getUserStats(userId)
  }
}
