import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository.ts'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'

@injectable()
export class GetUserStatsUseCase {
  constructor(@inject(TYPES.ExerciseRepository) private repo: IExerciseRepository) {}

  async execute(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }> {
    return await this.repo.getUserStats(userId)
  }
}
