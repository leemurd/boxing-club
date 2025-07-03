import { ExerciseCategory, type MeasurementUnit } from '@/domain/entities/Exercise.ts'

export interface TrainingRecord {
  id?: string
  userId: string
  exerciseId: string
  category: ExerciseCategory
  measurement: MeasurementUnit
  amount: number
  tagIds: string[]
  timestamp: string // ISO строка
  comboId: string | null
}
