import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentReference } from 'firebase/firestore'
import { injectable } from 'inversify'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { Category } from '@/domain/entities/Category'
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig'

@injectable()
export class CategoryRepositoryImpl implements ICategoryRepository {
  private db = getFirestore(firebaseApp)

  // путь: users/{userId}/categories
  private col(userId: string) {
    return collection(this.db, 'users', userId, 'categories')
  }

  async getAll(userId: string): Promise<Category[]> {
    const snap = await getDocs(this.col(userId))
    return snap.docs.map((d) => new Category(d.id, d.data().name))
  }

  async create(userId: string, name: string): Promise<Category> {
    const colRef = this.col(userId)
    const ref: DocumentReference = await addDoc(colRef, { name })
    return new Category(ref.id, name)
  }

  async update(userId: string, category: Category): Promise<void> {
    const ref = doc(this.db, 'users', userId, 'categories', category.id)
    await updateDoc(ref, { name: category.name })
  }

  async delete(userId: string, id: string): Promise<void> {
    const ref = doc(this.db, 'users', userId, 'categories', id)
    await deleteDoc(ref)
  }
}
