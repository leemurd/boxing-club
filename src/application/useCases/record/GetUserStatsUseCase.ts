import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository.ts'

@injectable()
export class GetUserStatsUseCase {
  constructor(@inject(TYPES.ITrainingRepository) private repo: ITrainingRepository) {}

  async execute(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }> {
    return await this.repo.getUserStats(userId)
  }
}
