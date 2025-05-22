// src/application/useCases/tag/GetTagsUseCase.ts
import { injectable, inject } from 'inversify'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import type { Tag } from '@/domain/entities/Tag'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class GetTagsUseCase {
  constructor(
    @inject(TYPES.ITagRepository)
    private repo: ITagRepository
  ) {}

  execute(userId: string): Promise<Tag[]> {
    return this.repo.getAll(userId)
  }
}
