import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise'

export const EXERCISES: Exercise[] = [
  // Группа "Техника"
  {
    id: '11',
    name: 'Shadow boxing',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  {
    id: '12',
    name: 'Shadow boxing with additional weight',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  {
    id: '27',
    name: 'Boxing school (technique)',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  {
    id: '16',
    name: 'Footwork drills',
    category: ExerciseCategory.TECHNIQUE,
    measurement: 'minutes'
  },
  // {
  //   id: '33_t',
  //   name: 'Custom (technique)',
  //   category: ExerciseCategory.TECHNIQUE,
  //   measurement: 'minutes',
  //   isCustom: true
  // },

  // Группа "Сила и Выносливость"
  {
    id: '1',
    name: 'Push-ups',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '6',
    name: 'Squats',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '8',
    name: 'Squats with additional weight',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '34',
    name: 'Pull-ups on the horizontal bar',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  {
    id: '16_s',
    name: 'Jumping rope',
    category: ExerciseCategory.PHYSICS,
    measurement: 'minutes'
  },
  {
    id: '31',
    name: 'Accelerated punches with additional weight',
    category: ExerciseCategory.PHYSICS,
    measurement: 'minutes'
  },
  {
    id: '24',
    name: 'Dumbbell strength exercises',
    category: ExerciseCategory.PHYSICS,
    measurement: 'repetitions'
  },
  // {
  //   id: '22',
  //   name: 'Crunches (hooks)',
  //   category: ExerciseCategory.PHYSICS,
  //   measurement: 'repetitions'
  // },

  // Группа "Практика"
  {
    id: '28',
    name: 'Punching the bag',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  {
    id: '26',
    name: 'Work on the pads',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  {
    id: '29',
    name: 'Exercises in pairs',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  {
    id: '30',
    name: 'Sparring',
    category: ExerciseCategory.PRACTICE,
    measurement: 'minutes'
  },
  // {
  //   id: '31_p',
  //   name: 'Кастом (практика)',
  //   category: ExerciseCategory.PRACTICE,
  //   measurement: 'minutes',
  //   isCustom: true
  // }
]
