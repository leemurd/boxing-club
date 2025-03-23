import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import type { IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository'
import { BoxingActionRepositoryMock } from '@/infrastructure/data/BoxingActionRepositoryMock'
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase'
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig'
import { AuthRepositoryFirebase } from '@/infrastructure/data/AuthRepositoryFirebase'
import { UserRepositoryFirebase } from '@/infrastructure/data/UserRepositoryFirebase'

import { LogExerciseUseCase } from '@/application/useCases/LogExerciseUseCase'
import { GetUserStatsUseCase } from '@/application/useCases/GetUserStatsUseCase'
import { GetExerciseHistoryUseCase } from '@/application/useCases/GetExerciseHistoryUseCase'
import { ManageFavoriteExercisesUseCase } from '@/application/useCases/ManageFavoriteExercisesUseCase'
import { ExerciseRepositoryImpl } from '@/infrastructure/data/ExerciseRepositoryImpl'

const container = new Container()

// Регистрируем репозитории
container.bind<IBoxingActionRepository>(TYPES.IPunchRepository).to(BoxingActionRepositoryMock).inSingletonScope()
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepositoryFirebase).inSingletonScope()
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryFirebase).inSingletonScope()
container.bind(TYPES.ExerciseRepository).to(ExerciseRepositoryImpl).inSingletonScope()

// Регистрируем use case'ы для упражнений
container.bind<GetPunchesUseCase>(TYPES.GetPunchesUseCase).to(GetPunchesUseCase).inSingletonScope()

container
  .bind(TYPES.LogExerciseUseCase)
  .toDynamicValue((ctx) => new LogExerciseUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
container
  .bind(TYPES.GetUserStatsUseCase)
  .toDynamicValue((ctx) => new GetUserStatsUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
container
  .bind(TYPES.GetExerciseHistoryUseCase)
  .toDynamicValue((ctx) => new GetExerciseHistoryUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
container
  .bind(TYPES.ManageFavoriteExercisesUseCase)
  .toDynamicValue((ctx) => new ManageFavoriteExercisesUseCase(ctx.container.get(TYPES.ExerciseRepository)))
  .inSingletonScope()
//
container.bind(TYPES.FirebaseApp).toConstantValue(firebaseApp)

export { container }
