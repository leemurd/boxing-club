import type { DefaultTagId } from '@/domain/constants/defaultTags.ts'

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
  canBeWeighted: boolean
  canBeAccelerated: boolean
  alwaysWeighted?: boolean
  alwaysAccelerated?: boolean
  tagIds: DefaultTagId[] | string[]
  isFavorite: boolean
  canHaveCombo: boolean
}
