// src/infrastructure/data/TagRepositoryImpl.ts
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentReference
} from 'firebase/firestore'
import { injectable } from 'inversify'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import type { Tag } from '@/domain/entities/Tag'
import { db } from '@/infrastructure/firebase/firebaseConfig'

@injectable()
export class TagRepositoryImpl implements ITagRepository {
  private col(userId: string) {
    return collection(db, 'users', userId, 'tags')
  }

  async getAll(userId: string): Promise<Tag[]> {
    const snap = await getDocs(this.col(userId))
    return snap.docs.map((d) => ({
      id: d.id,
      name: d.data().name
    }))
  }

  async getById(userId: string, id: string): Promise<Tag | null> {
    const ref = doc(db, 'users', userId, 'tags', id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return {
      id: snap.id,
      name: snap.data().name
    }
  }

  async create(userId: string, tag: Tag): Promise<Tag> {
    const colRef = this.col(userId)
    let ref: DocumentReference

    if (tag.id) {
      // Жёстко фиксированный ID: используем setDoc
      ref = doc(colRef, tag.id)
      await setDoc(ref, { name: tag.name })
      return tag
    } else {
      // Генерация нового ID
      ref = await addDoc(colRef, { name: tag.name })
      return {
        id: ref.id,
        name: tag.name
      }
    }
  }

  async update(userId: string, tag: Tag): Promise<void> {
    const ref = doc(db, 'users', userId, 'tags', tag.id)
    await updateDoc(ref, { name: tag.name })
  }

  async delete(userId: string, id: string): Promise<void> {
    const ref = doc(db, 'users', userId, 'tags', id)
    await deleteDoc(ref)
  }
}
