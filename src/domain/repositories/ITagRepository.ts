// src/domain/repositories/ITagRepository.ts
import type { Tag } from '@/domain/entities/Tag'

export interface ITagRepository {
  /** Возвращает все теги пользователя */
  getAll(userId: string): Promise<Tag[]>

  /** Возвращает один тег по его ID или null, если не найден */
  getById(userId: string, id: string): Promise<Tag | null>

  /**
   * Создаёт новый тег с заданным ID (если нужно заранее зафиксировать)
   * или сгенерированным.
   */
  create(userId: string, tag: Tag): Promise<Tag>

  /** Обновляет имя существующего тега */
  update(userId: string, tag: Tag): Promise<void>

  /** Удаляет тег по ID */
  delete(userId: string, id: string): Promise<void>
}
