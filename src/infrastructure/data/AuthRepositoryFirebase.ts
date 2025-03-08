// src/infrastructure/repositoryImpl/AuthRepositoryFirebase.ts
import { type IAuthRepository } from '@/domain/repositories/IAuthRepository'
import { auth } from '@/infrastructure/firebase/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { injectable } from 'inversify'

@injectable()
export class AuthRepositoryFirebase implements IAuthRepository {
  async signUp(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  async signIn(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async signOut(): Promise<void> {
    return signOut(auth)
  }
}
