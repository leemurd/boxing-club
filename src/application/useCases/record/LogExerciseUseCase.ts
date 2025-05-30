import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { MeasurementUnit } from '@/domain/entities/Exercise.ts'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository.ts'

@injectable()
export class LogExerciseUseCase {
  constructor(
    @inject(TYPES.ITrainingRepository)
    private repo: ITrainingRepository
  ) {}

  execute(userId: string, exerciseId: string, amount: number, unit: MeasurementUnit) {
    return this.repo.logExercise(userId, exerciseId, amount, unit)
  }
}
