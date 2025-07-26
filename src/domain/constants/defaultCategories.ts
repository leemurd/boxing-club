import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'

export const DEFAULT_CATEGORY_IDS = {
  SHORT: 'short-default',
  BASE: 'base-default',
  FEINTS: 'feints-default',
  STRAIGHT: 'straight-default',
  HOOKS: 'hooks-default'
} as const

export const DEFAULT_CATEGORIES: ComboCategory[] = [
  {
    id: DEFAULT_CATEGORY_IDS.SHORT,
    name: 'short'
  },
  {
    id: DEFAULT_CATEGORY_IDS.BASE,
    name: 'base'
  },
  {
    id: DEFAULT_CATEGORY_IDS.FEINTS,
    name: 'feints'
  },
  {
    id: DEFAULT_CATEGORY_IDS.STRAIGHT,
    name: 'straight'
  },
  {
    id: DEFAULT_CATEGORY_IDS.HOOKS,
    name: 'hooks'
  }
]
