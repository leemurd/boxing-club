import { injectable, inject } from 'inversify'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { User } from '@/domain/entities/User'
import { TYPES } from '@/infrastructure/di/types'

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(user: User): Promise<void> {
    await this.userRepository.createUser(user)
  }
}
