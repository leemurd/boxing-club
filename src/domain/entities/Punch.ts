import { type BoxingAction } from './BoxingAction';
import { ActionCategory } from './ActionCategory';

export type PunchType = 'jab' | 'cross' | 'hook' | 'uppercut';

export class Punch implements BoxingAction {
  id: number;
  name: string;
  category = ActionCategory.PUNCH;
  possibleNext: number[];

  constructor(id: number, name: string, possibleNext: number[] = []) {
    this.id = id;
    this.name = name;
    this.possibleNext = possibleNext;
  }
}
