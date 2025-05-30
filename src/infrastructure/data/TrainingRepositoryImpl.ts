// src/infrastructure/data/TrainingRepositoryImpl.ts

import { collection, addDoc, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore'
import { injectable } from 'inversify'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import type { MeasurementUnit } from '@/domain/entities/Exercise.ts'

@injectable()
export class TrainingRepositoryImpl implements ITrainingRepository {
  private basePath(userId: string) {
    return collection(db, 'users', userId, 'trainingRecords')
  }

  async logExercise(userId: string, exerciseId: string, amount: number, unit: MeasurementUnit): Promise<void> {
    await addDoc(this.basePath(userId), {
      exerciseId,
      amount,
      unit,
      timestamp: Date.now()
    })
  }

  async getUserStats(userId: string) {
    const records = await getDocs(this.basePath(userId))
    const stats: Record<string, { today: number; total: number }> = {}
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    records.docs.forEach((d) => {
      const { exerciseId, amount, unit, timestamp } = d.data() as any
      if (!stats[exerciseId])
        stats[exerciseId] = {
          today: 0,
          total: 0
        }
      stats[exerciseId].total += amount
      if (timestamp >= todayStart.getTime()) {
        stats[exerciseId].today += amount
      }
    })
    return stats
  }

  async getExerciseHistory(userId: string, days: number) {
    const since = Date.now() - days * 24 * 60 * 60 * 1000
    const q = query(this.basePath(userId), where('timestamp', '>=', since))
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as TrainingRecord)
  }

  async getFavoriteExercises(userId: string) {
    const docRef = doc(db, 'users', userId, 'preferences', 'favorites')
    const snap = await getDoc(docRef)
    return snap.exists() ? (snap.data().list as string[]) : []
  }

  async updateFavoriteExercises(userId: string, favorites: string[]) {
    const docRef = doc(db, 'users', userId, 'preferences', 'favorites')
    await setDoc(docRef, { list: favorites }, { merge: true })
  }
}
