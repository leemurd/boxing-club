import { injectable, inject } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class DeleteCategoryUseCase {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private repo: ICategoryRepository
  ) {}

  execute(userId: string, categoryId: string): Promise<void> {
    return this.repo.delete(userId, categoryId)
  }
}
