import { injectable, inject } from 'inversify'
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { Exercise } from '@/domain/entities/Exercise'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetExercisesUseCase {
  constructor(
    @inject(TYPES.IExerciseRepository)
    private repo: IExerciseRepository
  ) {}

  execute(userId: string): Promise<Exercise[]> {
    return this.repo.getAll(userId)
  }
}
