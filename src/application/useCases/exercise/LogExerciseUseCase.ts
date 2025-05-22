import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository.ts'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'

@injectable()
export class LogExerciseUseCase {
  constructor(@inject(TYPES.ExerciseRepository) private repo: IExerciseRepository) {}

  async execute(userId: string, exerciseId: string, amount: number, unit: 'minutes' | 'repetitions'): Promise<void> {
    await this.repo.logExercise(userId, exerciseId, amount, unit)
  }
}
