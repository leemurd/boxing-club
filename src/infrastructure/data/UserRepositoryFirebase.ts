import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import { db } from '@/infrastructure/firebase/firebaseConfig'
import { injectable } from 'inversify'

@injectable()
export class UserRepositoryFirebase implements IUserRepository {
  async createUser(user: User): Promise<void> {
    const userDoc = doc(db, 'users', user.id)
    await setDoc(userDoc, user, { merge: true })
  }

  async getUser(userId: string): Promise<User | null> {
    const userDoc = doc(db, 'users', userId)
    const docSnap = await getDoc(userDoc)
    if (docSnap.exists()) {
      return docSnap.data() as User
    }
    return null
  }

  async updateUser(user: User): Promise<void> {
    const userDoc = doc(db, 'users', user.id)
    await setDoc(userDoc, user, { merge: true })
  }
}
