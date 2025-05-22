// src/application/useCases/tag/UpdateTagUseCase.ts
import { injectable, inject } from 'inversify'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import type { Tag } from '@/domain/entities/Tag'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class UpdateTagUseCase {
  constructor(
    @inject(TYPES.ITagRepository)
    private repo: ITagRepository
  ) {}

  execute(userId: string, tag: Tag): Promise<void> {
    return this.repo.update(userId, tag)
  }
}
