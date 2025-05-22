import { injectable, inject } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import type { Category } from '@/domain/entities/Category'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetCategoriesUseCase {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private repo: ICategoryRepository
  ) {}

  execute(userId: string): Promise<Category[]> {
    return this.repo.getAll(userId)
  }
}
