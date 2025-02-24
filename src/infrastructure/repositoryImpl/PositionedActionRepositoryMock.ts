import { injectable } from 'inversify';
import { type IPositionedActionRepository } from '@/domain/repositories/IPositionedActionRepository';
import { type PositionedAction } from '@/domain/entities/PositionedAction';
import { MOCK_ACTIONS } from '../mocks/mockActions';

@injectable()
export class PositionedActionRepositoryMock implements IPositionedActionRepository {
  async getAll(): Promise<PositionedAction[]> {
    return MOCK_ACTIONS;
  }

  async getActionById(id: number): Promise<PositionedAction | null> {
    return MOCK_ACTIONS.find(a => a.id === id) || null;
  }
}
