import { injectable, inject } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject(TYPES.ICategoryRepository) private repo: ICategoryRepository
  ) {}

  execute(userId: string, category: ComboCategory): Promise<ComboCategory> {
    return this.repo.create(userId, category)
  }
}
