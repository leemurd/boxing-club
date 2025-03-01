import 'reflect-metadata';
import { Container } from 'inversify';

import { TYPES } from './types';
import { type IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository.ts';
import { BoxingActionRepositoryMock } from '@/infrastructure/data/BoxingActionRepositoryMock.ts';

import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase.ts';
import { firebaseApp } from '@/infrastructure/firebase/firebaseConfig.ts'

const container = new Container();

// Регистрируем репозиторий
container
  .bind<IBoxingActionRepository>(TYPES.IPunchRepository)
  .to(BoxingActionRepositoryMock)
  .inSingletonScope();

// Регистрируем UseCase
container
  .bind<GetPunchesUseCase>(TYPES.GetPunchesUseCase)
  .to(GetPunchesUseCase)
  .inSingletonScope();

container.bind(TYPES.FirebaseApp).toConstantValue(firebaseApp)
// container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryFirebase)

export { container };
