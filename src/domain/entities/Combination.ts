import type { BoxingAction } from '@/domain/entities/BoxingAction'

export interface Combination {
  id: string
  title: string
  punches: BoxingAction[]
  categoryIds: string[]
}
