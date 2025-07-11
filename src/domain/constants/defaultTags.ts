// src/domain/constants/defaultTags.ts

export const DEFAULT_TAG_IDS = {
  WEIGHT: 'tag-default-weight', // «с доп. весом»
  PACE: 'tag-default-pace', // «в ускорённом темпе»
  PHYSICS: 'tag-default-physics', // «Physics»
  PRACTICE: 'tag-default-practice', // «Practice»
  TECHNIQUE: 'tag-default-technique', // «Technique»
  CARDIO: 'tag-default-cardio', // «Cardio»
  HANDS: 'tag-default-hands', // «Hands»
  LEGS: 'tag-default-legs', // «Legs»
  PRESS: 'tag-default-press', // «Press»
  BACK: 'tag-default-back' // «Back»
} as const

export type DefaultTagId = (typeof DEFAULT_TAG_IDS)[keyof typeof DEFAULT_TAG_IDS]

export const DEFAULT_TAGS = [
  {
    id: DEFAULT_TAG_IDS.WEIGHT,
    name: 'With add. weight',
    isAutomatic: true
  },
  {
    id: DEFAULT_TAG_IDS.PACE,
    name: 'Accelerated',
    isAutomatic: true
  },
  {
    id: DEFAULT_TAG_IDS.PHYSICS,
    name: 'Physics',
    isAutomatic: true
  },
  {
    id: DEFAULT_TAG_IDS.PRACTICE,
    name: 'Practice',
    isAutomatic: true
  },
  {
    id: DEFAULT_TAG_IDS.TECHNIQUE,
    name: 'Technique',
    isAutomatic: true
  },
  {
    id: DEFAULT_TAG_IDS.CARDIO,
    name: 'Cardio'
  },
  {
    id: DEFAULT_TAG_IDS.HANDS,
    name: 'Hands'
  },
  {
    id: DEFAULT_TAG_IDS.LEGS,
    name: 'Legs'
  },
  {
    id: DEFAULT_TAG_IDS.PRESS,
    name: 'Press'
  },
  {
    id: DEFAULT_TAG_IDS.BACK,
    name: 'Back'
  }
] as const
