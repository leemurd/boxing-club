// src/domain/repositories/ITrainingRepository.ts

import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { MeasurementUnit, ExerciseCategory } from '@/domain/entities/Exercise'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'
import type { DefaultTagId } from '@/domain/constants/defaultTags.ts'

export interface ITrainingRepository {
  logExercise(
    userId: string,
    exerciseId: string,
    category: ExerciseCategory,
    amount: number,
    unit: MeasurementUnit,
    tagIds: string[],
    comboId: string | null
  ): Promise<void>

  getRecords(userId: string, from: Date, to: Date): Promise<TrainingRecord[]>

  getDailyTotals(userId: string, from: Date, to: Date): Promise<ProgressEntity<string>[]>

  getTotalsByCategory(userId: string, from: Date, to: Date): Promise<Array<ProgressEntity<ExerciseCategory>>>

  getTotalsByTag(userId: string, from: Date, to: Date): Promise<Array<ProgressEntity<DefaultTagId>>>

  deleteRecord(userId: string, recordId: string): Promise<void>
}
