import {
  Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
  type CollectionReference,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type DocumentSnapshot
} from 'firebase/firestore'
import { injectable, inject } from 'inversify'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export abstract class AbstractFirestoreClass<T extends { id?: string }> {
  protected abstract readonly collectionName: string

  constructor(
    @inject(TYPES.Firestore) protected readonly db: Firestore
  ) {}

  /** users/{userId}/{collectionName} */
  protected col(userId: string): CollectionReference<DocumentData> {
    return collection(this.db, 'users', userId, this.collectionName)
  }

  async getAll(userId: string): Promise<T[]> {
    const snap: QuerySnapshot<DocumentData> = await getDocs(this.col(userId))
    return snap.docs.map((d) => this.toDomain(d))
  }

  async getById(userId: string, id: string): Promise<T | null> {
    const snap: DocumentSnapshot<DocumentData> = await getDoc(
      doc(this.db, 'users', userId, this.collectionName, id)
    )
    if (!snap.exists()) return null
    return this.toDomain(snap as QueryDocumentSnapshot<DocumentData>)
  }

  async create(userId: string, entity: T): Promise<T> {
    const colRef = this.col(userId)
    if (entity.id) {
      await setDoc(doc(colRef, entity.id), this.toFirestore(entity))
      return entity
    }
    const ref = await addDoc(colRef, this.toFirestore(entity))
    return {
      ...entity,
      id: ref.id
    }
  }

  async update(userId: string, entity: T & { id: string }): Promise<void> {
    await updateDoc(
      doc(this.db, 'users', userId, this.collectionName, entity.id),
      this.toFirestore(entity)
    )
  }

  async delete(userId: string, id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'users', userId, this.collectionName, id))
  }

  /** Преобразование из Firestore в доменную сущность */
  protected abstract toDomain(snapshot: QueryDocumentSnapshot<DocumentData>): T

  /** Преобразование из доменной сущности в структуру для Firestore */
  protected abstract toFirestore(entity: T): DocumentData
}
