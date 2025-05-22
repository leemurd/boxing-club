import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository.ts'
import type { Record } from '@/domain/entities/Record.ts'
import { inject, injectable } from 'inversify'
import { TYPES } from '@/infrastructure/di/types.ts'

@injectable()
export class GetExerciseHistoryUseCase {
  constructor(@inject(TYPES.ExerciseRepository) private repo: IExerciseRepository) {}

  async execute(userId: string, days: number): Promise<Record[]> {
    return await this.repo.getExerciseHistory(userId, days)
  }
}
