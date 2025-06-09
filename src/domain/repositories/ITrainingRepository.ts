// src/domain/repositories/ITrainingRepository.ts
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { MeasurementUnit, ExerciseCategory } from '@/domain/entities/Exercise'

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

  deleteRecord(userId: string, recordId: string): Promise<void>
}
