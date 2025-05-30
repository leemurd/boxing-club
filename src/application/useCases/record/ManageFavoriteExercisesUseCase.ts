import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository.ts'

@injectable()
export class ManageFavoriteExercisesUseCase {
  constructor(@inject(TYPES.ITrainingRepository) private repo: ITrainingRepository) {}

  async getFavorites(userId: string): Promise<string[]> {
    return await this.repo.getFavoriteExercises(userId)
  }

  async updateFavorites(userId: string, favorites: string[]): Promise<void> {
    await this.repo.updateFavoriteExercises(userId, favorites)
  }
}
