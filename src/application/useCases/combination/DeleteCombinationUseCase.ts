// src/application/useCases/DeleteCombinationUseCase.ts
import { injectable, inject } from 'inversify'
import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository.ts'
import { TYPES } from '@/infrastructure/di/types.ts'

@injectable()
export class DeleteCombinationUseCase {
  constructor(@inject(TYPES.CombinationRepository) private repo: ICombinationRepository) {}

  execute(userId: string, comboId: string): Promise<void> {
    return this.repo.delete(userId, comboId)
  }
}
