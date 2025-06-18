import type { User } from '@/domain/entities/User.ts'

export interface IUserRepository {
  createUser(user: User): Promise<void>
  getUser(userId: string): Promise<User | null>
  updateUser(user: User): Promise<void>
}
