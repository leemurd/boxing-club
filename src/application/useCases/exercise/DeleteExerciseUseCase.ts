import { injectable, inject } from 'inversify'
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class DeleteExerciseUseCase {
  constructor(
    @inject(TYPES.IExerciseRepository)
    private repo: IExerciseRepository
  ) {}

  execute(userId: string, id: string): Promise<void> {
    return this.repo.delete(userId, id)
  }
}
