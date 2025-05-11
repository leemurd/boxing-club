import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository.ts'

export class ManageFavoriteExercisesUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async getFavorites(userId: string): Promise<string[]> {
    return await this.exerciseRepo.getFavoriteExercises(userId)
  }

  async updateFavorites(userId: string, favorites: string[]): Promise<void> {
    await this.exerciseRepo.updateFavoriteExercises(userId, favorites)
  }
}
