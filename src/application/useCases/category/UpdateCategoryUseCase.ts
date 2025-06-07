import { injectable, inject } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class UpdateCategoryUseCase {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private repo: ICategoryRepository
  ) {}

  execute(userId: string, category: ComboCategory): Promise<void> {
    return this.repo.update(userId, category)
  }
}
