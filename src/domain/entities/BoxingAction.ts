export enum BoxingActionCategory {
  PUNCH = 'punch',
  MOVEMENT = 'movement',
  DEFENSE = 'defense'
}

export enum BoxingActionSide {
  LEAD = 'lead',
  REAR = 'rear',
  ANY = 'any'
}

export interface BoxingAction {
  id: number
  name: string
  category: BoxingActionCategory
  side: BoxingActionSide
  type: string
}
