// src/domain/repositories/ICategoryRepository.ts
import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'

export interface ICategoryRepository {
  getAll(userId: string): Promise<ComboCategory[]>
  create(userId: string, name: string): Promise<ComboCategory>
  update(userId: string, category: ComboCategory): Promise<void>
  delete(userId: string, id: string): Promise<void>
  getById(userId: string, id: string): Promise<ComboCategory | null>
}
