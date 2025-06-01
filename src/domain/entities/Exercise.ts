export enum ExerciseCategory {
  PHYSICS = 'Physics',
  TECHNIQUE = 'Technique',
  PRACTICE = 'Practice'
}

export type MeasurementUnit = 'seconds' | 'repetitions'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  measurement: MeasurementUnit
  /** Может ли выполняться с дополнительным весом */
  canBeWeighted: boolean
  /** Может ли выполняться в ускорённом темпе */
  canBeAccelerated: boolean
  tagIds: string[]
  isFavorite: boolean
  canHaveCombo: boolean
}
