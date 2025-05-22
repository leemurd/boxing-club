import type { Category } from '@/domain/entities/Category'

export interface ICategoryRepository {
  getAll(userId: string): Promise<Category[]>
  create(userId: string, name: string): Promise<Category>
  update(userId: string, category: Category): Promise<void>
  delete(userId: string, id: string): Promise<void>
  getById(userId: string, id: string): Promise<Category | null>
}
