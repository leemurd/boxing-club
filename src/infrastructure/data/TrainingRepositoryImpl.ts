// src/infrastructure/data/TrainingRepositoryImpl.ts

import { injectable } from 'inversify'
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { MeasurementUnit, ExerciseCategory } from '@/domain/entities/Exercise'
import { db } from '@/infrastructure/firebase/firebaseConfig'

@injectable()
export class TrainingRepositoryImpl implements ITrainingRepository {
  private db = db

  private col(userId: string) {
    return collection(this.db, 'users', userId, 'trainingRecords')
  }

  async logExercise(
    userId: string,
    exerciseId: string,
    category: ExerciseCategory,
    amount: number,
    unit: MeasurementUnit,
    tagIds: string[],
    comboId: string | null
  ): Promise<void> {
    const data: Omit<TrainingRecord, 'id'> = {
      userId,
      exerciseId,
      category,
      measurement: unit,
      amount,
      timestamp: new Date().toISOString(),
      tagIds,
      comboId: comboId ?? null
    }
    await addDoc(this.col(userId), data)
  }

  async getRecords(userId: string, from: Date, to: Date): Promise<TrainingRecord[]> {
    const q = query(this.col(userId), where('timestamp', '>=', from.toISOString()), where('timestamp', '<', to.toISOString()))
    const snap = await getDocs(q)
    return snap.docs.map(
      (d) =>
        ({
          id: d.id,
          userId,
          ...d.data()
        }) as TrainingRecord
    )
  }

  async deleteRecord(userId: string, recordId: string): Promise<void> {
    const ref = doc(this.col(userId), recordId)
    await deleteDoc(ref)
  }
}
