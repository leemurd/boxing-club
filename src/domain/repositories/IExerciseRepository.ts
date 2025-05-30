import type { Exercise } from '@/domain/entities/Exercise'

export interface IExerciseRepository {
  getAll(userId: string): Promise<Exercise[]>
  getById(userId: string, id: string): Promise<Exercise | null>
  create(userId: string, exercise: Exercise): Promise<Exercise>
  update(userId: string, exercise: Exercise): Promise<void>
  delete(userId: string, id: string): Promise<void>
}
