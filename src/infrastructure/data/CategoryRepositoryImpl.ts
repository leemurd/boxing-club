// // src/infrastructure/data/CategoryRepositoryImpl.ts
import { injectable } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { type ComboCategory } from '@/domain/entities/ComboCategory.ts'
import { AbstractFirestoreClass } from '@/infrastructure/firebase/AbstractFirestoreClass.ts'
import {
  addDoc,
  doc,
  type DocumentData,
  type DocumentReference,
  type QueryDocumentSnapshot,
  setDoc
} from 'firebase/firestore'

@injectable()
export class CategoryRepositoryImpl
  extends AbstractFirestoreClass<ComboCategory>
  implements ICategoryRepository
{
  protected readonly collectionName = 'categories'

  async create(userId: string, cat: ComboCategory): Promise<ComboCategory> {
    const colRef = this.col(userId)
    let ref: DocumentReference

    // for default tags from const
    if (cat.id) {
      ref = doc(colRef, cat.id)
      await setDoc(ref, { name: cat.name })
      return cat
    } else {
      // for new tags
      ref = await addDoc(colRef, { name: cat.name })
      return {
        id: ref.id,
        name: cat.name
      }
    }
  }

  protected toDomain(snapshot: QueryDocumentSnapshot<DocumentData>): ComboCategory {
    const data = snapshot.data() as ComboCategory
    return {
      id: snapshot.id,
      name: data.name
    }
  }

  protected toFirestore(entity: ComboCategory): DocumentData {
    return {
      name: entity.name
    }
  }
}
