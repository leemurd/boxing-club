import { container } from '@/infrastructure/di/container.ts'
import { type ICategoryRepository } from '@/domain/repositories/ICategoryRepository.ts'
import { TYPES } from '@/infrastructure/di/types.ts'

export class DeleteCategoryUseCase {
  static async execute(userId: string, id: string): Promise<void> {
    const repo = container.get<ICategoryRepository>(TYPES.ICategoryRepository)
    await repo.delete(userId, id)
  }
}
