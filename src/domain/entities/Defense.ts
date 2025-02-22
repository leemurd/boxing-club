import { type BoxingAction } from './BoxingAction';
import { ActionCategory } from './ActionCategory';

export class Defense implements BoxingAction {
  id: number;
  name: string;
  category = ActionCategory.DEFENSE;
  possibleNext: number[];

  constructor(id: number, name: string, possibleNext: number[] = []) {
    this.id = id;
    this.name = name;
    this.possibleNext = possibleNext;
  }
}
