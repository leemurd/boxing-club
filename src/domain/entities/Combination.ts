import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

/**
 * Модель «Комбинация ударов» (связка)
 */
export class Combination {
  constructor(
    public id: number,
    public title: string,
    public punches: BoxingAction[] = []
  ) {}
}
