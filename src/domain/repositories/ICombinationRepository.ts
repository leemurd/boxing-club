// src/domain/repositories/ICombinationRepository.ts
import type { Combination } from '@/domain/entities/Combination'

export interface ICombinationRepository {
  getAll(userId: string): Promise<Combination[]>
  getById(userId: string, comboId: string): Promise<Combination | null>
  create(userId: string, combo: Combination): Promise<Combination>
  update(userId: string, combo: Combination): Promise<void>
  delete(userId: string, comboId: string): Promise<void>
}
