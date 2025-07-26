// src/domain/constants/defaultExercises.ts
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise'
import { DEFAULT_TAG_IDS } from '@/domain/constants/defaultTags'

const DEFAULT_EXERCISE_IDS = {
  PHYSICS_PUSH_UPS: 'push-ups-default',
  PHYSICS_SQUATS: 'squats-default',
  PHYSICS_PULL_UPS: 'pull-ups-default',
  PHYSICS_TYSONS_PUSH_UPS: 'tysons-push-ups-default',
  PHYSICS_LUNGES: 'lunges-default',
  PHYSICS_JUMPING_ROPE: 'jumping-rope-default',
  PHYSICS_RUNNING: 'running-default',

  TECHNIQUE_BOXING_SCHOOL: 'boxing-school-default',
  TECHNIQUE_SHADOW_BOXING: 'shadow-boxing-default',
  TECHNIQUE_FOOTWORK: 'footwork-default',

  PRACTICE_PUNCHING_BAG: 'punching-bag-default',
  PRACTICE_WORK_WITH_PADS: 'work-with-pads-default',
  PRACTICE_EX_IN_PAIRS: 'exercises-in-pairs-default',
  PRACTICE_SPARRING: 'sparring-default'
} as const

export const defaultExercise: Exercise = {
  id: '',
  name: '',
  category: ExerciseCategory.PHYSICS,
  measurement: 'repetitions',
  canBeWeighted: false,
  canBeAccelerated: false,
  alwaysWeighted: false,
  alwaysAccelerated: false,
  tagIds: [],
  isFavorite: false,
  canHaveCombo: false
}

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: DEFAULT_EXERCISE_IDS.PHYSICS_PUSH_UPS,
    name: 'Push ups',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.HANDS],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: DEFAULT_EXERCISE_IDS.PHYSICS_SQUATS,
    name: 'Squats / Jump Squats',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.LEGS],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: DEFAULT_EXERCISE_IDS.PHYSICS_PULL_UPS,
    name: 'Pull ups',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.HANDS, DEFAULT_TAG_IDS.BACK],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: DEFAULT_EXERCISE_IDS.PHYSICS_TYSONS_PUSH_UPS,
    name: "Tyson's push ups",
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [
      DEFAULT_TAG_IDS.HANDS,
      DEFAULT_TAG_IDS.BACK,
      DEFAULT_TAG_IDS.LEGS,
      DEFAULT_TAG_IDS.PRESS
    ],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: DEFAULT_EXERCISE_IDS.PHYSICS_LUNGES,
    name: 'Lunges / Jump Lunges',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions',
    canBeWeighted: true,
    canBeAccelerated: true,
    tagIds: [DEFAULT_TAG_IDS.LEGS],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: DEFAULT_EXERCISE_IDS.PHYSICS_JUMPING_ROPE,
    name: 'Jumping rope',
    category: ExerciseCategory.PHYSICS,
    measurement: 'seconds',
    canBeWeighted: false,
    canBeAccelerated: true,
    tagIds: [DEFAULT_TAG_IDS.CARDIO],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: DEFAULT_EXERCISE_IDS.PHYSICS_RUNNING,
    name: 'Running',
    category: ExerciseCategory.PHYSICS,
    measurement: 'seconds',
    canBeWeighted: true,
    canBeAccelerated: true,
    tagIds: [DEFAULT_TAG_IDS.CARDIO, DEFAULT_TAG_IDS.LEGS],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: DEFAULT_EXERCISE_IDS.TECHNIQUE_BOXING_SCHOOL,
    name: 'Boxing school',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'seconds',
    canBeWeighted: false,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.PRACTICE],
    isFavorite: false,
    canHaveCombo: true
  },
  {
    id: DEFAULT_EXERCISE_IDS.TECHNIQUE_SHADOW_BOXING,
    name: 'Shadow boxing',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'seconds',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.PRACTICE, DEFAULT_TAG_IDS.CARDIO],
    isFavorite: false,
    canHaveCombo: true
  },
  {
    id: DEFAULT_EXERCISE_IDS.TECHNIQUE_FOOTWORK,
    name: 'Footwork',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'seconds',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.LEGS],
    isFavorite: false,
    canHaveCombo: true
  },
  {
    id: DEFAULT_EXERCISE_IDS.PRACTICE_PUNCHING_BAG,
    name: 'Punching bag',
    category: ExerciseCategory.PRACTICE,
    measurement: 'seconds',
    canBeWeighted: false,
    canBeAccelerated: true,
    tagIds: [DEFAULT_TAG_IDS.CARDIO, DEFAULT_TAG_IDS.HANDS, DEFAULT_TAG_IDS.TECHNIQUE],
    isFavorite: false,
    canHaveCombo: true
  },
  {
    id: DEFAULT_EXERCISE_IDS.PRACTICE_WORK_WITH_PADS,
    name: 'Work with pads',
    category: ExerciseCategory.PRACTICE,
    measurement: 'seconds',
    canBeWeighted: false,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.TECHNIQUE, DEFAULT_TAG_IDS.CARDIO],
    isFavorite: false,
    canHaveCombo: true
  },
  {
    id: DEFAULT_EXERCISE_IDS.PRACTICE_EX_IN_PAIRS,
    name: 'Exercises in pairs',
    category: ExerciseCategory.PRACTICE,
    measurement: 'seconds',
    canBeWeighted: false,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.TECHNIQUE, DEFAULT_TAG_IDS.CARDIO],
    isFavorite: false,
    canHaveCombo: true
  },
  {
    id: DEFAULT_EXERCISE_IDS.PRACTICE_SPARRING,
    name: 'Sparring',
    category: ExerciseCategory.PRACTICE,
    measurement: 'seconds',
    canBeWeighted: false,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.CARDIO, DEFAULT_TAG_IDS.HANDS, DEFAULT_TAG_IDS.LEGS],
    isFavorite: false,
    canHaveCombo: true
  }
]
