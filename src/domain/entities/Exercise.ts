export enum ExerciseCategory {
  TECHNIQUE = 'Technique',
  PHYSICS = 'Physics',
  PRACTICE = 'Practice'
}

export type MeasurementUnit = 'minutes' | 'repetitions'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  measurement: MeasurementUnit
  isCustom?: boolean // true, если упражнение создано пользователем
}
