import { ExerciseCategory } from '@/domain/entities/Exercise.ts'

export interface Record {
  id?: string // Firestore генерирует ID
  userId: string
  exerciseId: string
  category: ExerciseCategory
  measurement: 'minutes' | 'repetitions'
  amount: number
  timestamp: string // ISO строка
}
