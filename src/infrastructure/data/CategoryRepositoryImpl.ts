// // src/infrastructure/data/CategoryRepositoryImpl.ts
import { injectable } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { type ComboCategory } from '@/domain/entities/ComboCategory.ts'
import { AbstractFirestoreClass } from '@/infrastructure/firebase/AbstractFirestoreClass.ts'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

@injectable()
export class CategoryRepositoryImpl
  extends AbstractFirestoreClass<ComboCategory>
  implements ICategoryRepository
{
  protected readonly collectionName = 'categories'

  protected toDomain(snapshot: QueryDocumentSnapshot<DocumentData>): ComboCategory {
    const data = snapshot.data()
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
