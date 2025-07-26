import { injectable } from 'inversify'
import type { Tag } from '@/domain/entities/Tag'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import {
  addDoc,
  doc,
  type DocumentData,
  type DocumentReference,
  type QueryDocumentSnapshot,
  setDoc
} from 'firebase/firestore'
import { AbstractFirestoreClass } from '@/infrastructure/firebase/AbstractFirestoreClass.ts'

@injectable()
export class TagRepositoryImpl extends AbstractFirestoreClass<Tag> implements ITagRepository {
  protected readonly collectionName = 'tags'

  async create(userId: string, tag: Tag): Promise<Tag> {
    const colRef = this.col(userId)
    let ref: DocumentReference

    // for default tags from const
    if (tag.id) {
      ref = doc(colRef, tag.id)
      await setDoc(ref, { name: tag.name })
      return tag
    } else {
      // for new tags
      ref = await addDoc(colRef, { name: tag.name })
      return {
        id: ref.id,
        name: tag.name
      }
    }
  }

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
