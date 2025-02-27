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

export enum BoxingActionType {
  Jab = 'jab',
  Cross = 'cross',
  Hook = 'hook',
  Uppercut = 'uppercut',
  Duck = 'duck',
  Slip = 'slip',
  Roll = 'roll',
  Step = 'step',
  Pivot = 'pivot',
  Shift = 'shift',
  Block = 'block'
}


export interface BoxingAction {
  id: number
  name: string
  category: BoxingActionCategory
  side: BoxingActionSide
  type: BoxingActionType
}
