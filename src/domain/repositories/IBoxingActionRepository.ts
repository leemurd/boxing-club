import { type BoxingAction } from '../entities/BoxingAction';

export interface IBoxingActionRepository {
  getAllActions(): Promise<BoxingAction[]>;
  getActionById(id: number): Promise<BoxingAction | null>;
}
