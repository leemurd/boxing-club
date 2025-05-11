// src/application/useCases/SaveCombinationUseCase.ts
import { injectable, inject } from 'inversify'
import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository.ts'
import type { Combination } from '@/domain/entities/Combination.ts'
import { TYPES } from '@/infrastructure/di/types.ts'

@injectable()
export class SaveCombinationUseCase {
  constructor(@inject(TYPES.CombinationRepository) private repo: ICombinationRepository) {}

  execute(userId: string, combo: Combination): Promise<void> {
    return this.repo.save(userId, combo)
  }
}
