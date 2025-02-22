import 'reflect-metadata';
import { Container } from 'inversify';

import { TYPES } from './types';
import { type IBoxingActionRepository } from '@/domain/repositories/IBoxingActionRepository.ts';
// import { IBoxingActionRepository } from '@/infrastructure/repositoryImpl/BoxingActionRepositoryMock.ts';
import { BoxingActionRepositoryMock } from '@/infrastructure/repositoryImpl/BoxingActionRepositoryMock.ts';

import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase.ts';

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

export { container };
