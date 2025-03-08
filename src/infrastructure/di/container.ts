import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { type IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository.ts'
import { BoxingActionRepositoryMock } from '@/infrastructure/data/BoxingActionRepositoryMock.ts'
import { type IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase.ts'
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig.ts'
import { AuthRepositoryFirebase } from '@/infrastructure/data/AuthRepositoryFirebase.ts'
import { UserRepositoryFirebase } from '@/infrastructure/data/UserRepositoryFirebase.ts'

const container = new Container()

// Регистрируем репозиторий
container
  .bind<IBoxingActionRepository>(TYPES.IPunchRepository)
  .to(BoxingActionRepositoryMock)
  .inSingletonScope()

// Регистрируем UseCase
container.bind<GetPunchesUseCase>(TYPES.GetPunchesUseCase).to(GetPunchesUseCase).inSingletonScope()
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepositoryFirebase).inSingletonScope()
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryFirebase)
container.bind(TYPES.FirebaseApp).toConstantValue(firebaseApp)

export { container }
