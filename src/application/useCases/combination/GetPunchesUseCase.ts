import { inject, injectable } from 'inversify'
import { type IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository.ts'
import { TYPES } from '@/infrastructure/di/types.ts'
import { type BoxingAction } from '@/domain/entities/BoxingAction.ts'

@injectable()
export class GetPunchesUseCase {
  constructor(@inject(TYPES.IPunchRepository) private punchRepository: IBoxingActionRepository) {}

  async execute(): Promise<BoxingAction[]> {
    return this.punchRepository.getAllActions()
  }

  async getPunchById(id: number): Promise<BoxingAction | null> {
    return this.punchRepository.getActionById(id)
  }
}
