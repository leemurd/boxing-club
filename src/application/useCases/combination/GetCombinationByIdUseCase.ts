import { injectable, inject } from 'inversify'
import { TYPES } from '@/infrastructure/di/types'
import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository.ts'
import type { Combination } from '@/domain/entities/Combination.ts'

@injectable()
export class GetCombinationByIdUseCase {
  constructor(@inject(TYPES.CombinationRepository) private repo: ICombinationRepository) {}

  execute(userId: string, id: string): Promise<Combination | null> {
    return this.repo.getById(userId, id)
  }
}
