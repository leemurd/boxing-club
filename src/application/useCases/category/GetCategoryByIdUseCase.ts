import { injectable, inject } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetCategoryByIdUseCase {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private repo: ICategoryRepository
  ) {}

  execute(userId: string, categoryId: string): Promise<ComboCategory | null> {
    return this.repo.getById(userId, categoryId)
  }
}
