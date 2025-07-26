// src/domain/constants/defaultTags.ts

export const DEFAULT_TAG_IDS = {
  WEIGHT: 'tag-weight-default', // «с доп. весом»
  PACE: 'tag-pace-default', // «в ускорённом темпе»

  PHYSICS: 'tag-physics-default', // «Physics»
  PRACTICE: 'tag-practice-default', // «Practice»
  TECHNIQUE: 'tag-technique-default', // «Technique»

  CARDIO: 'tag-cardio-default', // «Cardio»
  HANDS: 'tag-hands-default', // «Hands»
  LEGS: 'tag-legs-default', // «Legs»
  PRESS: 'tag-press-default', // «Press»
  BACK: 'tag-back-default' // «Back»
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
