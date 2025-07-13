import { injectable } from 'inversify'
import { type IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository'
import { type BoxingAction } from '@/domain/entities/BoxingAction.ts'
import { MOCK_ACTIONS } from '../mocks/mockActions'

@injectable()
export class BoxingActionRepositoryMock implements IBoxingActionRepository {
  async getAllActions(): Promise<BoxingAction[]> {
    return MOCK_ACTIONS
  }

  async getActionById(id: number): Promise<BoxingAction | null> {
    return MOCK_ACTIONS.find((a) => a.id === id) || null
  }
}
