// src/infrastructure/di/resolver.ts

import { container } from './container'

/**
 * Быстрый резолвер use-case’ов из Inversify-контейнера
 */
export function getUC<T>(identifier: symbol): T {
  return container.get<T>(identifier)
}
