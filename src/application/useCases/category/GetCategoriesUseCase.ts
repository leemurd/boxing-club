import { injectable, inject } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetCategoriesUseCase {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private repo: ICategoryRepository
  ) {}

  execute(userId: string): Promise<ComboCategory[]> {
    return this.repo.getAll(userId)
  }
}
