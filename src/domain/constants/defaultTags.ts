// src/domain/constants/defaultTags.ts

/** Жёстко фиксированные ID для системных тегов */
export const DEFAULT_TAG_IDS = {
  WEIGHT: 'tag-default-weight', // ID для «с доп. весом»
  PACE: 'tag-default-pace' // ID для «в ускорённом темпе»
} as const

/** Список системных тегов с их ID и именами */
export const DEFAULT_TAGS = [
  {
    id: DEFAULT_TAG_IDS.WEIGHT,
    name: 'с доп. весом'
  },
  {
    id: DEFAULT_TAG_IDS.PACE,
    name: 'в ускорённом темпе'
  }
] as const
