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

import { LogExerciseUseCase } from '@/application/useCases/exercise/LogExerciseUseCase.ts'
import { GetUserStatsUseCase } from '@/application/useCases/user/GetUserStatsUseCase.ts'
import { GetExerciseHistoryUseCase } from '@/application/useCases/exercise/GetExerciseHistoryUseCase.ts'
import { ManageFavoriteExercisesUseCase } from '@/application/useCases/exercise/ManageFavoriteExercisesUseCase.ts'
import { ExerciseRepositoryImpl } from '@/infrastructure/data/ExerciseRepositoryImpl'
// combos
import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository'
import { CombinationRepositoryImpl } from '@/infrastructure/data/CombinationRepositoryImpl'
import { GetCombinationsUseCase } from '@/application/useCases/combination/GetCombinationsUseCase.ts'
import { SaveCombinationUseCase } from '@/application/useCases/combination/SaveCombinationUseCase.ts'
import { DeleteCombinationUseCase } from '@/application/useCases/combination/DeleteCombinationUseCase.ts'
import { UpdateCombinationUseCase } from '@/application/useCases/combination/UpdateCombinationUseCase.ts'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository.ts'
import { CategoryRepositoryImpl } from '@/infrastructure/data/CategoryRepositoryImpl.ts'

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

// combos
container.bind<ICombinationRepository>(TYPES.CombinationRepository).to(CombinationRepositoryImpl).inSingletonScope()
container.bind<GetCombinationsUseCase>(TYPES.GetCombinationsUseCase).to(GetCombinationsUseCase).inSingletonScope()
container.bind<SaveCombinationUseCase>(TYPES.SaveCombinationUseCase).to(SaveCombinationUseCase).inSingletonScope()
container.bind<DeleteCombinationUseCase>(TYPES.DeleteCombinationUseCase).to(DeleteCombinationUseCase).inSingletonScope()
container.bind<UpdateCombinationUseCase>(TYPES.UpdateCombinationUseCase).to(UpdateCombinationUseCase).inSingletonScope()

container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepositoryImpl).inSingletonScope()

export { container }
