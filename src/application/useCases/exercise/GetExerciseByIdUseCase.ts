import { injectable, inject } from 'inversify'
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { Exercise } from '@/domain/entities/Exercise'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetExerciseByIdUseCase {
  constructor(
    @inject(TYPES.IExerciseRepository)
    private repo: IExerciseRepository
  ) {}

  execute(userId: string, id: string): Promise<Exercise | null> {
    return this.repo.getById(userId, id)
  }
}
