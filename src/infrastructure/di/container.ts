import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import type {
  IPositionedActionRepository
} from '@/domain/repositories/IPositionedActionRepository.ts'
import {
  PositionedActionRepositoryMock
} from '@/infrastructure/repositoryImpl/PositionedActionRepositoryMock.ts'

const container = new Container();

container
  .bind<IPositionedActionRepository>(TYPES.IPositionedActionRepository)
  .to(PositionedActionRepositoryMock)
  .inSingletonScope();

export { container };
