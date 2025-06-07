// src/infrastructure/data/ExerciseRepositoryImpl.ts
import { injectable } from 'inversify'
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, setDoc, deleteDoc, DocumentReference } from 'firebase/firestore'
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { Exercise } from '@/domain/entities/Exercise'
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig'
import { EXERCISES } from '@/domain/constants/exercises.ts'

@injectable()
export class ExerciseRepositoryImpl implements IExerciseRepository {
  private db = getFirestore(firebaseApp)
  private col(userId: string) {
    return collection(this.db, 'users', userId, 'exercises')
  }

  async getAll(userId: string): Promise<Exercise[]> {
    const snap = await getDocs(this.col(userId))
    return [
      // ...EXERCISES,
      ...snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Exercise, 'id'>)
      }))
    ]
  }

  async getById(userId: string, id: string): Promise<Exercise | null> {
    // 1) Сначала пытаемся найти в дефолтных константах
    const defaultEx = EXERCISES.find((e) => e.id === id)
    if (defaultEx) {
      return { ...defaultEx }
    }

    // 2) Если не нашли среди дефолтов — ищем в Firestore (пользовательские)
    const ref = doc(this.db, 'users', userId, 'exercises', id)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return {
        id: snap.id,
        ...(snap.data() as Omit<Exercise, 'id'>)
      }
    }

    return null
  }

  async create(userId: string, exercise: Exercise): Promise<Exercise> {
    const colRef = this.col(userId)
    const ref: DocumentReference = await addDoc(colRef, {
      name: exercise.name,
      category: exercise.category,
      measurement: exercise.measurement,
      canBeWeighted: exercise.canBeWeighted,
      canBeAccelerated: exercise.canBeAccelerated,
      tagIds: exercise.tagIds,
      isFavorite: exercise.isFavorite
    })
    return {
      ...exercise,
      id: ref.id
    }
  }

  async update(userId: string, exercise: Exercise): Promise<void> {
    const ref = doc(this.db, 'users', userId, 'exercises', exercise.id)
    await setDoc(
      ref,
      {
        name: exercise.name,
        category: exercise.category,
        measurement: exercise.measurement,
        canBeWeighted: exercise.canBeWeighted,
        canBeAccelerated: exercise.canBeAccelerated,
        tagIds: exercise.tagIds,
        isFavorite: exercise.isFavorite
      },
      { merge: true }
    )
  }

  async delete(userId: string, id: string): Promise<void> {
    const ref = doc(this.db, 'users', userId, 'exercises', id)
    await deleteDoc(ref)
  }
}
