// src/domain/constants/exercises.ts
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise'
import { DEFAULT_TAG_IDS } from '@/domain/constants/defaultTags'

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

export const EXERCISES: Exercise[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
    name: "Tyson's push ups",
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.HANDS, DEFAULT_TAG_IDS.BACK, DEFAULT_TAG_IDS.LEGS, DEFAULT_TAG_IDS.PRESS],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: '5',
    name: 'Lunges / Jump Lunges',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions',
    canBeWeighted: true,
    canBeAccelerated: false,
    tagIds: [DEFAULT_TAG_IDS.LEGS],
    isFavorite: false,
    canHaveCombo: false
  },
  {
    id: '6',
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
    id: '7',
    name: 'Boxing school',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'seconds',
    canBeWeighted: false,
    canBeAccelerated: false,
    tagIds: [],
    isFavorite: false,
    canHaveCombo: true
  },
  {
    id: '8',
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
    id: '9',
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
    id: '10',
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
    id: '11',
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
    id: '12',
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
    id: '13',
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
