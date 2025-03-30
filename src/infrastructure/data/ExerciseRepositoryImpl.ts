import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { ExerciseCategory, type MeasurementUnit } from '@/domain/entities/Exercise.ts'
import { EXERCISES } from '@/domain/constants/exercises.ts'

export class ExerciseRepositoryImpl implements IExerciseRepository {
  private logsCollection(userId: string) {
    return collection(db, `users/${userId}/exerciseLogs`)
  }

  private userDoc(userId: string) {
    return doc(db, 'users', userId)
  }

  async logExercise(userId: string, exerciseId: string, amount: number, unit: MeasurementUnit): Promise<void> {
    const timestamp = new Date().toISOString()
    const newRecord: Omit<TrainingRecord, 'id'> = {
      userId,
      exerciseId,
      category: EXERCISES.find((item) => item.id === exerciseId)?.category || ExerciseCategory.PHYSICS,
      measurement: unit,
      amount,
      timestamp
    }
    await setDoc(doc(this.logsCollection(userId)), newRecord)
  }

  async getUserStats(userId: string): Promise<{ [exerciseId: string]: { today: number; total: number } }> {
    const logsSnapshot = await getDocs(this.logsCollection(userId))
    const stats: { [exerciseId: string]: { today: number; total: number } } = {}
    const todayStr = new Date().toDateString()

    logsSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as TrainingRecord
      const exId = data.exerciseId
      if (!stats[exId]) {
        stats[exId] = {
          today: 0,
          total: 0
        }
      }
      stats[exId].total += data.amount
      if (new Date(data.timestamp).toDateString() === todayStr) {
        stats[exId].today += data.amount
      }
    })
    return stats
  }

  async getExerciseHistory(userId: string, days: number): Promise<TrainingRecord[]> {
    const logsSnapshot = await getDocs(this.logsCollection(userId))
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const history: TrainingRecord[] = []
    logsSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as TrainingRecord
      if (new Date(data.timestamp) >= startDate) {
        history.push({
          id: docSnap.id,
          ...data
        })
      }
    })
    // Сортируем по убыванию времени
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return history
  }

  async getFavoriteExercises(userId: string): Promise<string[]> {
    const userSnap = await getDoc(this.userDoc(userId))
    return userSnap.exists() ? userSnap.data()?.favorites || [] : []
  }

  async updateFavoriteExercises(userId: string, favorites: string[]): Promise<void> {
    await setDoc(this.userDoc(userId), { favorites }, { merge: true })
  }
}
