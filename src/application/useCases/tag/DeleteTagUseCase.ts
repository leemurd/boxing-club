// src/application/useCases/tag/DeleteTagUseCase.ts
import { injectable, inject } from 'inversify'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class DeleteTagUseCase {
  constructor(
    @inject(TYPES.ITagRepository)
    private repo: ITagRepository
  ) {}

  execute(userId: string, tagId: string): Promise<void> {
    return this.repo.delete(userId, tagId)
  }
}
