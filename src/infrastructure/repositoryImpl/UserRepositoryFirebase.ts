// import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
// import { db } from '@/infrastructure/firebase/firebaseConfig'
// import type { User } from '@/domain/entities/User'
// import { injectable } from 'inversify'
//
// @injectable()
// export class UserRepositoryFirebase {
//   async getAllUsers(): Promise<User[]> {
//     const colRef = collection(db, 'users')
//     const snapshot = await getDocs(colRef)
//     return snapshot.docs.map(d => d.data() as User)
//   }
//
//   async saveUser(user: User): Promise<void> {
//     const docRef = doc(db, 'users', user.id)
//     await setDoc(docRef, user)
//   }
// }
