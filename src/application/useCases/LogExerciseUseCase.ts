import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'

export class LogExerciseUseCase {
  constructor(private exerciseRepo: IExerciseRepository) {}

  async execute(userId: string, exerciseId: string, amount: number, unit: 'minutes' | 'repetitions'): Promise<void> {
    await this.exerciseRepo.logExercise(userId, exerciseId, amount, unit)
  }
}
