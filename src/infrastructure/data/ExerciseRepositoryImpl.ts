// src/infrastructure/data/ExerciseRepositoryImpl.ts
import { injectable } from 'inversify'
import {
  doc,
  addDoc,
  setDoc,
  DocumentReference,
  type QueryDocumentSnapshot,
  type DocumentData
} from 'firebase/firestore'
import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import type { Exercise } from '@/domain/entities/Exercise'
import { AbstractFirestoreClass } from '@/infrastructure/firebase/AbstractFirestoreClass.ts'

@injectable()
export class ExerciseRepositoryImpl
  extends AbstractFirestoreClass<Exercise>
  implements IExerciseRepository
{
  protected readonly collectionName = 'exercises'

  async create(userId: string, exercise: Exercise): Promise<Exercise> {
    const colRef = this.col(userId)
    let ref: DocumentReference

    // if default ex - set with default-id
    if (exercise.id) {
      ref = doc(colRef, exercise.id)
      await setDoc(ref, {
        name: exercise.name,
        category: exercise.category,
        measurement: exercise.measurement,
        canBeWeighted: exercise.canBeWeighted ?? exercise.alwaysWeighted ?? false,
        canBeAccelerated: exercise.canBeAccelerated ?? exercise.alwaysAccelerated ?? false,
        alwaysAccelerated: exercise.alwaysAccelerated || false,
        alwaysWeighted: exercise.alwaysWeighted || false,
        tagIds: exercise.tagIds,
        isFavorite: exercise.isFavorite,
        canHaveCombo: exercise.canHaveCombo
      })

      return exercise
    } else {
      ref = await addDoc(colRef, {
        name: exercise.name,
        category: exercise.category,
        measurement: exercise.measurement,
        canBeWeighted: exercise.canBeWeighted ?? exercise.alwaysWeighted ?? false,
        canBeAccelerated: exercise.canBeAccelerated ?? exercise.alwaysAccelerated ?? false,
        alwaysAccelerated: exercise.alwaysAccelerated || false,
        alwaysWeighted: exercise.alwaysWeighted || false,
        tagIds: exercise.tagIds,
        isFavorite: exercise.isFavorite,
        canHaveCombo: exercise.canHaveCombo
      })
    }

    return {
      ...exercise,
      id: ref.id
    }
  }

  protected toDomain(snapshot: QueryDocumentSnapshot<DocumentData>): Exercise {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      name: data.name,
      category: data.category,
      measurement: data.measurement,
      canBeWeighted: data.canBeWeighted ?? data.alwaysWeighted ?? false,
      canBeAccelerated: data.canBeAccelerated ?? data.alwaysAccelerated ?? false,
      alwaysAccelerated: data.alwaysAccelerated || false,
      alwaysWeighted: data.alwaysWeighted || false,
      tagIds: data.tagIds,
      isFavorite: data.isFavorite,
      canHaveCombo: data.canHaveCombo
    }
  }

  protected toFirestore(entity: Exercise): DocumentData {
    return {
      name: entity.name,
      category: entity.category,
      measurement: entity.measurement,
      canBeWeighted: entity.canBeWeighted ?? entity.alwaysWeighted ?? false,
      canBeAccelerated: entity.canBeAccelerated ?? entity.alwaysAccelerated ?? false,
      alwaysAccelerated: entity.alwaysAccelerated || false,
      alwaysWeighted: entity.alwaysWeighted || false,
      tagIds: entity.tagIds,
      isFavorite: entity.isFavorite,
      canHaveCombo: entity.canHaveCombo
    }
  }
}
