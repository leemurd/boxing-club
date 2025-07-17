import { injectable } from 'inversify'
import type { Tag } from '@/domain/entities/Tag'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { AbstractFirestoreClass } from '@/infrastructure/firebase/AbstractFirestoreClass.ts'

@injectable()
export class TagRepositoryImpl extends AbstractFirestoreClass<Tag> implements ITagRepository {
  protected readonly collectionName = 'tags'

  protected toDomain(snapshot: QueryDocumentSnapshot<DocumentData>): Tag {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      name: data.name,
      isAutomatic: !!data.isAutomatic
    }
  }

  protected toFirestore(entity: Tag): DocumentData {
    return {
      name: entity.name,
      isAutomatic: entity.isAutomatic ?? false
    }
  }
}
