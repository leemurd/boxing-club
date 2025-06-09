// src/infrastructure/di/container.ts
import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
// Firebase
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig'
// Repositories
import type { IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository'
import { BoxingActionRepositoryMock } from '@/infrastructure/data/BoxingActionRepositoryMock'

import type { IAuthRepository } from '@/domain/repositories/IAuthRepository'
import { AuthRepositoryFirebase } from '@/infrastructure/data/AuthRepositoryFirebase'

import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserRepositoryFirebase } from '@/infrastructure/data/UserRepositoryFirebase'

import type { IExerciseRepository } from '@/domain/repositories/IExerciseRepository'
import { ExerciseRepositoryImpl } from '@/infrastructure/data/ExerciseRepositoryImpl'

import type { ICombinationRepository } from '@/domain/repositories/ICombinationRepository'
import { CombinationRepositoryImpl } from '@/infrastructure/data/CombinationRepositoryImpl'

import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { CategoryRepositoryImpl } from '@/infrastructure/data/CategoryRepositoryImpl'

import type { ITrainingRepository } from '@/domain/repositories/ITrainingRepository'
import { TrainingRepositoryImpl } from '@/infrastructure/data/TrainingRepositoryImpl'

import type { ITagRepository } from '@/domain/repositories/ITagRepository.ts'
import { TagRepositoryImpl } from '@/infrastructure/data/TagRepositoryImpl.ts'
// Use-cases — прогресс
import { LogExerciseUseCase } from '@/application/useCases/record/LogExerciseUseCase'
import { GetRecordsUseCase } from '@/application/useCases/record/GetRecordsUseCase'
import { DeleteRecordUseCase } from '@/application/useCases/record/DeleteRecordUseCase'
// Use-cases — упражнений
import { GetExercisesUseCase } from '@/application/useCases/exercise/GetExercisesUseCase'
import { GetExerciseByIdUseCase } from '@/application/useCases/exercise/GetExerciseByIdUseCase'
import { CreateExerciseUseCase } from '@/application/useCases/exercise/CreateExerciseUseCase'
import { UpdateExerciseUseCase } from '@/application/useCases/exercise/UpdateExerciseUseCase'
import { DeleteExerciseUseCase } from '@/application/useCases/exercise/DeleteExerciseUseCase'
// Use-cases — комбо
import { GetCombinationsUseCase } from '@/application/useCases/combination/GetCombinationsUseCase'
import { GetPunchesUseCase } from '@/application/useCases/combination/GetPunchesUseCase.ts'
import { SaveCombinationUseCase } from '@/application/useCases/combination/SaveCombinationUseCase'
import { DeleteCombinationUseCase } from '@/application/useCases/combination/DeleteCombinationUseCase'
import { UpdateCombinationUseCase } from '@/application/useCases/combination/UpdateCombinationUseCase'
// Use-cases — категории
import { GetCategoriesUseCase } from '@/application/useCases/category/GetCategoriesUseCase'
import { CreateCategoryUseCase } from '@/application/useCases/category/CreateCategoryUseCase'
import { UpdateCategoryUseCase } from '@/application/useCases/category/UpdateCategoryUseCase'
import { DeleteCategoryUseCase } from '@/application/useCases/category/DeleteCategoryUseCase'
import { GetCategoryByIdUseCase } from '@/application/useCases/category/GetCategoryByIdUseCase'
import { GetTagsUseCase } from '@/application/useCases/tag/GetTagsUseCase.ts'
import { CreateTagUseCase } from '@/application/useCases/tag/CreateTagUseCase.ts'
import { DeleteTagUseCase } from '@/application/useCases/tag/DeleteTagUseCase.ts'
import { GetTagByIdUseCase } from '@/application/useCases/tag/GetTagByIdUseCase.ts'
import { UpdateTagUseCase } from '@/application/useCases/tag/UpdateTagUseCase.ts'
import { GetCombinationByIdUseCase } from '@/application/useCases/combination/GetCombinationByIdUseCase.ts'

const container = new Container()

// --- Firebase ---
container.bind(TYPES.FirebaseApp).toConstantValue(firebaseApp)

// --- Repositories ---
container.bind<IBoxingActionRepository>(TYPES.IPunchRepository).to(BoxingActionRepositoryMock).inSingletonScope()
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepositoryFirebase).inSingletonScope()
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryFirebase).inSingletonScope()
container.bind<IExerciseRepository>(TYPES.IExerciseRepository).to(ExerciseRepositoryImpl).inSingletonScope()
container.bind<ICombinationRepository>(TYPES.CombinationRepository).to(CombinationRepositoryImpl).inSingletonScope()
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepositoryImpl).inSingletonScope()
container.bind<ITagRepository>(TYPES.ITagRepository).to(TagRepositoryImpl).inSingletonScope()
container.bind<ITrainingRepository>(TYPES.ITrainingRepository).to(TrainingRepositoryImpl).inSingletonScope()

// --- Use Cases: progress ---
container.bind<LogExerciseUseCase>(TYPES.LogExerciseUseCase).to(LogExerciseUseCase).inSingletonScope()
container.bind<GetRecordsUseCase>(TYPES.GetRecordsUseCase).to(GetRecordsUseCase).inSingletonScope()
container.bind<DeleteRecordUseCase>(TYPES.DeleteRecordUseCase).to(DeleteRecordUseCase).inSingletonScope()
// --- Use Cases: упражнений ---
container.bind<GetExercisesUseCase>(TYPES.GetExercisesUseCase).to(GetExercisesUseCase).inSingletonScope()
container.bind<GetExerciseByIdUseCase>(TYPES.GetExerciseByIdUseCase).to(GetExerciseByIdUseCase).inSingletonScope()
container.bind<CreateExerciseUseCase>(TYPES.CreateExerciseUseCase).to(CreateExerciseUseCase).inSingletonScope()
container.bind<UpdateExerciseUseCase>(TYPES.UpdateExerciseUseCase).to(UpdateExerciseUseCase).inSingletonScope()
container.bind<DeleteExerciseUseCase>(TYPES.DeleteExerciseUseCase).to(DeleteExerciseUseCase).inSingletonScope()
// --- Use Cases: комбо ---
container.bind<GetCombinationsUseCase>(TYPES.GetCombinationsUseCase).to(GetCombinationsUseCase).inSingletonScope()
container.bind<SaveCombinationUseCase>(TYPES.SaveCombinationUseCase).to(SaveCombinationUseCase).inSingletonScope()
container.bind<DeleteCombinationUseCase>(TYPES.DeleteCombinationUseCase).to(DeleteCombinationUseCase).inSingletonScope()
container.bind<UpdateCombinationUseCase>(TYPES.UpdateCombinationUseCase).to(UpdateCombinationUseCase).inSingletonScope()
container.bind<GetPunchesUseCase>(TYPES.GetPunchesUseCase).to(GetPunchesUseCase).inSingletonScope()
container.bind<GetCombinationByIdUseCase>(TYPES.GetCombinationByIdUseCase).to(GetCombinationByIdUseCase).inSingletonScope()
// --- Use Cases: категории ---
container.bind<GetCategoriesUseCase>(TYPES.GetCategoriesUseCase).to(GetCategoriesUseCase).inSingletonScope()
container.bind<CreateCategoryUseCase>(TYPES.CreateCategoryUseCase).to(CreateCategoryUseCase).inSingletonScope()
container.bind<UpdateCategoryUseCase>(TYPES.UpdateCategoryUseCase).to(UpdateCategoryUseCase).inSingletonScope()
container.bind<DeleteCategoryUseCase>(TYPES.DeleteCategoryUseCase).to(DeleteCategoryUseCase).inSingletonScope()
container.bind<GetCategoryByIdUseCase>(TYPES.GetCategoryByIdUseCase).to(GetCategoryByIdUseCase).inSingletonScope()
// --- Use Cases: tags ---
container.bind<GetTagsUseCase>(TYPES.GetTagsUseCase).to(GetTagsUseCase).inSingletonScope()
container.bind<GetTagByIdUseCase>(TYPES.GetTagByIdUseCase).to(GetTagByIdUseCase).inSingletonScope()
container.bind<CreateTagUseCase>(TYPES.CreateTagUseCase).to(CreateTagUseCase).inSingletonScope()
container.bind<DeleteTagUseCase>(TYPES.DeleteTagUseCase).to(DeleteTagUseCase).inSingletonScope()
container.bind<UpdateTagUseCase>(TYPES.UpdateTagUseCase).to(UpdateTagUseCase).inSingletonScope()

export { container }
