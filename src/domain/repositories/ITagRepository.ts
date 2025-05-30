// src/domain/repositories/ITagRepository.ts
import type { Tag } from '@/domain/entities/Tag'

export interface ITagRepository {
  getAll(userId: string): Promise<Tag[]>

  getById(userId: string, id: string): Promise<Tag | null>

  create(userId: string, tag: Tag): Promise<Tag>

  update(userId: string, tag: Tag): Promise<void>

  delete(userId: string, id: string): Promise<void>
}
