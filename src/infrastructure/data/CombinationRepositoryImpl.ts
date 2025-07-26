// src/infrastructure/data/CombinationRepositoryImpl.ts
import { injectable } from 'inversify'
import { type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore'
import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository'
import type { Combination } from '@/domain/entities/Combination'
import { AbstractFirestoreClass } from '@/infrastructure/firebase/AbstractFirestoreClass.ts'

@injectable()
export class CombinationRepositoryImpl
  extends AbstractFirestoreClass<Combination>
  implements ICombinationRepository
{
  protected readonly collectionName = 'combinations'

  protected toDomain(snapshot: QueryDocumentSnapshot<DocumentData>): Combination {
    const data = snapshot.data() as Combination

    return {
      id: snapshot.id,
      title: data.title,
      punches: data.punches,
      categoryIds: data.categoryIds
    }
  }

  protected toFirestore(entity: Combination): DocumentData {
    return {
      title: entity.title,
      punches: entity.punches,
      categoryIds: entity.categoryIds
    }
  }
}
