// src/infrastructure/data/CombinationRepositoryImpl.ts
import { injectable } from 'inversify'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import { collection, doc, getDocs, setDoc, deleteDoc, DocumentReference, updateDoc } from 'firebase/firestore'
import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository'
import type { Combination } from '@/domain/entities/Combination'

@injectable()
export class CombinationRepositoryImpl implements ICombinationRepository {
  private col(userId: string) {
    return collection(db, 'users', userId, 'combinations')
  }

  async getAll(userId: string): Promise<Combination[]> {
    const snap = await getDocs(this.col(userId))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        title: data.title,
        punches: data.punches,
        categoryIds: data.categoryIds
      }
    })
  }

  async save(userId: string, combo: Combination): Promise<void> {
    const colRef = this.col(userId)
    let docRef: DocumentReference

    if (combo.id) {
      docRef = doc(colRef, combo.id)
    } else {
      docRef = doc(colRef)
    }

    await setDoc(docRef, {
      title: combo.title,
      punches: combo.punches,
      categoryIds: combo.categoryIds
    })
  }

  async update(userId: string, combo: Combination): Promise<void> {
    const ref = doc(db, 'users', userId, 'combinations', combo.id)
    await updateDoc(ref, {
      title: combo.title,
      punches: combo.punches,
      categoryIds: combo.categoryIds
    })
  }

  async delete(userId: string, comboId: string): Promise<void> {
    const ref = doc(this.col(userId), comboId)
    await deleteDoc(ref)
  }
}
