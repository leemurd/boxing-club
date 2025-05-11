import { container } from '@/infrastructure/di/container.ts'
import { type ICategoryRepository } from '@/domain/repositories/ICategoryRepository.ts'
import { Category } from '@/domain/entities/Category.ts'
import { TYPES } from '@/infrastructure/di/types.ts'

export class UpdateCategoryUseCase {
  static async execute(userId: string, category: Category): Promise<void> {
    const repo = container.get<ICategoryRepository>(TYPES.ICategoryRepository)
    await repo.update(userId, category)
  }
}
