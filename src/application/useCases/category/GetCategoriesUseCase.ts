import { container } from '@/infrastructure/di/container.ts'
import { type ICategoryRepository } from '@/domain/repositories/ICategoryRepository.ts'
import { Category } from '@/domain/entities/Category.ts'
import { TYPES } from '@/infrastructure/di/types.ts'

export class GetCategoriesUseCase {
  static async execute(userId: string): Promise<Category[]> {
    const repo = container.get<ICategoryRepository>(TYPES.ICategoryRepository)
    return repo.getAll(userId)
  }
}
