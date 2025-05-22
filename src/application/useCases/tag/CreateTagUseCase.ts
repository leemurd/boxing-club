// src/application/useCases/tag/CreateTagUseCase.ts
import { injectable, inject } from 'inversify'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import type { Tag } from '@/domain/entities/Tag'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class CreateTagUseCase {
  constructor(
    @inject(TYPES.ITagRepository)
    private repo: ITagRepository
  ) {}

  execute(userId: string, tag: Tag): Promise<Tag> {
    return this.repo.create(userId, tag)
  }
}
