import type { PositionedAction } from '@/domain/entities/PositionedAction';

export interface IPositionedActionRepository {
  getAll(): Promise<PositionedAction[]>;
  getActionById(id: number): Promise<PositionedAction | null>;
}
