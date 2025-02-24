// src/domain/entities/PositionedAction.ts
import { Stance } from './Stance';
import { ActionCategory } from './ActionCategory';

export interface PositionedAction {
  id: number;
  name: string;
  category: ActionCategory; // PUNCH | DEFENSE | MOVEMENT
  fromPosition: Stance;
  toPosition: Stance;
}
