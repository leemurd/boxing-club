// src/application/useCases/tag/GetTagByIdUseCase.ts
import { injectable, inject } from 'inversify'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import type { Tag } from '@/domain/entities/Tag'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetTagByIdUseCase {
  constructor(
    @inject(TYPES.ITagRepository)
    private repo: ITagRepository
  ) {}

  execute(userId: string, tagId: string): Promise<Tag | null> {
    return this.repo.getById(userId, tagId)
  }
}
