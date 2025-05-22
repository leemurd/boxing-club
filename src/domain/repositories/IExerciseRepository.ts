import type { Record } from '@/domain/entities/Record'

export interface IExerciseRepository {
  logExercise(userId: string, exerciseId: string, amount: number, unit: 'minutes' | 'repetitions'): Promise<void>

  getUserStats(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }>

  getExerciseHistory(userId: string, days: number): Promise<Record[]>

  getFavoriteExercises(userId: string): Promise<string[]>

  updateFavoriteExercises(userId: string, favorites: string[]): Promise<void>
}
