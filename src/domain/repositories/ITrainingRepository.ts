// src/domain/repositories/ITrainingRepository.ts
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import type { MeasurementUnit } from '@/domain/entities/Exercise.ts'

export interface ITrainingRepository {
  logExercise(userId: string, exerciseId: string, amount: number, unit: MeasurementUnit): Promise<void>

  getUserStats(userId: string): Promise<Record<string, { today: number; total: number }>>

  getExerciseHistory(userId: string, days: number): Promise<TrainingRecord[]>

  getFavoriteExercises(userId: string): Promise<string[]>

  updateFavoriteExercises(userId: string, favorites: string[]): Promise<void>
}
