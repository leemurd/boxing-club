import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository.ts'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'

@injectable()
export class ManageFavoriteExercisesUseCase {
  constructor(@inject(TYPES.ExerciseRepository) private repo: IExerciseRepository) {}

  async getFavorites(userId: string): Promise<string[]> {
    return await this.repo.getFavoriteExercises(userId)
  }

  async updateFavorites(userId: string, favorites: string[]): Promise<void> {
    await this.repo.updateFavoriteExercises(userId, favorites)
  }
}
