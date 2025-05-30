import { injectable, inject } from 'inversify'
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { Exercise } from '@/domain/entities/Exercise'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class CreateExerciseUseCase {
  constructor(
    @inject(TYPES.IExerciseRepository)
    private repo: IExerciseRepository
  ) {}

  execute(userId: string, exercise: Exercise): Promise<Exercise> {
    return this.repo.create(userId, exercise)
  }
}
