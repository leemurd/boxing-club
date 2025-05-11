// src/application/useCases/GetCombinationsUseCase.ts
import { injectable, inject } from 'inversify'
import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository.ts'
import type { Combination } from '@/domain/entities/Combination.ts'
import { TYPES } from '@/infrastructure/di/types.ts'

@injectable()
export class GetCombinationsUseCase {
  constructor(@inject(TYPES.CombinationRepository) private repo: ICombinationRepository) {}

  execute(userId: string): Promise<Combination[]> {
    return this.repo.getAll(userId)
  }
}
