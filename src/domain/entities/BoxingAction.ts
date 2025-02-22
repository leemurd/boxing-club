import { ActionCategory } from './ActionCategory';

export interface BoxingAction {
  id: number;
  name: string;
  category: ActionCategory;
  possibleNext: number[]; // ID действий, которые могут идти следом
}
