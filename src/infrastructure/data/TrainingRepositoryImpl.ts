// src/infrastructure/data/TrainingRepositoryImpl.ts

import { injectable } from 'inversify'
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { MeasurementUnit, ExerciseCategory } from '@/domain/entities/Exercise'
import type { DefaultTagId } from '@/domain/constants/defaultTags'
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig'
import type { ProgressEntity } from '@/presentation/constants/progress/types.ts'

@injectable()
export class TrainingRepositoryImpl implements ITrainingRepository {
  private db = getFirestore(firebaseApp)

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
    const q = query(this.col(userId), where('timestamp', '>=', from.toISOString()), where('timestamp', '<=', to.toISOString()))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any)
    }))
  }

  async getDailyTotals(userId: string, from: Date, to: Date): Promise<ProgressEntity<string>[]> {
    const records = await this.getRecords(userId, from, to)
    type Acc = { reps: number; seconds: number; sets: number }
    const map: Record<string, Acc> = {}

    for (const r of records) {
      const day = r.timestamp.slice(0, 10)
      if (!map[day])
        map[day] = {
          reps: 0,
          seconds: 0,
          sets: 0
        }
      if (r.measurement === 'repetitions') map[day].reps += r.amount
      else map[day].seconds += r.amount
      map[day].sets += 1
    }

    return Object.entries(map).map(([name, { reps, seconds, sets }]) => ({
      name,
      reps,
      minutes: seconds / 60,
      sets
    }))
  }

  async getTotalsByCategory(userId: string, from: Date, to: Date): Promise<ProgressEntity<ExerciseCategory>[]> {
    const records = await this.getRecords(userId, from, to)
    type Acc = { reps: number; seconds: number; sets: number }
    const map: Record<ExerciseCategory, Acc> = {} as any

    for (const r of records) {
      if (!map[r.category])
        map[r.category] = {
          reps: 0,
          seconds: 0,
          sets: 0
        }
      if (r.measurement === 'repetitions') map[r.category].reps += r.amount
      else map[r.category].seconds += r.amount
      map[r.category].sets += 1
    }

    return Object.entries(map).map(([name, { reps, seconds, sets }]) => ({
      name: name as ExerciseCategory,
      reps,
      minutes: seconds / 60,
      sets
    }))
  }

  async getTotalsByTag(userId: string, from: Date, to: Date): Promise<ProgressEntity<DefaultTagId>[]> {
    const records = await this.getRecords(userId, from, to)
    type Acc = { reps: number; seconds: number; sets: number }
    const map: Record<DefaultTagId, Acc> = {} as any

    for (const r of records) {
      for (const t of r.tagIds as DefaultTagId[]) {
        if (!map[t])
          map[t] = {
            reps: 0,
            seconds: 0,
            sets: 0
          }
        if (r.measurement === 'repetitions') map[t].reps += r.amount
        else map[t].seconds += r.amount
        map[t].sets += 1
      }
    }

    return Object.entries(map).map(([name, { reps, seconds, sets }]) => ({
      name: name as DefaultTagId,
      reps,
      minutes: seconds / 60,
      sets
    }))
  }

  async deleteRecord(userId: string, recordId: string): Promise<void> {
    const ref = doc(this.col(userId), recordId)
    await deleteDoc(ref)
  }
}
