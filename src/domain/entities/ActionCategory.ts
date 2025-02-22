export enum ActionCategory {
  PUNCH = 'punch',
  DEFENSE = 'defense',
  MOVEMENT = 'movement',
}

// Тип, объединяющий все строки из ActionCategory:
export type ActionCategoryValue = (typeof ActionCategory)[keyof typeof ActionCategory];
