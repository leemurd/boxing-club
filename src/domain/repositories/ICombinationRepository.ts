// src/domain/repositories/ICombinationRepository.ts
import type { Combination } from '@/domain/entities/Combination'

export interface ICombinationRepository {
  getAll(userId: string): Promise<Combination[]>
  save(userId: string, combo: Combination): Promise<void>
  update(userId: string, combo: Combination): Promise<void>
  delete(userId: string, comboId: string): Promise<void>
  getById(userId: string, comboId: string): Promise<Combination | null>
}
